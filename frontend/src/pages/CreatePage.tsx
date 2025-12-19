import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FaLightbulb, FaPenNib } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InspirationMode } from '../components/InspirationMode';
import { DraftMode } from '../components/DraftMode';
import { useUserStore } from '../stores/userStore';

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  
  // 状态管理
  const { isAuthenticated } = useUserStore();
  const [tabIndex, setTabIndex] = useState(0);

  // 样式配置：适配深色模式与极简风格
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headerColor = useColorModeValue('gray.700', 'white');
  const tabListBg = useColorModeValue('white', 'gray.800');

  // 初始化检查与路由参数处理
  useEffect(() => {
    // 权限守卫
    if (!isAuthenticated) {
      toast({
        title: '需先登录',
        description: '请登录后访问创作中心',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    // 支持通过 URL 参数控制默认 Tab，例如 /create?mode=draft
    const mode = searchParams.get('mode');
    if (mode === 'draft') {
      setTabIndex(1);
    }
  }, [isAuthenticated, navigate, toast, searchParams]);

  // 草稿发布成功回调：跳转到个人主页
  const handleDraftSuccess = () => {
    navigate('/profile');
  };

  return (
    <Box minH="calc(100vh - 60px)" bg={bgColor} py={6}>
      <Container maxW="container.xl" h="full" display="flex" flexDirection="column">
        
        {/* 页面头部说明 */}
        <Box mb={6}>
          <Heading size="lg" mb={2} color={headerColor}>
            创作中心
          </Heading>
          <Text color="gray.500" fontSize="md">
            在这里记录灵感碎片，或潜心打磨您的下一部杰作。
          </Text>
        </Box>

        {/* 核心功能区：Tab 切换 */}
        <Tabs
          index={tabIndex}
          onChange={setTabIndex}
          variant="soft-rounded"
          colorScheme="blue"
          isLazy
          flex="1"
          display="flex"
          flexDirection="column"
        >
          {/* Tab 导航 */}
          <TabList 
            bg={tabListBg} 
            p={1} 
            borderRadius="xl" 
            boxShadow="sm" 
            mb={6} 
            alignSelf="flex-start"
            display="inline-flex"
          >
            <Tab gap={2} px={6} py={3} _selected={{ color: 'white', bg: 'blue.400' }}>
              <Icon as={FaLightbulb} />
              灵感捕捉
            </Tab>
            <Tab gap={2} px={6} py={3} _selected={{ color: 'white', bg: 'blue.400' }}>
              <Icon as={FaPenNib} />
              草稿创作
            </Tab>
          </TabList>

          {/* Tab 内容面板 */}
          <TabPanels flex="1" position="relative">
            {/* 模式一：灵感模式 */}
            <TabPanel p={0} h="full">
              <InspirationMode />
            </TabPanel>

            {/* 模式二：草稿模式 */}
            <TabPanel p={0} h="full">
              <DraftMode onSuccess={handleDraftSuccess} />
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        {/* 动态插槽：用于后续扩展功能，如写作辅助工具栏等 */}
        <Box id="create-page-slot" mt={4} />
      </Container>
    </Box>
  );
};

export default CreatePage;