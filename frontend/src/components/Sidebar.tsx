import React, { useMemo } from 'react';
import {
  Box,
  VStack,
  Text,
  Icon,
  Divider,
  Flex,
  IconButton,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaFire,
  FaSearch,
  FaPenFancy,
  FaHeart,
  FaUser,
  FaCog,
  FaTimes,
  FaBookOpen,
  FaLayerGroup,
  FaChevronLeft,
  FaChevronRight,
  FaUserShield,
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebarStore } from '../stores/sidebarStore';
import { useUserStore } from '../stores/userStore';

// 基础导航项配置
const BASE_NAV_ITEMS = [
  { id: 'trending', label: '热门趋势', icon: FaFire, path: '/' },
  { id: 'search', label: '作品搜索', icon: FaSearch, path: '/search' },
  { id: 'my-works', label: '个人作品', icon: FaPenFancy, path: '/my-works' },
  { id: 'favorites', label: '我的收藏', icon: FaHeart, path: '/favorites' },
  { id: 'user-center', label: '用户中心', icon: FaUser, path: '/user-profile' },
  { id: 'settings', label: '设置', icon: FaCog, path: '/settings' },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 从 Store 获取状态
  // @ts-ignore
  const { 
    activeTab, 
    setActiveTab, 
    openedWorks, 
    removeOpenedWork,
    isCollapsed,
    toggleCollapse
  } = useSidebarStore((state: any) => state);

  // 获取用户信息用于权限判断，使用选择器确保状态更新响应
  // @ts-ignore
  const user = useUserStore((state: any) => state.user);

  // 动态生成导航菜单：根据用户角色判断是否显示管理员入口
  const navItems = useMemo(() => {
    // 复制基础菜单以避免直接修改引用
    const items = [...BASE_NAV_ITEMS];
    
    // 严格检查 role 属性是否为 'admin'
    // 确保 user 对象存在且 role 属性匹配
    if (user && user.role === 'admin') {
      // 避免重复添加
      if (!items.find(item => item.id === 'admin-dashboard')) {
        items.push({ 
          id: 'admin-dashboard', 
          label: '管理面板', 
          icon: FaUserShield, 
          path: '/admin' 
        });
      }
    }
    
    return items;
  }, [user]);

  // 主题颜色配置
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.800');
  const headingColor = useColorModeValue('gray.800', 'white');

  // 处理导航点击
  const handleNavClick = (item: typeof BASE_NAV_ITEMS[0]) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  // 处理历史作品点击
  const handleWorkClick = (workId: string) => {
    setActiveTab(`work-${workId}`);
    navigate(`/browse/${workId}`);
  };

  // 处理移除历史作品
  const handleRemoveWork = (e: React.MouseEvent, workId: string) => {
    e.stopPropagation();
    removeOpenedWork(workId);
  };

  return (
    <Box
      as="nav"
      pos="fixed"
      left={0}
      top={0}
      w={{ base: 'full', md: isCollapsed ? '72px' : '260px' }}
      h="100vh"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      py={6}
      px={isCollapsed ? 2 : 4}
      display={{ base: 'none', md: 'flex' }}
      flexDirection="column"
      zIndex={100}
      boxShadow="sm"
      transition="width 0.3s cubic-bezier(0.2, 0, 0, 1), padding 0.3s ease"
      overflowX="hidden"
    >
      {/* 侧边栏头部 Logo */}
      <Flex 
        mb={8} 
        px={isCollapsed ? 0 : 4} 
        align="center" 
        justify={isCollapsed ? 'center' : 'flex-start'}
        h="40px"
        overflow="hidden"
      >
        <Flex
          align="center"
          justify="center"
          minW={10}
          w={10}
          h={10}
          bgGradient="linear(to-tr, blue.400, purple.400)"
          borderRadius="xl"
          color="white"
          cursor="pointer"
          onClick={() => navigate('/')}
          flexShrink={0}
        >
          <Icon as={FaLayerGroup} boxSize={6} />
        </Flex>
        
        <Box 
          ml={3} 
          opacity={isCollapsed ? 0 : 1}
          w={isCollapsed ? 0 : 'auto'}
          overflow="hidden"
          whiteSpace="nowrap"
          transition="all 0.3s ease"
          visibility={isCollapsed ? 'hidden' : 'visible'}
        >
          <Text fontSize="2xl" fontWeight="800" letterSpacing="tight" color={headingColor}>
            Creata
          </Text>
        </Box>
      </Flex>

      {/* 导航菜单列表 */}
      <VStack spacing={1} align="stretch" mb={6}>
        {navItems.map((item) => {
          // 选中状态判断逻辑
          const isActive = 
            activeTab === item.id || 
            (location.pathname.startsWith(item.path) && item.path !== '/') || 
            (item.path === '/' && location.pathname === '/');
          
          const NavContent = (
            <Flex
              align="center"
              justify={isCollapsed ? 'center' : 'flex-start'}
              px={isCollapsed ? 0 : 4}
              py={3}
              borderRadius="lg"
              cursor="pointer"
              role="group"
              bg={isActive ? activeBg : 'transparent'}
              color={isActive ? activeColor : textColor}
              transition="all 0.2s"
              _hover={{
                bg: isActive ? activeBg : hoverBg,
                color: isActive ? activeColor : useColorModeValue('gray.800', 'white'),
              }}
              onClick={() => handleNavClick(item)}
              position="relative"
            >
              <Icon 
                as={item.icon} 
                boxSize={5} 
                mr={isCollapsed ? 0 : 4}
                transition="margin 0.3s ease"
                color={isActive ? activeColor : 'gray.400'}
                _groupHover={{ color: isActive ? activeColor : 'gray.500' }}
              />
              
              {!isCollapsed && (
                <Text fontWeight={isActive ? '600' : '500'} fontSize="md" noOfLines={1}>
                  {item.label}
                </Text>
              )}
              
              {!isCollapsed && isActive && (
                <Box
                  ml="auto"
                  w={1.5}
                  h={1.5}
                  borderRadius="full"
                  bg={activeColor}
                />
              )}
            </Flex>
          );

          return isCollapsed ? (
            <Tooltip key={item.id} label={item.label} placement="right" hasArrow gutter={12}>
              {NavContent}
            </Tooltip>
          ) : (
            <Box key={item.id}>{NavContent}</Box>
          );
        })}
      </VStack>

      {/* 最近浏览的历史记录 */}
      {openedWorks.length > 0 && (
        <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
          <Divider my={2} borderColor={borderColor} />
          
          {!isCollapsed && (
            <Box px={4} mb={2} mt={2}>
              <Text 
                fontSize="xs" 
                fontWeight="bold" 
                textTransform="uppercase" 
                letterSpacing="wider" 
                color="gray.400"
              >
                最近浏览
              </Text>
            </Box>
          )}
          
          <VStack 
            spacing={1} 
            align="stretch" 
            overflowY="auto" 
            flex={1} 
            sx={{
              '&::-webkit-scrollbar': { width: '0px' },
            }}
          >
            {openedWorks.map((work: any) => {
              const isActive = activeTab === `work-${work.id}`;
              
              const WorkContent = (
                <Flex
                  align="center"
                  justify={isCollapsed ? 'center' : 'flex-start'}
                  px={isCollapsed ? 0 : 4}
                  py={2.5}
                  borderRadius="lg"
                  cursor="pointer"
                  bg={isActive ? activeBg : 'transparent'}
                  color={isActive ? activeColor : textColor}
                  transition="all 0.2s"
                  _hover={{
                    bg: isActive ? activeBg : hoverBg,
                    color: isActive ? activeColor : useColorModeValue('gray.800', 'white'),
                  }}
                  onClick={() => handleWorkClick(work.id)}
                  role="group"
                  position="relative"
                >
                  <Icon 
                    as={FaBookOpen} 
                    boxSize={4} 
                    mr={isCollapsed ? 0 : 3} 
                    opacity={isActive ? 1 : 0.6}
                  />
                  
                  {!isCollapsed && (
                    <>
                      <Text 
                        fontSize="sm" 
                        fontWeight={isActive ? '600' : '400'} 
                        noOfLines={1} 
                        flex={1}
                      >
                        {work.title}
                      </Text>
                      <Tooltip label="从列表中移除" placement="right" hasArrow>
                        <IconButton
                          aria-label="Close tab"
                          icon={<FaTimes />}
                          size="xs"
                          variant="ghost"
                          colorScheme="gray"
                          opacity={0}
                          _groupHover={{ opacity: 1 }}
                          onClick={(e) => handleRemoveWork(e, work.id)}
                          minW={5}
                          h={5}
                          borderRadius="full"
                        />
                      </Tooltip>
                    </>
                  )}
                </Flex>
              );

              return isCollapsed ? (
                <Tooltip key={work.id} label={work.title} placement="right" hasArrow gutter={12}>
                  {WorkContent}
                </Tooltip>
              ) : (
                <Box key={work.id}>{WorkContent}</Box>
              );
            })}
          </VStack>
        </Box>
      )}

      {/* 底部折叠按钮 */}
      <Box mt="auto" pt={4}>
         <Flex 
           justify={isCollapsed ? 'center' : 'flex-end'} 
           px={isCollapsed ? 0 : 2}
         >
            <Tooltip label={isCollapsed ? "展开侧边栏" : "折叠侧边栏"} placement="right" hasArrow isDisabled={!isCollapsed}>
              <IconButton
                aria-label={isCollapsed ? "展开侧边栏" : "折叠侧边栏"}
                icon={isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                onClick={toggleCollapse}
                variant="ghost"
                color="gray.400"
                _hover={{ color: "blue.500", bg: "blue.50" }}
                size="sm"
                borderRadius="full"
              />
            </Tooltip>
         </Flex>
      </Box>
    </Box>
  );
};

export default Sidebar;