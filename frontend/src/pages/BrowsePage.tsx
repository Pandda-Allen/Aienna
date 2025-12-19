import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Flex,
  Avatar,
  Badge,
  IconButton,
  Icon,
  Spinner,
  VStack,
  HStack,
  useToast,
  Divider,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  AspectRatio,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FaHeart, FaRegHeart, FaShareAlt, FaCalendarAlt, FaTag } from 'react-icons/fa';
import { useWorksStore } from '../stores/worksStore';
import { useSidebarStore } from '../stores/sidebarStore';

export const BrowsePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  // Stores
  const { 
    currentWork, 
    fetchWorkById, 
    isLoading, 
    toggleLike,
    setCurrentWork 
  } = useWorksStore();
  
  const { addOpenedWork } = useSidebarStore();

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const metaColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.100', 'gray.700');

  // 获取作品数据
  useEffect(() => {
    if (id) {
      // 先清空当前作品，避免闪烁上一篇内容
      setCurrentWork(null);
      fetchWorkById(id);
    }
  }, [id, fetchWorkById, setCurrentWork]);

  // 当作品加载成功后，添加到侧边栏历史记录
  useEffect(() => {
    if (currentWork && currentWork.id === id) {
      addOpenedWork({
        id: currentWork.id,
        title: currentWork.title,
      });
    }
  }, [currentWork, id, addOpenedWork]);

  // 处理点赞
  const handleLike = async () => {
    if (!currentWork) return;
    await toggleLike(currentWork.id);
    // 可选：添加震动反馈或轻微提示，目前Store已处理状态更新
  };

  // 处理分享
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: '链接已复制',
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  };

  if (isLoading) {
    return (
      <Flex h="full" w="full" align="center" justify="center" direction="column">
        <Spinner size="xl" color="blue.400" thickness="4px" speed="0.65s" mb={4} />
        <Text color="gray.500">正在加载作品...</Text>
      </Flex>
    );
  }

  if (!currentWork && !isLoading) {
    return (
      <Flex h="full" w="full" align="center" justify="center" direction="column">
        <Heading size="lg" color="gray.400" mb={2}>未找到作品</Heading>
        <Text color="gray.500" mb={6}>该作品可能已被删除或不存在。</Text>
        <IconButton
          aria-label="Back"
          icon={<Icon as={ChevronRightIcon} transform="rotate(180deg)" />}
          onClick={() => navigate('/')}
          variant="outline"
        />
      </Flex>
    );
  }

  // 渲染内容
  return (
    <Container maxW="container.lg" py={8} px={{ base: 4, md: 8 }}>
      {/* 顶部面包屑导航 */}
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={8} fontSize="sm" color="gray.500">
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/')}>首页</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => navigate('/')}>浏览</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink color="blue.500" fontWeight="medium">正文</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Box bg={bgColor} borderRadius="2xl" shadow="sm" overflow="hidden" border="1px" borderColor={borderColor}>
        {/* 顶部大图 */}
        <AspectRatio ratio={{ base: 16 / 9, md: 21 / 9 }} w="full">
          <Image
            src={currentWork?.image}
            alt={currentWork?.title}
            objectFit="cover"
            fallbackSrc="https://via.placeholder.com/1200x600?text=No+Image"
          />
        </AspectRatio>

        <Box p={{ base: 6, md: 10 }}>
          {/* 标题区 */}
          <VStack align="start" spacing={4} mb={8}>
            <Flex w="full" justify="space-between" align="start" gap={4}>
              <Heading as="h1" size="2xl" lineHeight="tight" color="gray.800">
                {currentWork?.title}
              </Heading>
              
              {/* 操作按钮组 */}
              <HStack spacing={2}>
                <IconButton
                  aria-label="Like"
                  icon={<Icon as={currentWork?.is_liked ? FaHeart : FaRegHeart} />}
                  color={currentWork?.is_liked ? 'red.400' : 'gray.400'}
                  bg={currentWork?.is_liked ? 'red.50' : 'transparent'}
                  variant="ghost"
                  fontSize="2xl"
                  onClick={handleLike}
                  _hover={{ color: 'red.500', bg: 'red.50' }}
                  isRound
                />
                <IconButton
                  aria-label="Share"
                  icon={<Icon as={FaShareAlt} />}
                  color="gray.400"
                  variant="ghost"
                  fontSize="xl"
                  onClick={handleShare}
                  _hover={{ color: 'blue.500', bg: 'blue.50' }}
                  isRound
                />
              </HStack>
            </Flex>

            {/* 作者与元数据信息 */}
            <Flex w="full" align="center" justify="space-between" wrap="wrap" gap={4}>
              <HStack spacing={3}>
                <Avatar 
                  size="sm" 
                  name={currentWork?.author} 
                  src={`https://ui-avatars.com/api/?name=${currentWork?.author}&background=random`} 
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="sm" color="gray.700">
                    {currentWork?.author}
                  </Text>
                  <Text fontSize="xs" color={metaColor}>
                    ID: {currentWork?.author_id}
                  </Text>
                </VStack>
              </HStack>

              <HStack spacing={4} color={metaColor} fontSize="sm">
                <Flex align="center">
                  <Icon as={FaCalendarAlt} mr={2} />
                  {currentWork?.created_at && new Date(currentWork.created_at).toLocaleDateString()}
                </Flex>
                <Text>•</Text>
                <Text>{currentWork?.likes_count || 0} 人喜欢</Text>
              </HStack>
            </Flex>
          </VStack>

          <Divider mb={8} />

          {/* 正文内容 */}
          <Box 
            className="article-content" 
            color={textColor} 
            fontSize={{ base: 'md', md: 'lg' }} 
            lineHeight="1.8"
            whiteSpace="pre-wrap"
            sx={{
              'p': { marginBottom: '1.5em' }
            }}
          >
            {/* 这里简单展示纯文本，如果是富文本或Markdown需引入对应解析器 */}
            {currentWork?.content || currentWork?.description}
            
            {/* 如果内容过短，展示一些占位文本以模拟阅读体验 (仅用于演示) */}
            {(!currentWork?.content || currentWork?.content.length < 50) && (
              <Text mt={4} color="gray.400" fontStyle="italic">
                （...此处为演示用的扩展内容占位... 
                当用户在创作模式发布更长的文章时，这里将完整展示。
                极简的设计让阅读者能够专注于文字本身，
                摒弃了多余的视觉干扰，带来沉浸式的阅读体验。）
              </Text>
            )}
          </Box>

          {/* 底部标签 */}
          <Flex mt={10} gap={2} wrap="wrap">
            {currentWork?.tags?.map((tag) => (
              <Badge
                key={tag}
                px={3}
                py={1}
                borderRadius="full"
                colorScheme="blue"
                variant="subtle"
                fontSize="sm"
                textTransform="none"
                display="flex"
                alignItems="center"
              >
                <Icon as={FaTag} mr={2} size="10px" />
                {tag}
              </Badge>
            ))}
          </Flex>
        </Box>
      </Box>
    </Container>
  );
};

export default BrowsePage;