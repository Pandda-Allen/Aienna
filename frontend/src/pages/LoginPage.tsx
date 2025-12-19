import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Container,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  Link,
  useColorModeValue,
  FormErrorMessage,
  Fade,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

export const LoginPage: React.FC = () => {
  // 状态管理
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // 表单字段
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // 错误提示状态
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Hooks
  const navigate = useNavigate();
  const toast = useToast();
  const { login, register, isLoading, error: storeError, clearError } = useUserStore();

  // 颜色定义：适配极简风格
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const linkColor = 'blue.500';

  // 切换视图时重置状态
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    clearError();
    setEmailError('');
    setPasswordError('');
  };

  // 前端简单验证
  const validate = () => {
    let isValid = true;
    
    if (!email.includes('@')) {
      setEmailError('请输入有效的邮箱地址');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 8) {
      setPasswordError('密码长度需大于7位');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let success = false;

    if (isLoginView) {
      success = await login(email, password);
    } else {
      success = await register(email, password, name);
    }

    if (success) {
      toast({
        title: isLoginView ? '欢迎回来' : '注册成功',
        description: isLoginView ? '登录成功，正在跳转...' : '账号已创建，已自动登录',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      // 延迟跳转以展示成功动画
      setTimeout(() => {
        navigate('/'); 
      }, 500);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={bgColor}
      px={4}
    >
      <Container maxW="md">
        <Box
          bg={cardBg}
          p={{ base: 6, md: 8 }}
          borderRadius="2xl"
          boxShadow="xl"
          textAlign="center"
          border="1px solid"
          borderColor={useColorModeValue('gray.100', 'gray.600')}
        >
          {/* Logo 占位 */}
          <Box 
            mx="auto" 
            mb={6} 
            w={14} 
            h={14} 
            bgGradient="linear(to-tr, blue.400, purple.400)" 
            borderRadius="xl" 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            color="white" 
            fontSize="2xl" 
            fontWeight="bold"
            boxShadow="md"
          >
            C
          </Box>
          
          <Heading as="h1" size="lg" mb={2} color={useColorModeValue('gray.700', 'white')}>
            {isLoginView ? '欢迎回来' : '创建账号'}
          </Heading>
          
          <Text fontSize="md" color="gray.500" mb={8}>
            {isLoginView ? '登录以继续创作您的精彩内容' : '加入 Creata，开启您的创作之旅'}
          </Text>

          {/* 表单区域 */}
          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
              
              {/* 注册模式下的昵称输入 */}
              {!isLoginView && (
                <Fade in={!isLoginView}>
                  <FormControl id="name" isRequired>
                    <FormLabel fontSize="sm" color="gray.600">昵称</FormLabel>
                    <Input 
                      type="text" 
                      placeholder="您的称呼" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      focusBorderColor="blue.400"
                      bg={useColorModeValue('gray.50', 'gray.800')}
                      border="none"
                      _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                    />
                  </FormControl>
                </Fade>
              )}

              <FormControl id="email" isInvalid={!!emailError} isRequired>
                <FormLabel fontSize="sm" color="gray.600">邮箱地址</FormLabel>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  focusBorderColor="blue.400"
                  bg={useColorModeValue('gray.50', 'gray.800')}
                  border="none"
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                />
                <FormErrorMessage>{emailError}</FormErrorMessage>
              </FormControl>

              <FormControl id="password" isInvalid={!!passwordError} isRequired>
                <FormLabel fontSize="sm" color="gray.600">密码</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    focusBorderColor="blue.400"
                    bg={useColorModeValue('gray.50', 'gray.800')}
                    border="none"
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={showPassword ? "隐藏密码" : "显示密码"}
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      icon={showPassword ? <ViewOffIcon color="gray.400" /> : <ViewIcon color="gray.400" />}
                      size="sm"
                      _hover={{ bg: 'transparent' }}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              </FormControl>

              {/* Store 返回的全局错误信息 */}
              {storeError && (
                <Text color="red.500" fontSize="sm" textAlign="left" bg="red.50" p={2} borderRadius="md">
                  {storeError}
                </Text>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
                loadingText={isLoginView ? "登录中..." : "注册中..."}
                mt={2}
                w="full"
                bgGradient="linear(to-r, blue.400, blue.500)"
                _hover={{
                  bgGradient: "linear(to-r, blue.500, blue.600)",
                  boxShadow: "lg",
                  transform: 'translateY(-1px)'
                }}
                transition="all 0.2s"
              >
                {isLoginView ? '登 录' : '注 册'}
              </Button>
            </VStack>
          </form>

          {/* 底部切换链接 */}
          <Flex justify="center" mt={6}>
            <Text fontSize="sm" color="gray.600">
              {isLoginView ? '还没有账号？' : '已有账号？'}
              <Link
                color={linkColor}
                fontWeight="semibold"
                ml={1}
                onClick={toggleView}
                _hover={{ textDecoration: 'none', color: 'blue.600' }}
              >
                {isLoginView ? '立即注册' : '直接登录'}
              </Link>
            </Text>
          </Flex>
        </Box>
      </Container>
    </Flex>
  );
};

export default LoginPage;