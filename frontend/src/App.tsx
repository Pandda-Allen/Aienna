import React, { useMemo } from 'react';
import { ChakraProvider, Box, Flex, Icon, useColorModeValue, extendTheme } from '@chakra-ui/react';
import { HashRouter, Routes, Route, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaFire, FaSearch, FaPlusSquare, FaHeart, FaUser } from 'react-icons/fa';

// 页面组件导入
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import CreatePage from './pages/CreatePage';
import BrowsePage from './pages/BrowsePage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
// 引入拆分后的新页面
import UserProfilePage from './pages/UserProfilePage';
import MyWorksPage from './pages/MyWorksPage';

// 组件导入
import Sidebar from './components/Sidebar';
import './styles/globals.css';

// 状态管理导入
import { useSidebarStore } from './stores/sidebarStore';
import { useUserStore } from './stores/userStore';
import ResetPasswordPage from './pages/ResetPasswordPage';

// 动态主题生成器
const createTheme = (colorScheme: string) => {
  // 定义颜色映射表
  const colorPalettes: Record<string, any> = {
    blue: {
      50: '#E6F2FF', 100: '#B3D9FF', 200: '#90CDF4', 300: '#63B3ED', 400: '#4299E1',
      500: '#3182CE', 600: '#2B6CB0', 700: '#2C5282', 800: '#2A4365', 900: '#1A365D',
    },
    red: {
      50: '#FFF5F5', 100: '#FED7D7', 200: '#FEB2B2', 300: '#FC8181', 400: '#F56565',
      500: '#E53E3E', 600: '#C53030', 700: '#9B2C2C', 800: '#822727', 900: '#63171B',
    },
    green: {
      50: '#F0FFF4', 100: '#C6F6D5', 200: '#9AE6B4', 300: '#68D391', 400: '#48BB78',
      500: '#38A169', 600: '#2F855A', 700: '#276749', 800: '#22543D', 900: '#1C4532',
    },
    yellow: {
      50: '#FFFFF0', 100: '#FEFCBF', 200: '#FAF089', 300: '#F6E05E', 400: '#ECC94B',
      500: '#D69E2E', 600: '#B7791F', 700: '#975A16', 800: '#744210', 900: '#5F370E',
    },
    purple: {
      50: '#FAF5FF', 100: '#E9D8FD', 200: '#D6BCFA', 300: '#B794F4', 400: '#9F7AEA',
      500: '#805AD5', 600: '#6B46C1', 700: '#553C9A', 800: '#44337A', 900: '#322659',
    },
  };

  const selectedPalette = colorPalettes[colorScheme] || colorPalettes.blue;

  return extendTheme({
    config: {
      initialColorMode: 'light',
      useSystemColorMode: false,
    },
    styles: {
      global: (props: any) => ({
        body: {
          bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
          color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        },
      }),
    },
    fonts: {
      heading: `'Inter', sans-serif`,
      body: `'Inter', sans-serif`,
    },
    colors: {
      brand: selectedPalette,
    },
    components: {
      Button: {
        // 确保按钮等组件默认使用 brand 颜色方案
        defaultProps: {
          colorScheme: 'brand',
        },
      },
      Switch: {
        defaultProps: {
          colorScheme: 'brand',
        },
      },
      Badge: {
        defaultProps: {
          colorScheme: 'brand',
        },
      },
      Tabs: {
        defaultProps: {
          colorScheme: 'brand',
        },
      },
    },
  });
};

// 移动端底部导航栏组件
const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeColor = 'brand.500';
  const inactiveColor = 'gray.400';

  const navItems = [
    { icon: FaFire, path: '/', label: 'Trending' },
    { icon: FaSearch, path: '/search', label: 'Search' },
    { icon: FaPlusSquare, path: '/create', label: 'Create' },
    { icon: FaHeart, path: '/favorites', label: 'Favorites' },
    { icon: FaUser, path: '/user-profile', label: 'Profile' },
  ];

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg={bg}
      borderTop="1px solid"
      borderColor={borderColor}
      zIndex={1000}
      display={{ base: 'block', md: 'none' }}
      pb="safe-area-inset-bottom"
    >
      <Flex justify="space-around" align="center" h="60px">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Flex
              key={item.path}
              direction="column"
              align="center"
              justify="center"
              flex={1}
              h="full"
              onClick={() => navigate(item.path)}
              cursor="pointer"
              color={isActive ? activeColor : inactiveColor}
              _active={{ bg: 'gray.50' }}
            >
              <Icon as={item.icon} w={6} h={6} />
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
};

// 全局布局组件
const AppLayout = () => {
  // 获取侧边栏折叠状态
  // @ts-ignore: Store type compatibility
  const isCollapsed = useSidebarStore((state: any) => state.isCollapsed);

  return (
    <Flex minH="100vh" direction="column">
      {/* 桌面端侧边栏 */}
      <Sidebar />

      {/* 主内容区域 - 响应式 margin */}
      <Box
        flex={1}
        ml={{ base: 0, md: isCollapsed ? '72px' : '260px' }} // 响应侧边栏折叠
        pb={{ base: '60px', md: 0 }} // 为移动端底部导航留出空间
        position="relative"
        transition="margin-left 0.3s cubic-bezier(0.2, 0, 0, 1)" // 平滑过渡动画
        w="auto"
        maxWidth={{ base: '100%', md: isCollapsed ? 'calc(100% - 72px)' : 'calc(100% - 260px)' }}
      >
        <Outlet />
      </Box>

      {/* 移动端底部导航 */}
      <MobileBottomNav />
    </Flex>
  );
};

const App: React.FC = () => {
  // 获取用户主题偏好
  // @ts-ignore: Store type compatibility
  const themePreference = useUserStore((state: any) => state.themePreference) || 'blue';
  
  // 缓存主题对象，避免不必要的重渲染
  const theme = useMemo(() => createTheme(themePreference), [themePreference]);

  return (
    <ChakraProvider theme={theme}>
      <HashRouter>
        <Routes>
          {/* 独立页面：登录注册 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 独立页面：重置密码 */}
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* 需要 Layout 的页面 */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/browse/:id" element={<BrowsePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* 新拆分的路由 */}
            <Route path="/user-profile" element={<UserProfilePage />} />
            <Route path="/my-works" element={<MyWorksPage />} />
            
            {/* 兼容旧路径，重定向或指向用户中心 */}
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/account" element={<UserProfilePage />} />
            
            {/* 404 页面 */}
            <Route path="*" element={
              <Box p={8} textAlign="center" mt={20}>
                <Box fontSize="4xl" fontWeight="900" color="brand.500" mb={4}>404</Box>
                <Box fontSize="xl" color="gray.500">页面未找到</Box>
              </Box>
            } />
          </Route>
        </Routes>
      </HashRouter>
    </ChakraProvider>
  );
};

export default App;