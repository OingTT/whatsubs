import useUser from '@/lib/client/useUser';
import styled from '@emotion/styled';
import { ContentType, Review, Watch } from '@prisma/client';
import {
  IconBookmark,
  IconCheck,
  IconEye,
  IconStar,
} from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Button from '../button/button';
import useMutation from '@/lib/client/useMutation';
import { useForm } from 'react-hook-form';
import { IconGroup } from '@/lib/client/style';

const Wrapper = styled.form`
  width: 100%;
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
`;

const TextArea = styled.textarea`
  width: 100%;
  border: none;
  border-radius: 8px;
  resize: none;
  padding: 0px;
  background-color: transparent;
  line-height: 1.6;
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: row;
`;

interface CommentForm {
  comment: string;
}

interface CommentInputProps {
  type: ContentType;
  id: number;
}

export default function CommentInput({ type, id }: CommentInputProps) {
  const user = useUser();
  const [review, setReview] = useState<Review>();
  const { data } = useSWR<Review[]>('/api/users/me/reviews');
  const [updateComment] = useMutation(
    `/api/contents/${type.toLowerCase()}/${id}/comment`
  );
  const { register, handleSubmit } = useForm<CommentForm>();

  useEffect(() => {
    setReview(
      data?.find(
        review => review.contentId === id && review.contentType === type
      )
    );
  }, [data, id, type]);

  const onSubmit = (data: CommentForm) => {
    updateComment({ ...data, watch: review?.watch });
  };

  return (
    <Wrapper onSubmit={handleSubmit(onSubmit)}>
      <Top>
        <Profile>
          <Avatar
            src={user?.avatar || '/images/avatar.png'}
            width={32}
            height={32}
            alt="Avatar"
          />
          <h6>{user?.name}</h6>
        </Profile>
        <ReviewInfo>
          {review?.rating && (
            <IconGroup gap={4}>
              <IconStar size={16} />
              {review.rating}
            </IconGroup>
          )}
          {review?.watch === Watch.WANT_TO_WATCH && (
            <IconBookmark size={20} stroke={1.6} />
          )}
          {review?.watch === Watch.WATCHING && (
            <IconEye size={20} stroke={1.6} />
          )}
          {review?.watch === Watch.WATCHED && (
            <IconCheck size={20} stroke={1.6} />
          )}
        </ReviewInfo>
      </Top>
      <TextArea
        {...register('comment', { required: true })}
        rows={3}
        placeholder="현재 느낌을 적어보세요."
      />
      <Bottom>
        <Button primary small>
          완료
        </Button>
      </Bottom>
    </Wrapper>
  );
}
