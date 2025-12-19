import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  useColorModeValue,
  Spinner,
  Flex,
  Icon,
  Button,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { FaFire, FaHashtag, FaSearch, FaHistory } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWorksStore } from '../stores/worksStore';
import { WorkCard } from '../components/WorkCard';

// 热门搜索关键词示例
const POPULAR_TAGS = ['极简', '摄影', '生活', '设计', 'AI', '故事', '未来'];

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  
  // Store
  const { 
    searchResults, 
    searchWorks, 
    isLoading, 
    toggleLike 
  } = useWorksStore();

  // Colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const headingColor = useColorModeValue('gray.700', 'white');

  // 初始化搜索（如果有 URL 参数）
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  // 执行搜索
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // 更新 URL
    setSearchParams({ q: searchQuery });
    
    // 调用 Store 搜索
    await searchWorks(searchQuery);
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
    // 可选：清空搜索结果或保留
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    handleSearch(tag);
  };

  const handleWorkClick = (id: string) => {
    navigate(`/browse/${id}`);
  };

  const handleToggleLike = async (id: string) => {
    await toggleLike(id);
  };

  return (
    <Box minH="100vh" bg="transparent" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          
          {/* 搜索头部区域 */}
          <Box textAlign="center" py={8}>
            <Heading as="h1" size="xl" mb={6} color={headingColor} fontWeight="800">
              探索灵感世界
            </Heading>
            
            <form onSubmit={onSearchSubmit}>
              <InputGroup size="lg" maxW="2xl" mx="auto">
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="搜索作品、标签、作者或 ID..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsTyping(true);
                  }}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)',
                  }}
                  borderRadius="full"
                  pl={12}
                  pr={12}
                  boxShadow="sm"
                />
                {query && (
                  <InputRightElement>
                    <IconButton
                      aria-label="Clear search"
                      icon={<CloseIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={handleClear}
                      borderRadius="full"
                    />
                  </InputRightElement>
                )}
              </InputGroup>
            </form>

            {/* 热门标签建议 */}
            {!searchResults.length && !isLoading && (
              <Flex justify="center" wrap="wrap" gap={3} mt={6}>
                <HStack color="gray.500" fontSize="sm" mr={2}>
                  <Icon as={FaFire} color="orange.400" />
                  <Text>热门搜索:</Text>
                </HStack>
                {POPULAR_TAGS.map((tag) => (
                  <Tag
                    key={tag}
                    size="md"
                    variant="subtle"
                    colorScheme="blue"
                    borderRadius="full"
                    cursor="pointer"
                    onClick={() => handleTagClick(tag)}
                    transition="all 0.2s"
                    _hover={{ transform: 'scale(1.05)', bg: 'blue.100' }}
                  >
                    <TagLeftIcon boxSize="12px" as={FaHashtag} />
                    <TagLabel>{tag}</TagLabel>
                  </Tag>
                ))}
              </Flex>
            )}
          </Box>

          {/* 搜索状态展示 */}
          {isLoading ? (
            <Flex justify="center" align="center" py={20} direction="column">
              <Spinner size="xl" color="blue.400" thickness="4px" speed="0.65s" mb={4} />
              <Text color="gray.500">正在寻找相关作品...</Text>
            </Flex>
          ) : (
            <>
              {/* 搜索结果展示 */}
              {searchResults.length > 0 ? (
                <Box>
                  <HStack mb={6} justify="space-between">
                    <Text fontSize="lg" fontWeight="bold" color={headingColor}>
                      找到 {searchResults.length} 个相关结果
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      关键词: "{searchParams.get('q')}"
                    </Text>
                  </HStack>
                  
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
                    {searchResults.map((work) => (
                      <WorkCard
                        key={work.id}
                        work={work}
                        onClick={() => handleWorkClick(work.id)}
                        onToggleLike={handleToggleLike}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              ) : (
                /* 空状态 / 初始状态 */
                query && !isTyping && (
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={12}
                    bg={cardBg}
                    borderRadius="xl"
                    border="1px dashed"
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                  >
                    <Icon as={FaSearch} w={12} h={12} color="gray.300" mb={4} />
                    <Heading size="md" color="gray.500" mb={2}>未找到相关作品</Heading>
                    <Text color="gray.400">
                      尝试使用不同的关键词，或浏览 <Button variant="link" colorScheme="blue" onClick={() => navigate('/')}>热门趋势</Button>
                    </Text>
                  </Flex>
                )
              )}
            </>
          )}

          {/* 初始引导画面 (当没有搜索且没有结果时) */}
          {!query && !isLoading && searchResults.length === 0 && (
            <VStack spacing={8} py={10} opacity={0.6}>
              <Icon as={FaHistory} w={16} h={16} color="gray.200" />
              <Text color="gray.400" fontSize="lg">
                输入关键词开始探索创意世界
              </Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default SearchPage;