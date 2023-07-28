import TextInput from '@/components/input/text-input';
import SignupLayout from '@/components/layout/signup-layout';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { authOptions } from '../api/auth/[...nextauth]';
import useMutation from '@/lib/client/useMutation';
import { useEffect } from 'react';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 48px;
`;

const Images = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`;

const ImageWrapper = styled.label`
  position: relative;
  cursor: pointer;
`;

const UserImage = styled(Image)`
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border-radius: 100%;
  filter: contrast(50%) opacity(50%);
`;

const Input = styled.input`
  display: none;

  &:checked ~ img {
    filter: none;
  }
`;

interface ProfileForm {
  avatar: string;
  name: string;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: { session: JSON.parse(JSON.stringify(session)) },
  };
};

export default function Profile() {
  const router = useRouter();
  const { data: session } = useSession();
  const { register, handleSubmit } = useForm<ProfileForm>({
    defaultValues: {
      avatar: session?.user.image || undefined,
      name: session?.user.name || undefined,
    },
  });
  const [updateProfile, { loading, data }] = useMutation<ProfileForm>(
    '/api/users/me/profile'
  );

  useEffect(() => {
    if (data) {
      router.push('/new/6');
    }
  }, [data, router]);

  const onSubmit = (data: ProfileForm) => {
    if (loading) return;
    updateProfile(data);
  };

  return (
    <SignupLayout
      progress={500 / 6}
      title="프로필을 설정해주세요."
      subtitle="다른 사용자가 볼 수 있어요."
      onSubmit={handleSubmit(onSubmit)}
      nextText={loading ? '저장 중...' : undefined}
    >
      <Wrapper>
        <Images>
          <ImageWrapper>
            <Input
              type="radio"
              {...register('avatar', { required: true })}
              value={session?.user.image || undefined}
            />
            <UserImage
              src={
                session?.user?.image ? session.user.image : '/images/avatar.png'
              }
              width="80"
              height="80"
              alt="UserImage"
            />
          </ImageWrapper>

          <ImageWrapper>
            <Input
              type="radio"
              {...register('avatar', { required: true })}
              value=""
            />
            <UserImage
              src={'/images/avatar.png'}
              width="80"
              height="80"
              alt="UserImage"
            />
          </ImageWrapper>
        </Images>

        <TextInput
          type="text"
          register={register('name', { required: true })}
          label="닉네임"
          required
        />
      </Wrapper>
    </SignupLayout>
  );
}
