import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Asset Interface
 * 灵感片段/素材的数据结构
 * 是构成 Work 的最小单元，支持相互关联和组合
 */
export interface Asset {
  id: string;
  author_id: string; // 关联用户
  title: string;     // 标题
  content: string;   // 核心内容
  type: 'idea' | 'text' | 'image' | 'audio' | 'link' | 'character' | 'setting'; // 素材类型

  // --- 新增字段 ---
  work_id?: string;    // 关联的作品ID
  parent_id?: string;  // 父级Asset ID
  
  // 元数据 (结构化字段)
  metadata: {
    age?: number;
    gender?: string;
    tags?: string[]; // 结构化标签
    [key: string]: any;
  };

  isReleaseUnit: boolean; // 是否可作为单独发布
  releaseKind: 'chapter' | 'episode' | 'bundle' | 'bonus'; // 发布类型
  pricingPlanId?: string; // 收费配置ID
  // ----------------

  tags: string[];    // 顶层标签 (保持兼容，通常与 metadata.tags 同步)
  related_assets: string[]; // 关联的其他 Asset ID (实现组合逻辑)
  created_at: string;
  updated_at: string;
}

// 模拟数据存储 (Memory Cache)
let MOCK_ASSETS: Asset[] = [
  {
    id: 'asset_demo_01',
    author_id: 'user_01',
    title: '赛博朋克-雨夜设定',
    content: '霓虹灯下的雨夜，全息广告牌在积水中倒映出破碎的光影。义体医生在巷子深处低声叫卖，空气中弥漫着机油与酸雨混合的味道。',
    type: 'setting',
    work_id: undefined,
    parent_id: undefined,
    metadata: {
      tags: ['科幻', '场景', '氛围']
    },
    isReleaseUnit: false,
    releaseKind: 'chapter',
    tags: ['科幻', '场景', '氛围'],
    related_assets: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'asset_demo_02',
    author_id: 'user_01',
    title: '主角性格特征',
    content: '沉默寡言，右臂是老旧的军用义肢。这也导致他虽然战力强悍，但经常在雨天感到幻肢痛。',
    type: 'character',
    work_id: undefined,
    parent_id: undefined,
    metadata: {
      age: 28,
      gender: 'male',
      tags: ['主角', '人设']
    },
    isReleaseUnit: false,
    releaseKind: 'bonus',
    tags: ['主角', '人设'],
    related_assets: ['asset_demo_01'], // 关联到场景
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
  }
];

// 模拟网络延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Asset Service
 * 提供 Asset 的 CRUD 操作
 * 包含 Mock 实现和 Supabase 交互代码
 */
export const assetService = {
  // 获取指定用户的所有 Assets
  getUserAssets: async (userId: string): Promise<Asset[]> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
    */

    await delay(500);
    return MOCK_ASSETS
      .filter(asset => asset.author_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // 根据 ID 获取单个 Asset
  getAssetById: async (id: string): Promise<Asset | null> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
    */

    await delay(300);
    return MOCK_ASSETS.find(asset => asset.id === id) || null;
  },

  // 批量获取 Assets (通常用于 Work 组装时拉取相关素材)
  getAssetsByIds: async (ids: string[]): Promise<Asset[]> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .in('id', ids);
    
    if (error) throw error;
    return data || [];
    */

    await delay(400);
    return MOCK_ASSETS.filter(asset => ids.includes(asset.id));
  },

  // 获取 Work 关联的所有 Asset
  getWorkAssets: async (workId: string): Promise<Asset[]> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('work_id', workId);
    
    if (error) throw error;
    return data || [];
    */
    await delay(400);
    return MOCK_ASSETS.filter(a => a.work_id === workId);
  },

  // 创建新的 Asset
  createAsset: async (assetData: Partial<Asset>): Promise<Asset> => {
    /* SUPABASE IMPLEMENTATION:
    const newAsset = {
      ...assetData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('assets')
      .insert([newAsset])
      .select()
      .single();
    
    if (error) throw error;
    return data;
    */

    await delay(600);
    const newAsset: Asset = {
      id: uuidv4(),
      author_id: assetData.author_id || 'guest',
      title: assetData.title || '未命名灵感',
      content: assetData.content || '',
      type: assetData.type || 'idea',
      tags: assetData.tags || assetData.metadata?.tags || [],
      
      // 新增字段处理
      work_id: assetData.work_id,
      parent_id: assetData.parent_id,
      metadata: assetData.metadata || {},
      isReleaseUnit: assetData.isReleaseUnit || false,
      releaseKind: assetData.releaseKind || 'chapter',
      pricingPlanId: assetData.pricingPlanId,

      related_assets: assetData.related_assets || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    MOCK_ASSETS.unshift(newAsset);
    return newAsset;
  },

  // 更新 Asset
  updateAsset: async (id: string, updates: Partial<Asset>): Promise<Asset | null> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('assets')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
    */

    await delay(400);
    const index = MOCK_ASSETS.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    MOCK_ASSETS[index] = {
      ...MOCK_ASSETS[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    return MOCK_ASSETS[index];
  },

  // 创建或更新 (Upsert)
  upsertAsset: async (assetData: Partial<Asset>): Promise<Asset> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('assets')
      .upsert({ ...assetData, updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
    */
   
    await delay(500);
    if (assetData.id) {
       const existing = MOCK_ASSETS.find(a => a.id === assetData.id);
       if (existing) {
         // @ts-ignore
         return assetService.updateAsset(assetData.id, assetData);
       }
    }
    return assetService.createAsset(assetData);
  },

  // 删除 Asset
  deleteAsset: async (id: string): Promise<boolean> => {
    /* SUPABASE IMPLEMENTATION:
    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
    */

    await delay(300);
    const initialLen = MOCK_ASSETS.length;
    MOCK_ASSETS = MOCK_ASSETS.filter(a => a.id !== id);
    return MOCK_ASSETS.length < initialLen;
  },

  // 搜索 Assets
  searchAssets: async (query: string, userId?: string): Promise<Asset[]> => {
    /* SUPABASE IMPLEMENTATION:
    let queryBuilder = supabase.from('assets').select('*');
    if (userId) queryBuilder = queryBuilder.eq('author_id', userId);
    
    const { data, error } = await queryBuilder
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
    */

    await delay(400);
    const lowerQuery = query.toLowerCase();
    return MOCK_ASSETS.filter(asset => {
      const matchUser = userId ? asset.author_id === userId : true;
      const matchContent = 
        (asset.title || '').toLowerCase().includes(lowerQuery) || 
        asset.content.toLowerCase().includes(lowerQuery) ||
        asset.tags.some(t => t.toLowerCase().includes(lowerQuery)) ||
        (asset.metadata?.tags || []).some((t: string) => t.toLowerCase().includes(lowerQuery));
      return matchUser && matchContent;
    });
  }
};