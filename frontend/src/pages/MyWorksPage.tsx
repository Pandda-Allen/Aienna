import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Flex,
  Spinner,
  useToast,
  Divider,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon } from '@chakra-ui/icons';
import { FaPenFancy, FaFolderOpen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useWorksStore } from '../stores/worksStore';
import { useUserStore } from '../stores/userStore';
import { WorkCard } from '../components/WorkCard';

const MyWorksPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // 本地状态
  const [searchQuery, setSearchQuery] = useState('');

  // Stores
  const { user, isAuthenticated } = useUserStore();
  const { 
    userWorks, 
    fetchUserWorks, 
    isLoading, 
    toggleLike 
  } = useWorksStore();

  // 样式定义
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // 初始化数据
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: '请先登录',
        description: '登录后即可管理您的个人作品',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    if (user?.id) {
      fetchUserWorks(user.id);
    }
  }, [isAuthenticated, user, fetchUserWorks, navigate, toast]);

  // 前端过滤逻辑
  const filteredWorks = useMemo(() => {
    if (!searchQuery.trim()) return userWorks;
    const lowerQuery = searchQuery.toLowerCase();
    return userWorks.filter(work => 
      work.title.toLowerCase().includes(lowerQuery) ||
      work.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }, [userWorks, searchQuery]);

  // 处理跳转
  const handleCreateNew = () => {
    navigate('/create');
  };

  const handleWorkClick = (id: string) => {
    navigate(`/browse/${id}`);
  };

  const handleToggleLike = async (id: string) => {
    await toggleLike(id);
  };

  if (!isAuthenticated) return null;

  return (
    <Box minH="calc(100vh - 60px)" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          
          {/* 页面头部 */}
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            justify="space-between" 
            align={{ base: 'start', md: 'center' }} 
            gap={4}
          >
            <VStack align="start" spacing={1}>
              <Heading as="h1" size="lg" color={headingColor} fontWeight="800">
                个人作品
              </Heading>
              <Text color="gray.500" fontSize="md">
                管理您发布的所有创作内容 ({userWorks.length})
              </Text>
            </VStack>

            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              size="md"
              bgGradient="linear(to-r, blue.400, blue.500)"
              _hover={{ bgGradient: "linear(to-r, blue.500, blue.600)", boxShadow: 'md' }}
              onClick={handleCreateNew}
            >
              新建作品
            </Button>
          </Flex>

          <Divider borderColor={borderColor} />

          {/* 工具栏：搜索 */}
          <Box 
            bg={cardBg} 
            p={4} 
            borderRadius="xl" 
            boxShadow="sm"
            border="1px solid" 
            borderColor={borderColor}
          >
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="搜索您的作品标题或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="filled"
                bg={useColorModeValue('gray.50', 'gray.700')}
                _focus={{ bg: 'transparent', borderColor: 'blue.400' }}
              />
            </InputGroup>
          </Box>

          {/* 内容展示区 */}
          {isLoading ? (
            <Flex justify="center" align="center" py={20}>
              <Spinner size="xl" color="blue.400" thickness="4px" speed="0.65s" />
            </Flex>
          ) : filteredWorks.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
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
            // 空状态
            <Flex 
              direction="column" 
              align="center" 
              justify="center" 
              py={20}
              bg={cardBg}
              borderRadius="xl"
              border="2px dashed"
              borderColor={borderColor}
              textAlign="center"
            >
              <Box 
                p={4} 
                bg="blue.50" 
                borderRadius="full" 
                color="blue.400" 
                mb={4}
              >
                <Icon as={userWorks.length === 0 ? FaPenFancy : FaFolderOpen} w={8} h={8} />
              </Box>
              
              <Heading size="md" color="gray.500" mb={2}>
                {userWorks.length === 0 ? '还没有发布作品' : '未找到相关作品'}
              </Heading>
              
              <Text color="gray.400" mb={6} maxW="md">
                {userWorks.length === 0 
                  ? '您的创作之旅由此开始。捕捉灵感，发布您的第一个作品吧！'
                  : `未找到包含 "${searchQuery}" 的作品，请尝试其他关键词。`
                }
              </Text>
              
              {userWorks.length === 0 && (
                <Button 
                  colorScheme="blue" 
                  variant="outline"
                  onClick={handleCreateNew}
                >
                  去创作
                </Button>
              )}
            </Flex>
          )}

        </VStack>
      </Container>
    </Box>
  );
};

export default MyWorksPage;