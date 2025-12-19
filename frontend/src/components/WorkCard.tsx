import React from 'react';
import {
  Box,
  Image,
  Text,
  Heading,
  Flex,
  Icon,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  useColorModeValue,
  AspectRatio,
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Work } from '../services/works';

interface WorkCardProps {
  work: Work;
  onClick: () => void;
  onToggleLike: (id: string) => void;
}

export const WorkCard: React.FC<WorkCardProps> = ({ work, onClick, onToggleLike }) => {
  // 定义颜色和样式
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const titleColor = useColorModeValue('gray.800', 'white');
  const accentColor = 'blue.400';

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止触发卡片整体点击
    onToggleLike(work.id);
  };

  return (
    <Box
      w="full"
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="sm"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'md',
        cursor: 'pointer',
      }}
      onClick={onClick}
      role="group"
      position="relative"
    >
      {/* 图片区域 */}
      <AspectRatio ratio={4 / 3}>
        <Image
          src={work.image}
          alt={work.title}
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
          transition="transform 0.3s ease"
          _groupHover={{ transform: 'scale(1.05)' }}
        />
      </AspectRatio>

      {/* 内容区域 */}
      <Box p={4}>
        <Flex justify="space-between" align="start" mb={2}>
          <Box flex="1" pr={2}>
            <Heading
              as="h3"
              size="md"
              color={titleColor}
              noOfLines={1}
              mb={1}
              fontWeight="bold"
            >
              {work.title}
            </Heading>
            <Flex align="center" gap={2} mb={2}>
              <Avatar size="2xs" name={work.author} src={`https://ui-avatars.com/api/?name=${work.author}&background=random`} />
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                {work.author}
              </Text>
            </Flex>
          </Box>
          
          <Tooltip label={work.is_liked ? "取消收藏" : "收藏作品"} fontSize="xs">
            <IconButton
              aria-label="Like work"
              icon={<Icon as={work.is_liked ? FaHeart : FaRegHeart} />}
              size="sm"
              variant="ghost"
              color={work.is_liked ? 'red.400' : 'gray.400'}
              _hover={{ color: 'red.500', bg: 'red.50' }}
              onClick={handleLikeClick}
              borderRadius="full"
            />
          </Tooltip>
        </Flex>

        <Text fontSize="sm" color={textColor} noOfLines={2} lineHeight="tall">
          {work.description}
        </Text>

        <Flex mt={4} justify="space-between" align="center">
          <Flex gap={2}>
            {work.tags && work.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} colorScheme="blue" variant="subtle" fontSize="xs" borderRadius="full" px={2}>
                #{tag}
              </Badge>
            ))}
          </Flex>
          
          <Text fontSize="xs" color="gray.400">
            {new Date(work.created_at).toLocaleDateString()}
          </Text>
        </Flex>
      </Box>

      {/* 状态标识 (可选) */}
      {work.status === 'draft' && (
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme="orange"
          variant="solid"
          fontSize="xs"
        >
          草稿
        </Badge>
      )}
    </Box>
  );
};