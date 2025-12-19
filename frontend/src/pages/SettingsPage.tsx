import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  Text,
  Button,
  FormControl,
  Switch,
  Divider,
  useColorMode,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Flex,
  useToast,
  Badge,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import {
  FaPalette,
  FaLock,
  FaSignOutAlt,
  FaHeadset,
  FaChevronRight,
  FaEnvelope,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

// 定义主题选项，颜色需与 App.tsx 中的 createTheme 对应
const THEME_OPTIONS = [
  { id: 'blue', label: '海洋蓝 (默认)', color: '#3182CE', bg: '#E6F2FF' },
  { id: 'red', label: '绯红暮光', color: '#E53E3E', bg: '#FFF5F5' },
  { id: 'green', label: '森林物语', color: '#38A169', bg: '#F0FFF4' },
  { id: 'purple', label: '霓虹紫韵', color: '#805AD5', bg: '#FAF5FF' },
  { id: 'yellow', label: '琥珀流金', color: '#D69E2E', bg: '#FFFFF0' },
];

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  // 从 Store 获取状态和方法
  const { user, logout, setThemePreference, themePreference, resetPassword } = useUserStore();
  
  const [isResetting, setIsResetting] = useState(false);
  const [contactEmail, setContactEmail] = useState('');

  // 动态颜色值
  const headingColor = useColorModeValue('gray.700', 'white');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const sectionIconBg = (color: string) => useColorModeValue(`${color}.100`, `${color}.900`);
  const sectionIconColor = (color: string) => useColorModeValue(`${color}.500`, `${color}.200`);

  // 处理退出登录
  const handleLogout = () => {
    logout();
    toast({ title: '已退出登录', status: 'info', duration: 2000, isClosable: true });
    navigate('/login');
  };

  // 处理重置密码
  const handleResetPassword = async () => {
    if (!user?.email) return;
    setIsResetting(true);
    try {
      await resetPassword(user.email);
      toast({
        title: '重置邮件已发送',
        description: `请查收发送至 ${user.email} 的邮件以重置密码。`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({ title: '发送失败', description: '请稍后重试', status: 'error', duration: 2000 });
    } finally {
      setIsResetting(false);
    }
  };

  // 处理主题切换
  const handleThemeChange = (themeId: string) => {
    // 调用 Store 方法更新全局偏好
    setThemePreference(themeId);
    
    const themeLabel = THEME_OPTIONS.find(t => t.id === themeId)?.label;
    toast({
      title: '主题已更新',
      description: `已切换至 ${themeLabel}`,
      status: 'success',
      duration: 1000,
      position: 'top',
    });
  };

  // 处理客服提交
  const handleContactSupport = () => {
    if (!contactEmail.trim()) {
      toast({ title: '请输入反馈内容', status: 'warning', duration: 2000 });
      return;
    }
    toast({
      title: '反馈已收到',
      description: '客服系统暂未上线，感谢您的建议！',
      status: 'info',
      duration: 2000,
    });
    setContactEmail('');
  };

  // 路由保护
  React.useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Box minH="100vh" py={8} px={4}>
      <Container maxW="container.lg">
        <Heading as="h1" size="xl" mb={2} color={headingColor} fontWeight="800">
          设置
        </Heading>
        <Text color={textColor} mb={8} fontSize="lg">
          管理您的账户偏好与系统设置
        </Text>

        <VStack spacing={6} align="stretch">
          
          {/* 界面外观设置 */}
          <Box bg={cardBg} borderRadius="2xl" p={{ base: 6, md: 8 }} boxShadow="sm" border="1px solid" borderColor={borderColor}>
            <Flex align="center" mb={6}>
              <Box p={2} bg={sectionIconBg('blue')} color={sectionIconColor('blue')} borderRadius="lg" mr={4}>
                <Icon as={FaPalette} boxSize={5} />
              </Box>
              <Box>
                <Heading size="md" color={headingColor}>界面外观</Heading>
                <Text fontSize="sm" color={textColor}>自定义您的视觉体验</Text>
              </Box>
            </Flex>

            <VStack spacing={6} align="stretch">
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="medium" color={headingColor}>深色模式</Text>
                  <Text fontSize="sm" color="gray.500">
                    {colorMode === 'dark' ? '当前为夜间模式' : '当前为日间模式'}
                  </Text>
                </Box>
                <Flex align="center" gap={3}>
                  <Icon as={colorMode === 'dark' ? FaMoon : FaSun} color="gray.400" />
                  <Switch size="lg" isChecked={colorMode === 'dark'} onChange={toggleColorMode} colorScheme="brand" />
                </Flex>
              </Flex>
              
              <Divider borderColor={borderColor} />

              <Box>
                <Text fontWeight="medium" color={headingColor} mb={4}>主题配色方案</Text>
                <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                  {THEME_OPTIONS.map((theme) => {
                    const isActive = themePreference === theme.id;
                    return (
                      <Flex
                        key={theme.id}
                        as="button"
                        onClick={() => handleThemeChange(theme.id)}
                        align="center"
                        p={3}
                        borderRadius="xl"
                        border="2px solid"
                        borderColor={isActive ? theme.color : 'transparent'}
                        bg={useColorModeValue(theme.bg, 'whiteAlpha.100')}
                        _hover={{ transform: 'scale(1.02)', shadow: 'md' }}
                        transition="all 0.2s"
                        justify="space-between"
                        position="relative"
                        overflow="hidden"
                      >
                         {/* 选中时的背景高亮指示 */}
                        {isActive && (
                          <Box 
                            position="absolute" 
                            left={0} 
                            top={0} 
                            bottom={0} 
                            w="4px" 
                            bg={theme.color} 
                          />
                        )}
                        
                        <Flex align="center" pl={isActive ? 2 : 0} transition="padding 0.2s">
                          <Box 
                            w={6} 
                            h={6} 
                            borderRadius="full" 
                            bg={theme.color} 
                            mr={3} 
                            shadow="sm" 
                            border="2px solid white"
                          />
                          <Text fontSize="sm" fontWeight={isActive ? 'bold' : 'medium'} color={headingColor}>
                            {theme.label}
                          </Text>
                        </Flex>
                        {isActive && <Icon as={FaChevronRight} color={theme.color} fontSize="xs" />}
                      </Flex>
                    );
                  })}
                </SimpleGrid>
              </Box>
            </VStack>
          </Box>

          {/* 安全与登录 */}
          <Box bg={cardBg} borderRadius="2xl" p={{ base: 6, md: 8 }} boxShadow="sm" border="1px solid" borderColor={borderColor}>
            <Flex align="center" mb={6}>
              <Box p={2} bg={sectionIconBg('red')} color={sectionIconColor('red')} borderRadius="lg" mr={4}>
                <Icon as={FaLock} boxSize={5} />
              </Box>
              <Box>
                <Heading size="md" color={headingColor}>安全与登录</Heading>
                <Text fontSize="sm" color={textColor}>保护您的账户安全</Text>
              </Box>
            </Flex>

            <VStack spacing={5} align="stretch">
              <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                <Box>
                  <Text fontWeight="medium" color={headingColor}>重置密码</Text>
                  <Text fontSize="sm" color="gray.500">
                    忘记密码？我们将向 <Text as="span" fontWeight="bold">{user.email}</Text> 发送重置链接
                  </Text>
                </Box>
                <Button leftIcon={<FaEnvelope />} onClick={handleResetPassword} isLoading={isResetting} colorScheme="gray" variant="outline" size="sm">
                  发送重置邮件
                </Button>
              </Flex>

              <Divider borderColor={borderColor} />

              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="medium" color={headingColor}>退出登录</Text>
                  <Text fontSize="sm" color="gray.500">结束当前会话并返回登录页面</Text>
                </Box>
                <Button 
                  leftIcon={<FaSignOutAlt />} 
                  onClick={handleLogout} 
                  colorScheme="red" 
                  variant="ghost" 
                  size="sm" 
                  _hover={{ bg: 'red.50', color: 'red.600' }}
                >
                  退出账号
                </Button>
              </Flex>
            </VStack>
          </Box>

          {/* 帮助与支持 */}
          <Box bg={cardBg} borderRadius="2xl" p={{ base: 6, md: 8 }} boxShadow="sm" border="1px solid" borderColor={borderColor}>
            <Flex align="center" mb={6}>
              <Box p={2} bg={sectionIconBg('green')} color={sectionIconColor('green')} borderRadius="lg" mr={4}>
                <Icon as={FaHeadset} boxSize={5} />
              </Box>
              <Box>
                <Heading size="md" color={headingColor}>帮助与支持</Heading>
                <Text fontSize="sm" color={textColor}>遇到问题？联系我们</Text>
              </Box>
              <Badge ml="auto" colorScheme="orange" variant="solid" borderRadius="full" px={2}>开发中</Badge>
            </Flex>

            <VStack spacing={4} align="stretch">
              <FormControl>
                <InputGroup>
                  <Input 
                    placeholder="请输入您的反馈或问题..." 
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    border="none"
                    _focus={{ boxShadow: 'none', bg: useColorModeValue('gray.100', 'gray.600') }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleContactSupport} colorScheme="brand" variant="solid">提交</Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Text fontSize="xs" color="gray.400">
                * 当前客服系统正在升级中，您的反馈将暂时只作记录，敬请谅解。
              </Text>
            </VStack>
          </Box>
          
          <Box textAlign="center" py={4}>
            <Text fontSize="xs" color="gray.400">Creata Platform v1.0.0 • Build 2024.05</Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default SettingsPage;