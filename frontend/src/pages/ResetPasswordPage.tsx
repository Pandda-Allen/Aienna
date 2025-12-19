import React, { useState, useEffect } from 'react';
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
  useColorModeValue,
  FormErrorMessage,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaArrowLeft } from 'react-icons/fa';
import { useUserStore } from '../stores/userStore';
import { supabase } from '../services/supabase'; 

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, updateProfile, isAuthenticated } = useUserStore();

  // 状态管理
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 样式定义
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // 路由保护
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast({
        title: '需先登录',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      navigate('/login');
    }}, [isAuthenticated, user, navigate, toast]);

  const validate = () => {
    let isValid = true;
    const newErrors = { oldPassword: '', newPassword: '', confirmPassword: '' };

    if (!oldPassword) {
      newErrors.oldPassword = '请输入原密码';
      isValid = false;
    }

    if (newPassword.length < 4) {
      newErrors.newPassword = '新密码长度需大于3位';
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);

    try {
      // 模拟验证原密码逻辑
      // 注意：真实场景中，密码验证应在后端进行，前端不应知晓用户真实密码
      // 这里为了演示 Mock 效果，假设 user 对象中包含了用于 Mock 验证的密码
      if (user?.password && user.password !== oldPassword) {
        setErrors(prev => ({ ...prev, oldPassword: '原密码错误' }));
        setIsSubmitting(false);
        return;
      }
      console.log("Old password verified, proceeding to update to new password.");
      // SUPABASE IMPLEMENTATION:
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) console.error("Error updating password: ", error.name, error.message);
      if (error) throw error;

      // 更新users中的密码
      updateProfile({ password: newPassword });

      toast({
        title: '密码修改成功',
        description: '下次登录请使用新密码',
        status: 'success',
        duration: 2000,
      });

      // 清空表单并跳转
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigate('/settings');

    } catch (error) {
      toast({
        title: '修改失败',
        description: '请稍后重试',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bgColor} py={12} px={4}>
      <Container maxW="md">
        <Box
          bg={cardBg}
          p={8}
          borderRadius="2xl"
          boxShadow="lg"
          border="1px solid"
          borderColor={borderColor}
        >
          <VStack spacing={6} align="stretch">
            <Flex align="center" mb={2}>
              <Box 
                p={3} 
                bg="blue.50" 
                color="blue.500" 
                borderRadius="full" 
                mr={4}
              >
                <Icon as={FaLock} boxSize={5} />
              </Box>
              <Box>
                <Heading size="md" color={useColorModeValue('gray.800', 'white')}>重置密码</Heading>
                <Text fontSize="sm" color={textColor}>
                  为账号 <Text as="span" fontWeight="bold" color="blue.500">{user.name}</Text> 设置新密码
                </Text>
              </Box>
            </Flex>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.oldPassword} isRequired>
                  <FormLabel fontSize="sm" color={textColor}>原密码</FormLabel>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="请输入当前使用的密码"
                    bg={useColorModeValue('white', 'gray.800')}
                  />
                  <FormErrorMessage>{errors.oldPassword}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.newPassword} isRequired>
                  <FormLabel fontSize="sm" color={textColor}>新密码</FormLabel>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="设置新的密码 (至少4位)"
                    bg={useColorModeValue('white', 'gray.800')}
                  />
                  <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.confirmPassword} isRequired>
                  <FormLabel fontSize="sm" color={textColor}>确认新密码</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="再次输入新密码"
                    bg={useColorModeValue('white', 'gray.800')}
                  />
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  mt={4}
                  isLoading={isSubmitting}
                  loadingText="正在保存..."
                  bgGradient="linear(to-r, blue.400, blue.500)"
                  _hover={{ bgGradient: "linear(to-r, blue.500, blue.600)" }}
                >
                  确认修改
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Icon as={FaArrowLeft} />}
                  onClick={() => navigate('/settings')}
                  color="gray.500"
                >
                  返回设置
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Container>
    </Flex>
  );
};

export default ResetPasswordPage;