// content-creator-platform-151821/frontend/src/services/user.ts

import { supabase } from '../services/supabase';
import { v4 as uuidv4 } from 'uuid';
import type { User } from '../services/user';


// 模拟内存数据库
let MOCK_USERS: User[] = [
  {
    id: 'user_01',
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://hpi-hub.tos-cn-beijing.volces.com/static/key_2d/brown2Woman6_1756179580396-1253.png',
    bio: '热爱摄影与城市探索',
    role: 'user', // 普通用户
    createdAt: '2023-01-15T08:30:00.000Z',
    updatedAt: '2023-01-15T08:30:00.000Z',
    themePreference: 'blue'
  },
  {
    id: 'admin_01',
    name: 'Admin Master',
    email: 'admin@creata.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff',
    bio: '系统管理员',
    role: 'admin', // 管理员用户
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    themePreference: 'purple'
  }
];

// 模拟网络延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * User Service
 * 用户数据管理服务
 * 包含 Mock 实现和 Supabase 交互注释
 */
export const userService = {
  // 获取所有用户 (管理员权限)
  getAllUsers: async (): Promise<User[]> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
    */
    await delay(500);
    return [...MOCK_USERS];
  },

  // 根据 ID 获取用户详情
  getUserById: async (id: string): Promise<User | null> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
    */
    await delay(300);
    return MOCK_USERS.find((u) => u.id === id) || null;
  },

  // 创建新用户 (注册)
  createUser: async (userData: Partial<User>): Promise<User> => {
    /* SUPABASE IMPLEMENTATION:
    // 通常注册由 Supabase Auth 处理，这里主要处理 users 表的记录创建
    const newUser = {
      ...userData,
      role: 'user', // 默认为普通用户
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();
    
    if (error) throw error;
    return data;
    */
    await delay(600);
    const newUser: User = {
      id: userData.id || uuidv4(),
      name: userData.name || 'New User',
      email: userData.email || '',
      avatar: userData.avatar || 'https://ui-avatars.com/api/?name=User',
      bio: userData.bio || '',
      role: (userData.role as 'user' | 'admin') || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      themePreference: 'blue',
      ...userData
    };
    MOCK_USERS.push(newUser);
    return newUser;
  },

  // 更新用户信息
  updateUser: async (id: string, updates: Partial<User>): Promise<User | null> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
    */
    await delay(400);
    const index = MOCK_USERS.findIndex((u) => u.id === id);
    if (index === -1) return null;

    MOCK_USERS[index] = {
      ...MOCK_USERS[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return MOCK_USERS[index];
  },

  // 删除用户 (管理员权限)
  deleteUser: async (id: string): Promise<boolean> => {
    /* SUPABASE IMPLEMENTATION:
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
    */
    await delay(500);
    const initialLen = MOCK_USERS.length;
    MOCK_USERS = MOCK_USERS.filter((u) => u.id !== id);
    return MOCK_USERS.length < initialLen;
  },

  // 检查是否为管理员 (辅助方法)
  isAdmin: async (id: string): Promise<boolean> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', id)
      .single();
    if (error) return false;
    return data?.role === 'admin';
    */
   await delay(200);
   const user = MOCK_USERS.find(u => u.id === id);
   return user?.role === 'admin';
  }
};