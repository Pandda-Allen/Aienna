import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  useColorModeValue,
  Divider,
  Icon,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { FaCamera, FaSave, FaTimes, FaPen, FaUserCircle, FaCalendarAlt, FaIdCard, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { useWorksStore } from '../stores/worksStore';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Store
  const { user, isAuthenticated, updateProfile } = useUserStore();
  const { userWorks, fetchUserWorks } = useWorksStore();

  // Local State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');

  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // 初始化检查与数据加载
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: '请先登录',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      navigate('/login');
      return;
    }

    if (user) {
      setEditName(user.name);
      setEditBio(user.bio || '');
      // 加载用户作品以统计数量
      fetchUserWorks(user.id);
    }
  }, [isAuthenticated, user, navigate, toast, fetchUserWorks]);

  // 处理保存
  const handleSave = () => {
    if (!editName.trim()) {
      toast({ title: '用户名不能为空', status: 'error', duration: 2000 });
      return;
    }

    updateProfile({
      name: editName,
      bio: editBio,
    });

    setIsEditing(false);
    toast({ title: '个人资料已更新', status: 'success', duration: 2000 });
  };

  // 处理取消
  const handleCancel = () => {
    if (user) {
      setEditName(user.name);
      setEditBio(user.bio || '');
    }
    setIsEditing(false);
  };

  // 模拟头像上传
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 真实场景应上传至服务器/OSS，此处使用本地模拟
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result as string });
        toast({ title: '头像已更新', status: 'success', duration: 2000 });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <Box minH="calc(100vh - 60px)" bg={bgColor} py={8}>
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          
          {/* 页面标题 */}
          <Box mb={2}>
            <Heading size="lg" color={useColorModeValue('gray.700', 'white')}>用户中心</Heading>
            <Text color="gray.500">管理您的个人档案与账户信息</Text>
          </Box>

          {/* 核心卡片：个人资料 */}
          <Box 
            bg={cardBg} 
            borderRadius="xl" 
            boxShadow="sm" 
            p={{ base: 6, md: 8 }}
            border="1px solid"
            borderColor={borderColor}
            position="relative"
            overflow="hidden"
          >
            {/* 顶部背景装饰 */}
            <Box 
              position="absolute" 
              top={0} 
              left={0} 
              right={0} 
              h="120px" 
              bgGradient="linear(to-r, blue.400, purple.500)" 
              opacity={0.8} 
            />

            <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'center', md: 'flex-start' }} mt={12} gap={6}>
              {/* 头像区域 */}
              <Box position="relative">
                <Avatar 
                  size="2xl" 
                  src={user.avatar} 
                  name={user.name} 
                  border="4px solid white" 
                  boxShadow="lg"
                  cursor="pointer"
                  onClick={handleAvatarClick}
                  _hover={{ opacity: 0.9 }}
                />
                <IconButton
                  aria-label="Upload avatar"
                  icon={<FaCamera />}
                  size="sm"
                  colorScheme="gray"
                  position="absolute"
                  bottom={2}
                  right={2}
                  borderRadius="full"
                  boxShadow="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAvatarClick();
                  }}
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </Box>

              {/* 信息展示与编辑区域 */}
              <Box flex={1} w="full" pt={{ base: 2, md: 10 }}>
                {isEditing ? (
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontSize="sm" color="gray.500">用户名</FormLabel>
                      <Input 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        bg={useColorModeValue('gray.50', 'gray.700')}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" color="gray.500">个性签名</FormLabel>
                      <Textarea 
                        value={editBio} 
                        onChange={(e) => setEditBio(e.target.value)} 
                        placeholder="介绍一下你自己..."
                        bg={useColorModeValue('gray.50', 'gray.700')}
                        resize="none"
                      />
                    </FormControl>
                    <HStack spacing={4} pt={2}>
                      <Button leftIcon={<FaSave />} colorScheme="blue" onClick={handleSave} size="sm">
                        保存更改
                      </Button>
                      <Button leftIcon={<FaTimes />} variant="ghost" onClick={handleCancel} size="sm">
                        取消
                      </Button>
                    </HStack>
                  </VStack>
                ) : (
                  <VStack align="start" spacing={1} textAlign={{ base: 'center', md: 'left' }} w="full">
                    <Flex justify={{ base: 'center', md: 'space-between' }} w="full" align="center">
                      <Heading size="lg" color={useColorModeValue('gray.800', 'white')}>
                        {user.name}
                      </Heading>
                      <Button 
                        leftIcon={<FaPen />} 
                        size="sm" 
                        variant="outline" 
                        colorScheme="blue"
                        onClick={() => setIsEditing(true)}
                        display={{ base: 'none', md: 'flex' }}
                      >
                        编辑资料
                      </Button>
                    </Flex>
                    
                    <Text color="gray.500" fontSize="md" fontStyle={user.bio ? 'normal' : 'italic'}>
                      {user.bio || '这个人很懒，什么都没写...'}
                    </Text>

                    {/* 移动端编辑按钮 */}
                    <Button 
                      leftIcon={<FaPen />} 
                      size="sm" 
                      variant="outline" 
                      colorScheme="blue"
                      onClick={() => setIsEditing(true)}
                      display={{ base: 'flex', md: 'none' }}
                      mt={4}
                    >
                      编辑资料
                    </Button>
                  </VStack>
                )}
              </Box>
            </Flex>

            <Divider my={8} borderColor={borderColor} />

            {/* 统计数据 */}
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={6} textAlign="center">
              <Stat>
                <StatLabel color="gray.500">发布作品</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="blue.500">
                  {userWorks.length}
                </StatNumber>
                <StatHelpText>部</StatHelpText>
              </Stat>
              
              <Stat>
                <StatLabel color="gray.500">加入时间</StatLabel>
                <StatNumber fontSize="xl" fontWeight="bold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </StatNumber>
                <StatHelpText>成为创作者</StatHelpText>
              </Stat>

               <Stat>
                <StatLabel color="gray.500">账户状态</StatLabel>
                <StatNumber fontSize="xl" fontWeight="bold" color="green.500">
                  正常
                </StatNumber>
                <StatHelpText>已认证</StatHelpText>
              </Stat>
            </SimpleGrid>
          </Box>

          {/* 详细信息卡片 */}
          <Box 
            bg={cardBg} 
            borderRadius="xl" 
            boxShadow="sm" 
            p={{ base: 6, md: 8 }}
            border="1px solid"
            borderColor={borderColor}
          >
            <Heading size="md" mb={6} color={useColorModeValue('gray.700', 'white')}>账号信息</Heading>
            
            <VStack spacing={4} align="stretch">
              <Flex align="center" p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                <Icon as={FaIdCard} color="blue.400" mr={4} boxSize={5} />
                <Box>
                  <Text fontSize="xs" color="gray.500">用户 ID</Text>
                  <Text fontSize="sm" fontFamily="monospace" fontWeight="medium">{user.id}</Text>
                </Box>
                <Badge ml="auto" colorScheme="purple">UID</Badge>
              </Flex>

              <Flex align="center" p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                <Icon as={FaEnvelope} color="orange.400" mr={4} boxSize={5} />
                <Box>
                  <Text fontSize="xs" color="gray.500">注册邮箱</Text>
                  <Text fontSize="sm" fontWeight="medium">{user.email}</Text>
                </Box>
                <Badge ml="auto" colorScheme="green">Verified</Badge>
              </Flex>

              <Flex align="center" p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="lg">
                <Icon as={FaCalendarAlt} color="teal.400" mr={4} boxSize={5} />
                <Box>
                  <Text fontSize="xs" color="gray.500">创建时间</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {new Date(user.createdAt).toLocaleString()}
                  </Text>
                </Box>
              </Flex>
            </VStack>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
};

export default UserProfilePage;