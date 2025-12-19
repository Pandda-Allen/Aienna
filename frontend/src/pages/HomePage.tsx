import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  VStack,
  Icon,
  HStack,
  Button,
  Select,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaFire, FaRegSadTear, FaSignOutAlt, FaUser, FaFilter, FaCalendarAlt, FaTag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useWorksStore } from '../stores/worksStore';
import { useUserStore } from '../stores/userStore';
import { WorkCard } from '../components/WorkCard';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Local Filter States
  const [nameFilter, setNameFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Stores
  const { 
    trendingWorks, 
    fetchTrending, 
    isLoading, 
    toggleLike 
  } = useWorksStore();
  
  const { user, isAuthenticated, logout } = useUserStore();

  // Theme colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.700', 'white');

  // Initial Fetch
  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  // Handlers
  const handleWorkClick = (id: string) => {
    navigate(`/browse/${id}`);
  };

  const handleToggleLike = async (id: string) => {
    await toggleLike(id);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Client-side Filtering Logic
  const filteredWorks = useMemo(() => {
    return trendingWorks.filter(work => {
      const matchName = work.title.toLowerCase().includes(nameFilter.toLowerCase());
      const matchTag = !tagFilter || work.tags.some(t => t.toLowerCase().includes(tagFilter.toLowerCase()));
      const matchDate = !dateFilter || work.created_at.startsWith(dateFilter);
      
      return matchName && matchTag && matchDate;
    });
  }, [trendingWorks, nameFilter, tagFilter, dateFilter]);

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* 顶部导航栏 / Header */}
      <Box 
        as="header" 
        bg={headerBg} 
        py={4} 
        px={{ base: 4, md: 8 }} 
        position="sticky" 
        top={0} 
        zIndex={10} 
        boxShadow="sm"
      >
        <Container maxW="container.xl" px={0}>
          <Flex justify="space-between" align="center" gap={4}>
            
            {/* 移动端 Logo */}
            <Text 
              display={{ base: 'block', md: 'none' }} 
              fontSize="xl" 
              fontWeight="900" 
              bgGradient="linear(to-r, blue.400, purple.500)" 
              bgClip="text"
            >
              Creata
            </Text>

            {/* 占位 / 标题 */}
            <Box display={{ base: 'none', md: 'block' }}>
               <Text fontWeight="bold" fontSize="lg" color={headingColor}>作品展示</Text>
            </Box>

            {/* 右侧用户头像 */}
            <Box ml="auto">
              {isAuthenticated && user ? (
                <Menu>
                  <MenuButton 
                    as={Button} 
                    rounded={'full'} 
                    variant={'link'} 
                    cursor={'pointer'} 
                    minW={0}
                  >
                    <Avatar
                      size={'sm'}
                      src={user.avatar}
                      name={user.name}
                      border="2px solid"
                      borderColor="blue.100"
                    />
                  </MenuButton>
                  <MenuList zIndex={20}>
                    <Box px={4} py={2}>
                      <Text fontWeight="bold">{user.name}</Text>
                      <Text fontSize="xs" color="gray.500">已登录</Text>
                    </Box>
                    <MenuDivider />
                    <MenuItem icon={<FaUser />} onClick={() => navigate('/profile')}>
                      个人主页
                    </MenuItem>
                    <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout} color="red.400">
                      退出登录
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <HStack spacing={4}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate('/login')}
                  >
                    登录
                  </Button>
                  <Button 
                    colorScheme="blue" 
                    size="sm" 
                    borderRadius="full"
                    onClick={() => navigate('/login')}
                    px={6}
                    bgGradient="linear(to-r, blue.400, blue.500)"
                    _hover={{ bgGradient: "linear(to-r, blue.500, blue.600)" }}
                  >
                    注册
                  </Button>
                </HStack>
              )}
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* 主要内容区域 */}
      <Container maxW="container.xl" py={8} px={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          
          {/* 页面标题 */}
          <Flex align="center" gap={3}>
            <Box 
              p={2} 
              bg="orange.100" 
              color="orange.500" 
              borderRadius="lg" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
            >
              <Icon as={FaFire} boxSize={5} />
            </Box>
            <Box>
              <Heading as="h2" size="lg" color={headingColor} fontWeight="800" letterSpacing="tight">
                Trending Now
              </Heading>
              <Text fontSize="md" color={textColor}>
                探索热门创作
              </Text>
            </Box>
          </Flex>

          {/* 筛选栏 - 新增功能 */}
          <Box 
            bg={headerBg} 
            p={4} 
            borderRadius="xl" 
            boxShadow="sm"
            border="1px solid"
            borderColor={useColorModeValue('gray.100', 'gray.700')}
          >
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaFilter} color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="按作品名筛选..." 
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  variant="filled"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  _focus={{ bg: 'transparent', borderColor: 'blue.400' }}
                />
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaTag} color="gray.400" />
                </InputLeftElement>
                <Input 
                  placeholder="按标签筛选 (如: 摄影)..." 
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  variant="filled"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  _focus={{ bg: 'transparent', borderColor: 'blue.400' }}
                />
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaCalendarAlt} color="gray.400" />
                </InputLeftElement>
                <Input 
                  type="date"
                  placeholder="按发布日期筛选" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  variant="filled"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                  _focus={{ bg: 'transparent', borderColor: 'blue.400' }}
                  sx={{
                    '&::-webkit-calendar-picker-indicator': {
                      filter: useColorModeValue('none', 'invert(1)'),
                    },
                  }}
                />
              </InputGroup>
            </SimpleGrid>
          </Box>

          {/* 内容列表 */}
          {isLoading ? (
            <Flex justify="center" align="center" minH="300px">
              <Spinner size="xl" color="blue.400" thickness="4px" speed="0.65s" />
            </Flex>
          ) : filteredWorks.length > 0 ? (
            <SimpleGrid 
              columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} 
              spacing={6}
            >
              {filteredWorks.map((work) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  onClick={() => handleWorkClick(work.id)}
                  onToggleLike={handleToggleLike}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              minH="400px" 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="xl"
              boxShadow="sm"
            >
              <Icon as={FaRegSadTear} boxSize={12} color="gray.300" mb={4} />
              <Heading size="md" color="gray.500" mb={2}>
                暂无相关内容
              </Heading>
              <Text color="gray.400">
                请尝试调整筛选条件或搜索其他关键词。
              </Text>
            </Flex>
          )}

        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;