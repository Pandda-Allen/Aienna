import { create } from 'zustand';

/**
 * 侧边栏动态项接口
 * 用于在侧边栏下方展示用户最近浏览的作品
 */
interface RecentWorkItem {
  id: string;
  title: string;
}

/**
 * Sidebar Store Interface
 * 管理侧边栏的选中状态、动态作品列表及折叠状态
 */
interface SidebarState {
  activeTab: string; // 当前选中的导航项 Key
  openedWorks: RecentWorkItem[]; // 动态添加的作品列表（类似于浏览历史或打开的标签）
  isCollapsed: boolean; // 侧边栏折叠状态
  
  // Actions
  setActiveTab: (tab: string) => void;
  addOpenedWork: (work: RecentWorkItem) => void;
  removeOpenedWork: (id: string) => void;
  clearOpenedWorks: () => void;
  toggleCollapse: () => void; // 切换折叠状态
  setCollapse: (collapsed: boolean) => void; // 设置折叠状态
}

export const useSidebarStore = create<SidebarState>((set) => ({
  activeTab: 'trending', // 默认选中 Trending
  openedWorks: [],
  isCollapsed: false, // 默认展开

  setActiveTab: (tab) => set({ activeTab: tab }),

  addOpenedWork: (work) =>
    set((state) => {
      // 检查是否已存在，防止重复添加
      const exists = state.openedWorks.some((w) => w.id === work.id);
      if (exists) {
        return { activeTab: `work-${work.id}` }; // 如果存在，仅切换选中状态（UI层需适配 activeTab 格式）
      }
      // 添加新作品到列表头部，并限制最大数量（例如 8 个），保持侧边栏整洁
      const newWorks = [work, ...state.openedWorks].slice(0, 8);
      return { 
        openedWorks: newWorks,
        activeTab: `work-${work.id}` // 自动选中新打开的作品
      };
    }),

  removeOpenedWork: (id) =>
    set((state) => ({
      openedWorks: state.openedWorks.filter((w) => w.id !== id),
      // 如果移除的是当前选中的项，重置 activeTab 为 trending
      activeTab: state.activeTab === `work-${id}` ? 'trending' : state.activeTab
    })),
    
  clearOpenedWorks: () => set({ openedWorks: [], activeTab: 'trending' }),

  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  
  setCollapse: (collapsed) => set({ isCollapsed: collapsed }),
}));