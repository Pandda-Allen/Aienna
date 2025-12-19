import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Asset Interface
 * 灵感/素材单元，是构成 Work 的基础
 * 对应数据库中的 assets 表
 */
export interface Asset {
  id: string;
  author_id: string;
  title?: string;
  content: string;
  type: 'idea' | 'text' | 'image' | 'audio' | 'link' | 'character' | 'setting';
  tags: string[];
  related_assets: string[]; // 关联的其他 Asset ID
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

/**
 * Work Interface Definition
 * 对应数据库中的 works 表结构
 * 新增 type 字段区分作品类型，支持由多个 Asset 组成
 */
export interface Work {
  id: string;
  title: string;
  author: string;
  author_id: string; // 关联 users 表
  description: string;
  content: string;
  image: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  is_liked: boolean; // 虚拟字段，表示当前用户是否收藏
  status: 'draft' | 'published';
  tags: string[];
  // 新增字段
  type: 'novel' | 'comic' | 'script' | 'world' | 'game' | 'article'; 
  asset_ids: string[]; // 关联的 Asset ID 列表
}

// 模拟网络延迟，用于演示 Loading 状态
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 预置 Mock 数据
let MOCK_WORKS: Work[] = [
  {
    id: '1',
    title: '晨曦中的城市',
    author: 'Alex Chen',
    author_id: 'user_01',
    description: '捕捉清晨第一缕阳光洒在摩天大楼上的瞬间，光影交错的迷人景色。',
    content: '这里是详细的文章内容...',
    image: 'https://hpi-hub.tos-cn-beijing.volces.com/static/other/47049e058c7ec0d2bc9493f49ecfe05b.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    likes_count: 128,
    is_liked: false,
    status: 'published',
    tags: ['摄影', '城市', '灵感'],
    type: 'article',
    asset_ids: []
  },
  {
    id: '2',
    title: '极简主义生活指南',
    author: 'Sarah Jones',
    author_id: 'user_02',
    description: '如何在繁杂的生活中找到内心的平静，断舍离的艺术。',
    content: '这里是详细的文章内容...',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    likes_count: 342,
    is_liked: true,
    status: 'published',
    tags: ['生活', '极简', '心得'],
    type: 'article',
    asset_ids: []
  },
  {
    id: '3',
    title: '未来的设计趋势',
    author: 'David Lee',
    author_id: 'user_03',
    description: '探索2025年UI/UX设计的新风向，AI辅助设计的可能性。',
    content: '这里是详细的文章内容...',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    likes_count: 89,
    is_liked: false,
    status: 'published',
    tags: ['设计', '科技', '未来'],
    type: 'article',
    asset_ids: []
  }
];

/**
 * Works Service
 * 封装了作品相关的 CRUD 操作
 * 包含 Mock 实现和 Supabase 实现的注释
 */
export const worksService = {
  // 获取 Trending 作品
  getTrending: async (): Promise<Work[]> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .eq('status', 'published')
      .order('likes_count', { ascending: false })
      .limit(20);
    
    if (error) throw error;
    return data || [];
    */
    await delay(800);
    return [...MOCK_WORKS].sort((a, b) => b.likes_count - a.likes_count);
  },

  // 搜索作品 (模糊搜索 + 关键字)
  search: async (query: string): Promise<Work[]> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`); // 假设 tags 是数组类型
    
    if (error) throw error;
    return data || [];
    */
    await delay(600);
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    return MOCK_WORKS.filter(
      (w) =>
        w.status === 'published' &&
        (w.title.toLowerCase().includes(lowerQuery) ||
          w.description.toLowerCase().includes(lowerQuery) ||
          w.tags.some((t) => t.toLowerCase().includes(lowerQuery)) ||
          w.id === query)
    );
  },

  // 获取单个作品详情
  getById: async (id: string): Promise<Work | null> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('works')
      .select(`
        *,
        author:users(name, avatar) -- 关联查询作者信息
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
    */
    await delay(400);
    return MOCK_WORKS.find((w) => w.id === id) || null;
  },

  // 获取指定用户的作品
  getByUserId: async (userId: string): Promise<Work[]> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
    */
    await delay(500);
    return MOCK_WORKS.filter((w) => w.author_id === userId);
  },

  // 获取用户收藏的作品
  getFavorites: async (userId: string): Promise<Work[]> => {
    /* SUPABASE IMPLEMENTATION:
    // 需要通过关联表 favorites 查询
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        work_id,
        work:works(*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data.map((item: any) => item.work) || [];
    */
    await delay(600);
    // Mock: 简单返回 is_liked 为 true 的作品 (实际应根据 userId 过滤)
    return MOCK_WORKS.filter((w) => w.is_liked);
  },

  // 创建新作品
  create: async (work: Partial<Work>): Promise<Work> => {
    /* SUPABASE IMPLEMENTATION:
    const newWork = {
      ...work,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes_count: 0
    };
    const { data, error } = await supabase
      .from('works')
      .insert([newWork])
      .select()
      .single();
    
    if (error) throw error;
    return data;
    */
    await delay(800);
    const newWork: Work = {
      id: uuidv4(),
      title: work.title || '无标题',
      author: work.author || 'Anonymous',
      author_id: work.author_id || 'guest',
      description: work.description || '',
      content: work.content || '',
      image: work.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes_count: 0,
      is_liked: false,
      status: (work.status as 'draft' | 'published') || 'draft',
      tags: work.tags || [],
      type: work.type || 'article',
      asset_ids: work.asset_ids || []
    };
    MOCK_WORKS.unshift(newWork);
    return newWork;
  },

  // 更新作品
  update: async (id: string, updates: Partial<Work>): Promise<Work | null> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('works')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
    */
    await delay(500);
    const index = MOCK_WORKS.findIndex((w) => w.id === id);
    if (index === -1) return null;
    MOCK_WORKS[index] = { ...MOCK_WORKS[index], ...updates, updated_at: new Date().toISOString() };
    return MOCK_WORKS[index];
  },

  // 删除作品
  delete: async (id: string): Promise<boolean> => {
    /* SUPABASE IMPLEMENTATION:
    const { error } = await supabase
      .from('works')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
    */
    await delay(400);
    const initialLen = MOCK_WORKS.length;
    MOCK_WORKS = MOCK_WORKS.filter((w) => w.id !== id);
    return MOCK_WORKS.length < initialLen;
  },

  // 切换收藏状态
  toggleLike: async (id: string): Promise<boolean> => {
    /* SUPABASE IMPLEMENTATION:
    // 这是一个复合操作，需要处理 favorites 表和 works 表的计数
    // 通常可以通过 Supabase 的 RPC (Stored Procedure) 来保证原子性
    const { data, error } = await supabase.rpc('toggle_like', { work_id_input: id });
    if (error) throw error;
    return data; // 返回最新的 is_liked 状态
    */
    await delay(300);
    const work = MOCK_WORKS.find((w) => w.id === id);
    if (work) {
      work.is_liked = !work.is_liked;
      work.likes_count += work.is_liked ? 1 : -1;
      return work.is_liked;
    }
    return false;
  },
};