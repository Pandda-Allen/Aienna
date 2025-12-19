import { create } from 'zustand';
import { Work, worksService } from '../services/works';

interface WorksState {
  // State
  trendingWorks: Work[];
  searchResults: Work[];
  userWorks: Work[];
  favoriteWorks: Work[];
  currentWork: Work | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTrending: () => Promise<void>;
  searchWorks: (query: string) => Promise<void>;
  fetchWorkById: (id: string) => Promise<Work | null>;
  fetchUserWorks: (userId: string) => Promise<void>;
  fetchUserFavorites: (userId: string) => Promise<void>;
  createWork: (work: Partial<Work>) => Promise<Work | null>;
  updateWork: (id: string, updates: Partial<Work>) => Promise<void>;
  deleteWork: (id: string) => Promise<boolean>;
  toggleLike: (id: string) => Promise<void>;
  setCurrentWork: (work: Work | null) => void;
  clearError: () => void;
}

export const useWorksStore = create<WorksState>((set, get) => ({
  trendingWorks: [],
  searchResults: [],
  userWorks: [],
  favoriteWorks: [],
  currentWork: null,
  isLoading: false,
  error: null,

  fetchTrending: async () => {
    set({ isLoading: true, error: null });
    try {
      const works = await worksService.getTrending();
      set({ trendingWorks: works, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: '获取Trending作品失败' });
    }
  },

  searchWorks: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const results = await worksService.search(query);
      set({ searchResults: results, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: '搜索失败' });
    }
  },

  fetchWorkById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const work = await worksService.getById(id);
      if (work) {
        set({ currentWork: work, isLoading: false });
      } else {
        set({ isLoading: false, error: '未找到作品' });
      }
      return work;
    } catch (err) {
      set({ isLoading: false, error: '获取作品详情失败' });
      return null;
    }
  },

  fetchUserWorks: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const works = await worksService.getByUserId(userId);
      set({ userWorks: works, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: '获取用户作品失败' });
    }
  },

  fetchUserFavorites: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const works = await worksService.getFavorites(userId);
      set({ favoriteWorks: works, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: '获取收藏列表失败' });
    }
  },

  createWork: async (workData) => {
    set({ isLoading: true, error: null });
    try {
      const newWork = await worksService.create(workData);
      set((state) => ({
        userWorks: [newWork, ...state.userWorks],
        isLoading: false,
      }));
      return newWork;
    } catch (err) {
      set({ isLoading: false, error: '创建作品失败' });
      return null;
    }
  },

  updateWork: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedWork = await worksService.update(id, updates);
      if (updatedWork) {
        const updateList = (list: Work[]) => list.map((w) => (w.id === id ? updatedWork : w));
        set((state) => ({
          trendingWorks: updateList(state.trendingWorks),
          searchResults: updateList(state.searchResults),
          userWorks: updateList(state.userWorks),
          favoriteWorks: updateList(state.favoriteWorks),
          currentWork: state.currentWork?.id === id ? updatedWork : state.currentWork,
          isLoading: false,
        }));
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false, error: '更新作品失败' });
    }
  },

  deleteWork: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const success = await worksService.delete(id);
      if (success) {
        const filterList = (list: Work[]) => list.filter((w) => w.id !== id);
        set((state) => ({
          trendingWorks: filterList(state.trendingWorks),
          searchResults: filterList(state.searchResults),
          userWorks: filterList(state.userWorks),
          favoriteWorks: filterList(state.favoriteWorks),
          currentWork: state.currentWork?.id === id ? null : state.currentWork,
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: '删除失败' });
      }
      return success;
    } catch (err) {
      set({ isLoading: false, error: '删除作品失败' });
      return false;
    }
  },

  toggleLike: async (id) => {
    // 乐观更新
    set((state) => {
      const toggle = (list: Work[]) =>
        list.map((w) => {
          if (w.id === id) {
            const newIsLiked = !w.is_liked;
            return {
              ...w,
              is_liked: newIsLiked,
              likes_count: w.likes_count + (newIsLiked ? 1 : -1),
            };
          }
          return w;
        });

      const updatedCurrentWork = state.currentWork?.id === id
        ? {
            ...state.currentWork,
            is_liked: !state.currentWork.is_liked,
            likes_count: state.currentWork.likes_count + (!state.currentWork.is_liked ? 1 : -1),
          }
        : state.currentWork;
      
      return {
        trendingWorks: toggle(state.trendingWorks),
        searchResults: toggle(state.searchResults),
        userWorks: toggle(state.userWorks),
        favoriteWorks: toggle(state.favoriteWorks),
        currentWork: updatedCurrentWork,
      };
    });

    try {
      await worksService.toggleLike(id);
    } catch (err) {
      console.error('Like toggle failed', err);
    }
  },

  setCurrentWork: (work) => set({ currentWork: work }),
  clearError: () => set({ error: null }),
}));