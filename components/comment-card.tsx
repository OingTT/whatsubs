import { CommentLike, UserWithComment } from '@/lib/client/interface';
import { IconGroup } from '@/lib/client/style';
import useMutation from '@/lib/client/useMutation';
import styled from '@emotion/styled';
import { ContentType, Watch } from '@prisma/client';
import {
  IconBookmark,
  IconCheck,
  IconCircleChevronLeft,
  IconCircleChevronRight,
  IconEye,
  IconMessage,
  IconStar,
  IconStarsFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from '@tabler/icons-react';
import Image from 'next/image';
import { useState } from 'react';
import useSWR from 'swr';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 16px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: var(--background-light);
  gap: 16px;
  border-radius: 16px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Profile = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled(Image)`
  border-radius: 32px;
`;

const ReviewInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
  color: var(--text-secondary);
  user-select: none;
`;

const Text = styled.p`
  width: 100%;
  white-space: pre-wrap;
`;

const Stack = styled.div<{ index: number }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: ${({ index }) => index * 4}px;
  left: ${({ index }) => index * -4}px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: var(--background-light);
  border-radius: 16px;
  opacity: ${({ index }) => 1 + index * 0.2};
  transform-origin: top left;
  transform: rotate(${({ index }) => index * -0.5}deg);
  z-index: ${({ index }) => index};
`;

const Slider = styled.div`
  right: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const IconButton = styled.div<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  color: var(--text-secondary);
`;

interface CommentCardProps {
  type: ContentType;
  id: number;
  user: UserWithComment;
}

export default function CommentCard({ type, id, user }: CommentCardProps) {
  const [index, setIndex] = useState(0);
  const { data: userValues } = useSWR<{ rating: number }>(
    `/api/users/${user.id}/reviews/values`
  );

  const { mutate: mutateComments } = useSWR<UserWithComment[]>(
    `/api/contents/${type.toLowerCase()}/${id}/comments`
  );

  const { data: likes, mutate: mutateLikes } = useSWR<CommentLike[]>(
    `/api/contents/${type.toLowerCase()}/${id}/comment-likes`
  );

  const [toggleLike] = useMutation(
    `/api/comments/${user.comments[index].id}/like`
  );

  const handleLeft = () => {
    if (index === 0) return;
    setIndex(index - 1);
  };

  const handleRight = () => {
    if (index === user.comments.length - 1) return;
    setIndex(index + 1);
  };

  const handleLike = () => {
    if (likes) {
      const userId = user.id;
      const commentId = user.comments[index].id;
      const likeIndex = likes.findIndex(like => like.commentId === commentId);

      toggleLike({});

      mutateComments(
        prev =>
          prev &&
          prev.map(user => {
            if (user.id === userId) {
              return {
                ...user,
                comments: user.comments.map(comment => {
                  if (comment.id === commentId) {
                    return {
                      ...comment,
                      _count: {
                        likes:
                          comment._count.likes + (likeIndex === -1 ? 1 : -1),
                      },
                    };
                  }
                  return comment;
                }),
              };
            }
            return user;
          }),
        false
      );

      if (likeIndex === -1) {
        mutateLikes([...likes, { commentId }], false);
      } else {
        mutateLikes(
          likes.filter(like => like.commentId !== commentId),
          false
        );
      }
    }
  };

  return (
    <Wrapper>
      <Top>
        <Profile>
          <Avatar
            src={user.avatar || '/images/avatar.png'}
            width={32}
            height={32}
            alt="Avatar"
          />
          <h6>{user.name}</h6>
          <IconGroup gap={4}>
            <IconStarsFilled size={16} />
            {userValues?.rating?.toFixed(1) || '-.-'}
          </IconGroup>
        </Profile>
        <ReviewInfo>
          {user.reviews[0]?.rating && (
            <IconGroup gap={4}>
              <IconStar size={16} stroke={2.25} />
              {user.reviews[0].rating}
            </IconGroup>
          )}

          <Slider>
            <IconButton disabled={index === 0}>
              <IconCircleChevronLeft
                size={20}
                stroke={1.8}
                onClick={handleLeft}
              />
            </IconButton>

            {user.comments[index].watch === Watch.WANT_TO_WATCH && (
              <IconBookmark size={20} stroke={1.8} />
            )}
            {user.comments[index].watch === Watch.WATCHING && (
              <IconEye size={20} stroke={1.8} />
            )}
            {user.comments[index].watch === Watch.WATCHED && (
              <IconCheck size={20} stroke={1.8} />
            )}

            <IconButton disabled={index === user.comments.length - 1}>
              <IconCircleChevronRight
                size={20}
                stroke={1.8}
                onClick={handleRight}
              />
            </IconButton>
          </Slider>
        </ReviewInfo>
      </Top>

      <Text>{user.comments[index].text}</Text>

      <Bottom>
        <IconGroup button gap={4} onClick={handleLike}>
          {likes?.some(like => like.commentId === user.comments[index].id) ? (
            <IconThumbUpFilled size={20} stroke={1.8} />
          ) : (
            <IconThumbUp size={20} stroke={1.8} />
          )}
          {user.comments[index]._count.likes}
        </IconGroup>
        <IconGroup gap={6}>
          <IconMessage size={20} stroke={1.8} />
          준비중
        </IconGroup>
      </Bottom>

      {user.comments.length > 1 &&
        [...Array(user.comments.length - 1 - index)].map((_, i) => (
          <Stack key={i} index={-i - 1} />
        ))}
    </Wrapper>
  );
}
