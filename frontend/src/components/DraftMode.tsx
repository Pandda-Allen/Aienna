import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  HStack,
  Text,
  useToast,
  Flex,
  Icon,
  Spinner,
  Badge,
  Tooltip
} from '@chakra-ui/react';
import { FaMagic, FaSave, FaPaperPlane, FaPenNib } from 'react-icons/fa';
import { useWorksStore } from '../stores/worksStore';
import { useUserStore } from '../stores/userStore';
import { v4 as uuidv4 } from 'uuid';

interface DraftModeProps {
  initialTitle?: string;
  initialContent?: string;
  onSuccess?: () => void; // 回调函数，比如跳转到作品详情
}

export const DraftMode: React.FC<DraftModeProps> = ({ 
  initialTitle = '', 
  initialContent = '',
  onSuccess 
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const toast = useToast();
  const { createWork, updateWork } = useWorksStore();
  const { user } = useUserStore();

  // 如果传入了初始值，更新状态
  useEffect(() => {
    if (initialTitle) setTitle(initialTitle);
    if (initialContent) setContent(initialContent);
  }, [initialTitle, initialContent]);

  // 模拟 AI 生成故事/续写
  const handleAIGenerate = async () => {
    if (!content.trim()) {
      toast({
        title: '内容为空',
        description: '请先输入一些关键词或段落，AI 需要上下文来生成故事。',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsGenerating(true);
    // 模拟 API 延迟
    setTimeout(() => {
      const newStorySegment = `\n\n（AI 生成段落）...随着光线的变化，原本${title || '平静'}的场景开始发生微妙的转变。空气中弥漫着一种说不清的期待感，仿佛下一秒就会发生奇迹。这种感觉不仅存在于视觉上，更深深触动了内心的柔软之处...`;
      setContent((prev) => prev + newStorySegment);
      setIsGenerating(false);
      toast({
        title: 'AI 续写完成',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }, 1500);
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      toast({ title: '请输入标题', status: 'warning', duration: 2000 });
      return;
    }
    if (!user) {
      toast({ title: '请先登录', status: 'error', duration: 2000 });
      return;
    }

    setIsSaving(true);
    try {
      // 构造作品数据
      const workData = {
        title,
        content,
        author: user.name,
        author_id: user.id,
        description: content.slice(0, 100) + '...', // 自动截取简介
        status,
        tags: ['原创', '故事'], // 默认标签
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80', // 默认配图
        likes_count: 0,
        is_liked: false,
      };

      await createWork(workData);
      
      toast({
        title: status === 'published' ? '发布成功' : '草稿已保存',
        status: 'success',
        duration: 2000,
      });
      
      if (onSuccess) onSuccess();
      // 如果是保存草稿，可以选择不跳转，而是留在当前页面继续编辑（实际逻辑可根据需求调整）
      if (status === 'published') {
        setTitle('');
        setContent('');
      }
    } catch (error) {
      toast({ title: '保存失败', description: '请稍后重试', status: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box 
      h="full" 
      w="full" 
      bg="white" 
      borderRadius="xl" 
      boxShadow="sm" 
      p={{ base: 4, md: 8 }}
      display="flex"
      flexDirection="column"
      className="draft-mode-container"
    >
      {/* 顶部工具栏 */}
      <Flex justify="space-between" align="center" mb={6}>
        <HStack spacing={3}>
          <Icon as={FaPenNib} color="blue.400" boxSize={5} />
          <Text fontSize="lg" fontWeight="bold" color="gray.700">
            草稿模式
          </Text>
          <Badge colorScheme="purple" variant="subtle" rounded="full" px={2}>
            Markdown 支持
          </Badge>
        </HStack>
        
        <HStack spacing={3}>
          <Button
            leftIcon={<FaSave />}
            variant="ghost"
            colorScheme="gray"
            size="sm"
            onClick={() => handleSave('draft')}
            isLoading={isSaving}
          >
            保存草稿
          </Button>
          <Button
            leftIcon={<FaPaperPlane />}
            colorScheme="blue"
            bg="blue.400"
            _hover={{ bg: 'blue.500' }}
            size="sm"
            onClick={() => handleSave('published')}
            isLoading={isSaving}
          >
            发布作品
          </Button>
        </HStack>
      </Flex>

      {/* 标题输入 */}
      <Input
        placeholder="输入故事标题..."
        size="lg"
        fontSize="2xl"
        fontWeight="bold"
        border="none"
        _focus={{ boxShadow: 'none' }}
        px={0}
        mb={4}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 正文编辑区 */}
      <Box flex={1} position="relative">
        <Textarea
          placeholder="在这里开始你的创作... (选中灵感内容可自动填入)"
          height="100%"
          resize="none"
          border="none"
          _focus={{ boxShadow: 'none' }}
          px={0}
          fontSize="md"
          lineHeight="1.8"
          color="gray.600"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        
        {/* AI 辅助悬浮按钮 */}
        <Tooltip label="AI 智能续写/润色" placement="left" hasArrow>
          <Button
            position="absolute"
            bottom={4}
            right={4}
            colorScheme="teal"
            variant="solid"
            borderRadius="full"
            w="50px"
            h="50px"
            boxShadow="lg"
            onClick={handleAIGenerate}
            isLoading={isGenerating}
            isDisabled={!content.trim()}
            _hover={{ transform: 'scale(1.1)' }}
            transition="all 0.2s"
          >
            <Icon as={FaMagic} />
          </Button>
        </Tooltip>
      </Box>

      {/* 底部状态栏 */}
      <Flex 
        mt={4} 
        pt={4} 
        borderTop="1px dashed" 
        borderColor="gray.200" 
        justify="space-between"
        color="gray.400"
        fontSize="xs"
      >
        <Text>{content.length} 字</Text>
        <Text>上次保存: {new Date().toLocaleTimeString()}</Text>
      </Flex>
    </Box>
  );
};

export default DraftMode;