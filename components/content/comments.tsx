import { Section } from '@/lib/client/style';
import CommentInput from '../input/comment-input';
import { ContentType } from '@prisma/client';
import CommentCard from '../comment-card';
import useSWR from 'swr';
import { UserWithComment } from '@/lib/client/interface';
import Alert from '../alert';

interface CommentsProps {
  type: ContentType;
  id: number;
}

export default function Comments({ type, id }: CommentsProps) {
  const { data: users } = useSWR<UserWithComment[]>(
    `/api/contents/${type.toLowerCase()}/${id}/comments`
  );

  return (
    <Section>
      <h5>평가</h5>
      <Alert type="info">
        평가는 콘텐츠 시청 상태(찜하기, 보는중, 봤어요)에 따라 각각 하나씩 남길
        수 있어요.
      </Alert>
      <CommentInput type={type} id={id} />
      {users?.map(user => (
        <CommentCard key={user.id} type={type} id={id} user={user} />
      ))}
    </Section>
  );
}
