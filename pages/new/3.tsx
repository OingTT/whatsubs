import CheckButton from '@/components/input/check-button';
import SignupLayout from '@/components/layout/signup-layout';
import useMutation from '@/lib/client/useMutation';
import styled from '@emotion/styled';
import { Genre } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const Genre = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 24px 0px 24px;
  background-color: var(--secondary);
  border-radius: 8px;
  font-weight: 500;

  @media (max-width: 809px) {
    height: 32px;
    padding: 0px 16px 0px 16px;
    font-size: 0.875rem; // 14px
  }
`;

interface GenresForm {
  genres: string[];
}

export default function Genres() {
  const router = useRouter();
  const { data: userGenres, mutate } = useSWR<string[]>('/api/users/me/genres');
  const { data: genres } = useSWR<Genre[]>('/api/genres');
  const { register, handleSubmit, setValue } = useForm<GenresForm>();
  const [updateGenres, { loading, data }] = useMutation<string[]>(
    '/api/users/me/genres'
  );

  useEffect(() => {
    if (userGenres) {
      setValue('genres', userGenres);
    }
  }, [setValue, userGenres]);

  useEffect(() => {
    if (data) {
      mutate(data);
      router.push('/new/4');
    }
  }, [data, mutate, router]);

  const onSubmit = (data: GenresForm) => {
    if (loading) return;
    updateGenres(data);
  };

  return (
    <SignupLayout
      progress={300 / 6}
      title="방금 고른 조합이 나에게 꼭 맞는지 알아볼까요?"
      subtitle="선호하는 장르를 선택해주세요."
      onSubmit={handleSubmit(onSubmit)}
      nextText={loading ? '저장 중...' : undefined}
    >
      <Wrapper>
        {genres?.map(genre => (
          <CheckButton
            key={genre.id}
            register={register('genres')}
            id={genre.id}
          >
            {genre.name}
          </CheckButton>
        ))}
      </Wrapper>
    </SignupLayout>
  );
}
