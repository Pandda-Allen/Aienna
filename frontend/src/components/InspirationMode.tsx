import React, { useState } from 'react';
import {
  Box,
  Textarea,
  Button,
  VStack,
  Text,
  Heading,
  HStack,
  IconButton,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Tooltip,
  Input,
  Select,
  FormControl,
  FormLabel,
  Collapse,
  useDisclosure,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FaMagic, FaTrash, FaCopy, FaCog, FaSave, FaChevronUp } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

// 定义扩展后的 Asset 数据结构
export interface Asset {
  id: string;
  title: string;
  content: string;
  work_id?: string;
  parent_id?: string;
  metadata: {
    age?: number;
    gender?: string;
    tags?: string[];
    [key: string]: any;
  };
  // 保留字段定义以维持数据结构完整性，但 UI 中不提供编辑
  isReleaseUnit: boolean;
  releaseKind: 'chapter' | 'episode' | 'bundle' | 'bonus';
  pricingPlanId?: string;
  createdAt: string;
  updatedAt: string;
}

// 单个 Asset 编辑卡片组件
const AssetEditorCard: React.FC<{
  asset: Asset;
  onUpdate: (id: string, updates: Partial<Asset>) => void;
  onDelete: (id: string) => void;
  onSave: (asset: Asset) => void;
}> = ({ asset, onUpdate, onDelete, onSave }) => {
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.content);
    toast({ title: '已复制', status: 'info', duration: 1000 });
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = (e.target as HTMLInputElement).value.trim();
      if (val) {
        const currentTags = asset.metadata.tags || [];
        if (!currentTags.includes(val)) {
          onUpdate(asset.id, {
            metadata: { ...asset.metadata, tags: [...currentTags, val] }
          });
        }
        (e.target as HTMLInputElement).value = '';
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    const currentTags = asset.metadata.tags || [];
    onUpdate(asset.id, {
      metadata: { ...asset.metadata, tags: currentTags.filter(t => t !== tagToRemove) }
    });
  };

  return (
    <Card 
      w="full" 
      variant="outline" 
      bg="white" 
      boxShadow="sm"
      _hover={{ boxShadow: 'md', borderColor: 'blue.200' }}
      transition="all 0.2s"
    >
      <CardHeader pb={2}>
        <Flex justify="space-between" align="center">
          <Input 
            value={asset.title}
            onChange={(e) => onUpdate(asset.id, { title: e.target.value })}
            variant="unstyled"
            fontWeight="bold"
            fontSize="md"
            color="gray.700"
            placeholder="输入标题..."
          />
          <HStack spacing={1}>
             <Tooltip label="保存更新">
              <IconButton
                aria-label="Save"
                icon={<FaSave />}
                size="xs"
                variant="ghost"
                colorScheme="blue"
                onClick={() => onSave(asset)}
              />
            </Tooltip>
            <Tooltip label="详细设置">
              <IconButton
                aria-label="Settings"
                icon={isOpen ? <FaChevronUp /> : <FaCog />}
                size="xs"
                variant="ghost"
                colorScheme={isOpen ? "blue" : "gray"}
                onClick={onToggle}
              />
            </Tooltip>
            <Tooltip label="复制内容">
              <IconButton
                aria-label="Copy"
                icon={<FaCopy />}
                size="xs"
                variant="ghost"
                onClick={handleCopy}
              />
            </Tooltip>
            <Tooltip label="删除">
              <IconButton
                aria-label="Delete"
                icon={<FaTrash />}
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={() => onDelete(asset.id)}
              />
            </Tooltip>
          </HStack>
        </Flex>
        <Divider mt={2} />
      </CardHeader>
      
      <CardBody pt={2}>
        <VStack spacing={3} align="stretch">
          <Textarea
            value={asset.content}
            onChange={(e) => onUpdate(asset.id, { content: e.target.value })}
            variant="unstyled"
            fontSize="sm"
            color="gray.600"
            minH="100px"
            resize="vertical"
            placeholder="内容..."
          />
          
          {/* 扩展字段编辑区域 - 仅保留创作相关元数据 */}
          <Collapse in={isOpen} animateOpacity>
            <Box 
              p={3} 
              bg="gray.50" 
              borderRadius="md" 
              border="1px dashed" 
              borderColor="gray.200"
              mt={2}
            >
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel fontSize="xs" mb={1} color="gray.500">灵感标签 (按回车添加)</FormLabel>
                  <Input 
                    size="xs" 
                    placeholder="例如: 赛博朋克, 悬疑..." 
                    onKeyDown={handleTagAdd}
                    bg="white"
                    borderRadius="sm"
                  />
                  <Wrap mt={2} spacing={1}>
                    {asset.metadata.tags?.map((tag, idx) => (
                      <WrapItem key={`${tag}-${idx}`}>
                        <Tag size="sm" borderRadius="full" variant="subtle" colorScheme="blue">
                          <TagLabel>{tag}</TagLabel>
                          <TagCloseButton onClick={() => handleTagRemove(tag)} />
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </FormControl>
                
                <Flex w="full" gap={2}>
                  <FormControl>
                    <FormLabel fontSize="xs" mb={1} color="gray.500">设定年龄 (可选)</FormLabel>
                    <Input 
                      size="xs" 
                      type="number"
                      value={asset.metadata.age || ''}
                      onChange={(e) => onUpdate(asset.id, { metadata: { ...asset.metadata, age: parseInt(e.target.value) || 0 } })}
                      bg="white"
                      borderRadius="sm"
                      placeholder="如: 18"
                    />
                  </FormControl>
                  <FormControl>
                     <FormLabel fontSize="xs" mb={1} color="gray.500">设定性别 (可选)</FormLabel>
                     <Select
                        size="xs"
                        value={asset.metadata.gender || ''}
                        onChange={(e) => onUpdate(asset.id, { metadata: { ...asset.metadata, gender: e.target.value } })}
                        bg="white"
                        borderRadius="sm"
                        placeholder="选择..."
                     >
                       <option value="male">男</option>
                       <option value="female">女</option>
                       <option value="other">其他</option>
                     </Select>
                  </FormControl>
                </Flex>
              </VStack>
            </Box>
          </Collapse>
        </VStack>
      </CardBody>
    </Card>
  );
};

export const InspirationMode: React.FC = () => {
  const [rawInput, setRawInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const toast = useToast();

  // 配色方案
  const bgColor = 'gray.50';
  const cardBg = 'white';
  const accentColor = 'blue.400';

  // 模拟 AI 整理逻辑
  const handleOrganize = () => {
    if (!rawInput.trim()) {
      toast({
        title: '输入为空',
        description: '请先记录下您的碎片化想法。',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setIsProcessing(true);

    // 模拟网络延迟和 AI 处理
    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // 简单的模拟生成逻辑
      const generatedTitle = rawInput.length > 10 ? rawInput.substring(0, 10) + '...' : rawInput;
      
      const newAsset: Asset = {
        id: uuidv4(),
        title: `灵感片段 ${timestamp}`,
        content: `[AI 整理优化]\n${rawInput}\n\n>>> 扩展联想：\n基于上述碎片，构建一个关于“${generatedTitle}”的场景。`,
        metadata: {
          tags: ['AI生成', '灵感'],
          age: 0,
        },
        // 默认初始化值，界面不展示编辑
        isReleaseUnit: false,
        releaseKind: 'chapter',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAssets([newAsset, ...assets]);
      setIsProcessing(false);
      setRawInput(''); // 清空输入框以便下次输入
      
      toast({
        title: '整理完成',
        status: 'success',
        duration: 2000,
      });
    }, 1200);
  };

  // 删除 Asset
  const handleDelete = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  // 更新 Asset
  const handleUpdateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, ...updates, updatedAt: new Date().toISOString() } : asset
    ));
  };

  // 保存 Asset (模拟后端交互)
  const handleSaveAsset = (asset: Asset) => {
    // 这里应当调用 API，如: await assetService.upsertAsset(asset);
    console.log('Saving asset to backend:', asset);
    toast({
      title: '已保存',
      description: `灵感 "${asset.title}" 已更新`,
      status: 'success',
      duration: 1500,
    });
  };

  return (
    <Box h="full" w="full" bg={bgColor} p={4} borderRadius="xl" className="inspiration-mode-container">
      <Flex h="full" gap={6} direction={{ base: 'column', md: 'row' }}>
        
        {/* 左侧：碎片化输入区 (2/3) */}
        <Box 
          flex={2} 
          bg={cardBg} 
          borderRadius="lg" 
          boxShadow="sm" 
          p={6} 
          display="flex" 
          flexDirection="column"
          position="relative"
        >
          <VStack align="start" mb={4} spacing={1}>
            <Heading size="md" color="gray.700">碎片捕捉</Heading>
            <Text fontSize="sm" color="gray.500">
              随意记录下脑海中的瞬间，AI 将为您整理成逻辑通顺的片段 (Asset)。
            </Text>
          </VStack>

          <Textarea
            placeholder="在这里输入您的想法碎片... 例如：'清晨的阳光，咖啡的香气，窗外的麻雀，一种宁静的感觉...'"
            size="lg"
            resize="none"
            flex={1}
            border="none"
            bg="gray.50"
            _focus={{ bg: 'white', boxShadow: 'outline' }}
            p={4}
            borderRadius="md"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            fontSize="md"
          />

          <Flex justify="flex-end" mt={4}>
            <Button
              leftIcon={<FaMagic />}
              colorScheme="blue"
              bg={accentColor}
              size="lg"
              onClick={handleOrganize}
              isLoading={isProcessing}
              loadingText="AI 整理中..."
              _hover={{ bg: 'blue.500', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
              boxShadow="md"
            >
              整理灵感
            </Button>
          </Flex>
        </Box>

        {/* 右侧：整理后的 Asset 展示区 (1/3) */}
        <Box 
          flex={1} 
          bg="transparent" 
          display="flex" 
          flexDirection="column" 
          overflow="hidden"
        >
          <Heading size="sm" mb={4} color="gray.600" px={2}>
            Asset 列表 ({assets.length})
          </Heading>
          
          <VStack 
            spacing={4} 
            overflowY="auto" 
            flex={1} 
            pb={4} 
            px={2}
            sx={{
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { bg: 'gray.300', borderRadius: '2px' },
            }}
          >
            {assets.length === 0 ? (
              <Flex 
                direction="column" 
                align="center" 
                justify="center" 
                h="200px" 
                color="gray.400" 
                w="full"
                border="2px dashed"
                borderColor="gray.200"
                borderRadius="lg"
              >
                <Text>暂无灵感片段</Text>
                <Text fontSize="xs" mt={2}>在左侧输入并整理</Text>
              </Flex>
            ) : (
              assets.map((asset) => (
                <AssetEditorCard 
                  key={asset.id} 
                  asset={asset} 
                  onUpdate={handleUpdateAsset}
                  onDelete={handleDelete}
                  onSave={handleSaveAsset}
                />
              ))
            )}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default InspirationMode;