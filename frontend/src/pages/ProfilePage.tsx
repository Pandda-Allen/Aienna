import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Icon,
  Button,
  useColorModeValue,
  VStack,
  HStack,
  Avatar,
  Divider,
  Badge,
  Card,
  CardBody,
  useToast,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaUserLock, FaEnvelope, FaIdBadge, FaCalendarAlt, FaCamera, FaSave, FaTimes, FaPen } from 'react-icons/fa';
import { useUserStore } from '../stores/userStore';
import { useWorksStore } from '../stores/worksStore';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const { user, isAuthenticated, updateProfile } = useUserStore();
  const { userWorks, fetchUserWorks, favoriteWorks, fetchUserFavorites } = useWorksStore();

  // 编辑状态
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 颜色模式适配
  const cardBg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.700', 'white');
  const textColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const inputBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    if (isAuthenticated && user) {
      // 获取数据用于统计显示
      fetchUserWorks(user.id);
      fetchUserFavorites(user.id);
      
      // 初始化编辑状态
      setEditName(user.name);
      setEditBio(user.bio || '');
      setEditAvatar(user.avatar);
    }
  }, [isAuthenticated, user, fetchUserWorks, fetchUserFavorites]);

  const handleSave = () => {
    if (!editName.trim()) {
      toast({
        title: '用户名不能为空',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    updateProfile({
      name: editName,
      bio: editBio,
      avatar: editAvatar
    });

    setIsEditing(false);
    toast({
      title: '个人资料已更新',
      status: 'success',
      duration: 2000,
    });
  };

  const handleCancel = () => {
    if (user) {
      setEditName(user.name);
      setEditBio(user.bio || '');
      setEditAvatar(user.avatar);
    }
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 模拟上传，实际应上传至服务器或 Supabase Storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxW="container.xl" py={12} h="80vh" centerContent display="flex" justifyContent="center">
        <VStack spacing={8} p={8} bg={cardBg} borderRadius="2xl" boxShadow="xl" maxW="md" w="full" textAlign="center" border="1px" borderColor={borderColor}>
          <Box p={6} bg="gray.100" borderRadius="full" color="gray.400">
            <Icon as={FaUserLock} w={12} h={12} />
          </Box>
          <VStack spacing={2}>
            <Heading size="lg" color={headingColor}>访问受限</Heading>
            <Text color={textColor}>请登录以查看您的个人资料。</Text>
          </VStack>
          <Button 
            colorScheme="blue" 
            size="lg" 
            w="full"
            bgGradient="linear(to-r, blue.400, blue.500)"
            _hover={{ bgGradient: "linear(to-r, blue.500, blue.600)", transform: "translateY(-1px)", boxShadow: "lg" }}
            onClick={() => navigate('/login')}
          >
            登录 / 注册
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Box minH="calc(100vh - 60px)" py={10}>
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          
          <Flex align="center" justify="space-between" mb={2}>
            <Box>
              <Heading size="lg" color={headingColor}>用户中心</Heading>
              <Text color={textColor} mt={1}>管理您的个人信息与账户资料</Text>
            </Box>
            {!isEditing ? (
              <Button 
                leftIcon={<FaPen />} 
                colorScheme="blue" 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                编辑资料
              </Button>
            ) : (
              <HStack>
                <Button 
                  leftIcon={<FaTimes />} 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCancel}
                >
                  取消
                </Button>
                <Button 
                  leftIcon={<FaSave />} 
                  colorScheme="blue" 
                  size="sm"
                  onClick={handleSave}
                >
                  保存
                </Button>
              </HStack>
            )}
          </Flex>

          {/* 用户概览卡片 */}
          <Card bg={cardBg} borderRadius="2xl" boxShadow="sm" border="1px" borderColor={borderColor} overflow="hidden">
            {/* 顶部背景图 */}
            <Box h="140px" bgGradient="linear(to-r, blue.400, purple.500)" position="relative">
               {/* 纯装饰背景，未来可支持自定义 */}
            </Box>
            
            <CardBody mt="-70px" px={{ base: 6, md: 10 }} pb={10}>
              <Flex direction="column" align="center" mb={6}>
                <Box position="relative" group="true">
                  <Avatar 
                    size="2xl" 
                    src={isEditing ? editAvatar : user?.avatar} 
                    name={user?.name} 
                    border="4px solid white" 
                    boxShadow="lg"
                    cursor={isEditing ? 'pointer' : 'default'}
                    onClick={handleAvatarClick}
                    bg="gray.300"
                  />
                  {isEditing && (
                    <Tooltip label="点击更换头像" placement="top">
                      <Flex
                        position="absolute"
                        bottom={0}
                        right={0}
                        bg="blue.500"
                        color="white"
                        w={8}
                        h={8}
                        borderRadius="full"
                        align="center"
                        justify="center"
                        border="2px solid white"
                        cursor="pointer"
                        onClick={handleAvatarClick}
                      >
                        <Icon as={FaCamera} boxSize={3} />
                      </Flex>
                    </Tooltip>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Box>

                <VStack mt={4} spacing={1} textAlign="center" w="full" maxW="md">
                  {isEditing ? (
                    <FormControl>
                      <FormLabel fontSize="xs" color="gray.500" textAlign="center">昵称</FormLabel>
                      <Input 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        textAlign="center"
                        fontWeight="bold"
                        fontSize="xl"
                        variant="filled"
                        bg={inputBg}
                      />
                    </FormControl>
                  ) : (
                    <Flex align="center" gap={2}>
                      <Heading size="lg" color={headingColor}>{user?.name}</Heading>
                      <Badge colorScheme="blue" borderRadius="full" px={2}>创作者</Badge>
                    </Flex>
                  )}
                  
                  {isEditing ? (
                     <FormControl mt={2}>
                      <FormLabel fontSize="xs" color="gray.500" textAlign="center">个性签名</FormLabel>
                      <Textarea 
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        textAlign="center"
                        fontSize="md"
                        variant="filled"
                        bg={inputBg}
                        rows={2}
                        resize="none"
                      />
                    </FormControl>
                  ) : (
                    <Text color={textColor} fontSize="md" maxW="lg" mt={2} fontStyle={user?.bio ? 'normal' : 'italic'}>
                      {user?.bio || '这个人很懒，什么都没写...'}
                    </Text>
                  )}
                </VStack>
              </Flex>

              <Divider my={6} />

              {/* 统计数据 (只读) */}
              <HStack spacing={0} justify="space-around" mb={8} w="full">
                <VStack>
                  <Heading size="lg" color="blue.500">{userWorks.length}</Heading>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium">作品总数</Text>
                </VStack>
                <Divider orientation="vertical" h="40px" />
                <VStack>
                  <Heading size="lg" color="pink.500">{favoriteWorks.length}</Heading>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium">收藏内容</Text>
                </VStack>
                <Divider orientation="vertical" h="40px" />
                <VStack>
                  <Heading size="lg" color="purple.500">
                     {Math.floor((new Date().getTime() - new Date(user?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
                  </Heading>
                  <Text fontSize="sm" color="gray.500" fontWeight="medium">加入天数</Text>
                </VStack>
              </HStack>

              {/* 详细信息 (只读) */}
              <VStack spacing={4} align="stretch" bg={useColorModeValue('gray.50', 'gray.700')} p={6} borderRadius="xl">
                <HStack align="center" justify="space-between">
                  <HStack>
                    <Icon as={FaEnvelope} color="blue.400" />
                    <Text fontSize="sm" fontWeight="bold" color="gray.500">绑定邮箱</Text>
                  </HStack>
                  <Text color={headingColor} fontSize="sm" fontWeight="medium">{user?.email}</Text>
                </HStack>
                <Divider />
                
                <HStack align="center" justify="space-between">
                  <HStack>
                    <Icon as={FaCalendarAlt} color="green.400" />
                    <Text fontSize="sm" fontWeight="bold" color="gray.500">注册时间</Text>
                  </HStack>
                  <Text color={headingColor} fontSize="sm" fontWeight="medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '未知'}
                  </Text>
                </HStack>
                <Divider />

                <HStack align="center" justify="space-between">
                  <HStack>
                    <Icon as={FaIdBadge} color="purple.400" />
                    <Text fontSize="sm" fontWeight="bold" color="gray.500">用户 ID</Text>
                  </HStack>
                  <Text color={headingColor} fontSize="sm" fontFamily="monospace">
                    {user?.id}
                  </Text>
                </HStack>
              </VStack>

            </CardBody>
          </Card>

        </VStack>
      </Container>
    </Box>
  );
};

export default ProfilePage;