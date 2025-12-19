import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { userService, User } from '../services/user';


interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  themePreference: string;

  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setThemePreference: (theme: string) => void;
  resetPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  themePreference: 'blue',

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    // pre check
    if (!password || password.length < 8) {
      set({ isLoading: false, error: '密码长度需大于7位' });
      return false;
    }

    const account = await userService.loginUser(email, password);

    if (account) {
        set({ 
          user: account, 
          isAuthenticated: true, 
          isLoading: false,
          themePreference: account.themePreference || 'blue'
        });
        return true;
    }

    set({ isLoading: false, error: '用户不存在' });
    return false;
  },

  logout: async () => {
    await userService.logoutUser();
    set({ user: null, isAuthenticated: false, themePreference: 'blue' });
  },

  register: async (email, password, name) => {
    set({ isLoading: true, error: null });

    if ( await userService.checkEmailExists(email)) {
      set({ isLoading: false, error: '该邮箱已被注册' });
      return false;
    }

    const newUser = await userService.createUser( email, password, name );

    set({ 
      user: newUser, 
      isAuthenticated: true, 
      isLoading: false,
      themePreference: 'blue'
    });
    
    return true;
  },

  updateProfile: async (updates) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    set({ user: updatedUser });

    // 后台同步更新
    try {
      await userService.updateUser(updatedUser.id, updates);
    } catch (error) {
      set({ error: '更新用户信息失败' });
    }
  },

  setThemePreference: (theme) => {
    // set((state) => {
    //   if (state.user) {
    //     const updatedUser = { ...state.user, themePreference: theme };
    //     const index = MOCK_USERS.findIndex(u => u.id === state.user!.id);
    //     if (index !== -1) {
    //       MOCK_USERS[index] = updatedUser;
    //     }
    //     return { themePreference: theme, user: updatedUser };
    //   }
    //   return { themePreference: theme };
    // });
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    await userService.resetPassword(email);
    set({ isLoading: false });
    return true;
  },

  clearError: () => set({ error: null })
}));