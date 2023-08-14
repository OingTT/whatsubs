import { Section } from '@/lib/client/style';
import CommentInput from '../input/comment-input';
import { ContentType } from '@prisma/client';
import CommentCard from '../comment-card';
import useSWR from 'swr';
import { UserWithComment } from '@/lib/client/interface';
import Alert from '../alert';
import useUser from '@/lib/client/useUser';
import styled from '@emotion/styled';

const Text = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-secondary);
`;

interface CommentsProps {
  type: ContentType;
  id: number;
}

export default function Comments({ type, id }: CommentsProps) {
  const user = useUser();
  const { data: users } = useSWR<UserWithComment[]>(
    `/api/contents/${type.toLowerCase()}/${id}/comments`
  );

  return (
    <Section>
      <h5>평가</h5>
      {user && (
        <>
          <Alert type="info">
            평가는 콘텐츠 시청 상태(찜하기, 보는중, 봤어요)에 따라 각각 하나씩
            남길 수 있어요.
          </Alert>
          <CommentInput type={type} id={id} />
        </>
      )}

      {users?.length ? (
        users?.map(user => (
          <CommentCard key={user.id} type={type} id={id} user={user} />
        ))
      ) : (
        <Text>아직 아무도 평가를 남기지 않았어요.</Text>
      )}
    </Section>
  );
}
