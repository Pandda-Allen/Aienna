import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Flex,
  Icon,
  Button,
  Spinner,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaHeartBroken, FaCompass, FaHeart } from 'react-icons/fa';
import { useWorksStore } from '../stores/worksStore';
import { useUserStore } from '../stores/userStore';
import { WorkCard } from '../components/WorkCard';

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Stores
  const { user, isAuthenticated } = useUserStore();
  const { 
    favoriteWorks, 
    fetchUserFavorites, 
    toggleLike, 
    isLoading 
  } = useWorksStore();

  // Colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headingColor = useColorModeValue('gray.700', 'white');
  const textColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // 获取数据
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserFavorites(user.id);
    }
  }, [isAuthenticated, user, fetchUserFavorites]);

  // 处理作品点击
  const handleWorkClick = (id: string) => {
    navigate(`/browse/${id}`);
  };

  // 处理取消收藏
  const handleToggleLike = async (id: string) => {
    await toggleLike(id);
    // Store 状态更新后，列表会自动重新渲染
  };

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <Container maxW="container.xl" py={12} centerContent h="80vh" display="flex" justifyContent="center">
        <VStack spacing={6}>
          <Box 
            p={6} 
            bg="blue.50" 
            borderRadius="full" 
            color="blue.400"
            boxShadow="sm"
          >
            <Icon as={FaHeart} w={10} h={10} />
          </Box>
          <Heading size="lg" color={headingColor}>请先登录</Heading>
          <Text color={textColor} textAlign="center" maxW="md">
            登录后即可查看和管理您收藏的作品。<br/>您的灵感库正等待着您。
          </Text>
          <Button 
            colorScheme="blue" 
            size="lg" 
            bgGradient="linear(to-r, blue.400, blue.500)"
            _hover={{ bgGradient: "linear(to-r, blue.500, blue.600)", transform: "translateY(-1px)", boxShadow: "lg" }}
            onClick={() => navigate('/login')}
          >
            立即登录 / 注册
          </Button>
        </VStack>
      </Container>
    );
  }

  // 加载中状态（仅在首次加载且列表为空时显示）
  if (isLoading && favoriteWorks.length === 0) {
    return (
      <Flex h="80vh" w="full" align="center" justify="center" direction="column">
        <Spinner size="xl" color="blue.400" thickness="4px" speed="0.65s" mb={4} />
        <Text color="gray.500">正在同步收藏夹...</Text>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg="transparent" py={8}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={8}>
          <Box>
            <Heading as="h1" size="xl" mb={2} color={headingColor} fontWeight="800" letterSpacing="tight">
              我的收藏
            </Heading>
            <Text color={textColor} fontSize="lg">
              这里汇集了所有打动您的作品 ({favoriteWorks.length})
            </Text>
          </Box>
        </Flex>

        {favoriteWorks.length === 0 ? (
          // 空状态
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            minH="400px" 
            bg={cardBg} 
            borderRadius="2xl" 
            border="1px dashed" 
            borderColor={borderColor}
            p={12}
            textAlign="center"
          >
            <Icon as={FaHeartBroken} w={16} h={16} color="gray.300" mb={6} />
            <Heading size="md" color="gray.500" mb={3}>暂无收藏作品</Heading>
            <Text color="gray.400" mb={8} maxW="sm">
              遇到喜欢的作品，点击爱心即可收藏。<br/>它们将永久保存在这里，供您随时回顾。
            </Text>
            <Button 
              leftIcon={<FaCompass />} 
              colorScheme="blue" 
              variant="outline"
              size="lg"
              onClick={() => navigate('/')}
              _hover={{ bg: 'blue.50' }}
            >
              去浏览发现
            </Button>
          </Flex>
        ) : (
          // 作品列表
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
            {favoriteWorks.map((work) => (
              <WorkCard
                key={work.id}
                work={work}
                onClick={() => handleWorkClick(work.id)}
                onToggleLike={handleToggleLike}
              />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default FavoritesPage;