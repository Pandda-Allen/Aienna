import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * User Interface
 * 用户数据模型
 * 区分 'user' 和 'admin' 角色
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // 新增：密码字段 (注意：真实生产环境中不应在前端存储或返回明文密码)
  avatar: string;
  bio?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt?: string;
  themePreference?: string;
}

// 模拟内存数据库
// 预置了普通用户和管理员用户，包含密码字段
let MOCK_USERS: User[] = [
  {
    id: 'user_01',
    name: 'Alex Chen',
    email: 'alex@example.com',
    password: 'password123', // 模拟密码
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
    password: 'admin123', // 模拟密码
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
  // 用户登录
  loginUser: async (email_address: string, password: string): Promise<User | null> => {
    // Supabase Auth 登录:
    const { data: authUser, error: authError } = await supabase.auth.signInWithPassword({
      email: email_address,
      password: password,
    });
    if (authError) throw authError;

    // 查询users表获取用户详细信息
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email_address)
      .single();
    if (userError) throw userError;
    return user;
  },

  // 用户登出（all session）
  logoutUser: async (): Promise<void> => {
    // Supabase Auth 登出:
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 检查邮箱是否存在
  checkEmailExists: async (email: string): Promise<boolean> => {
    // SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    return data !== null;
  },

  // 创建新用户 (注册)
  createUser: async (email_address: string, password: string, username: string): Promise<User> => {
    // Supabase Auth 注册:
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: email_address,
      password: password,
    });
    if (authError) throw authError;

    // 在users表中创建用户记录
    const newUser = {
      email: email_address,
      password: password,
      name: username,
      id: authUser.user?.id,
      bio: 'say something about yourself...',
      role: 'user', // 默认为普通用户
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      themePreference: 'blue',
    };

    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();
 
    if (error) throw error;
    return data;
  },

  // 更新用户信息
  updateUser: async (id: string, updates: Partial<User>): Promise<User | null> => {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;

  },

  // 重置密码
  resetPassword: async (email: string): Promise<boolean> => {
    // Supabase Auth 重置密码:
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/#/reset-password',
    });
    if (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
    return true;
  },

/*===================================================================================================*/

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
    // 返回数据时移除密码字段以模拟安全实践
    return MOCK_USERS.map(({ password, ...user }) => user as User);
  },

  // 根据 ID 获取用户详情
  getUserById: async (id: string): Promise<User | null> => {
    /* SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)\
      .single();
    
    if (error) throw error;
    return data;
    */
    await delay(300);
    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user) return null;
    const { password, ...userInfo } = user;
    return userInfo as User;
  },

  // 验证用户凭据 (登录)
  verifyCredentials: async (email: string, password: string): Promise<User | null> => {
    // SUPABASE IMPLEMENTATION:
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // 然后查询 users 表获取详细信息
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (userError) throw userError;
    return user;
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
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', id)
      .single();
    if (error) return false;
    return data?.role === 'admin';

  }
};