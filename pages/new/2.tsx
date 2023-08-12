import SignupLayout from '@/components/layout/signup-layout';
import styled from '@emotion/styled';
import { Category } from '@prisma/client';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import DraggableCard from '@/components/draggable-card';
import { useEffect, useState } from 'react';
import useMutation from '@/lib/client/useMutation';
import { Reorder } from 'framer-motion';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Numbers = styled.div`
  width: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Number = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-secondary);
  font-weight: 600;
`;

const Buttons = styled(Reorder.Group)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

export default function Subscription() {
  const router = useRouter();
  const { data: userCategories, mutate } = useSWR<number[]>(
    '/api/users/me/categories'
  );
  const { data: categories } = useSWR<Category[]>('/api/categories');
  const [updateCategories, { loading, data }] = useMutation<number[]>(
    '/api/users/me/categories'
  );
  const [ids, setIds] = useState<number[]>([]);

  useEffect(() => {
    if (categories) {
      if (userCategories && userCategories.length === categories.length) {
        setIds(userCategories);
      } else {
        setIds(categories.map(category => category.id));
      }
    }
  }, [categories, userCategories]);

  useEffect(() => {
    if (data) {
      mutate(data);
      router.push('/new/3');
    }
  }, [data, mutate, router]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;
    updateCategories({ categories: ids });
  };

  return (
    <SignupLayout
      progress={200 / 6}
      title="방금 고른 조합이 나에게 꼭 맞는지 알아볼까요?"
      subtitle="콘텐츠 종류를 선호하는 순서대로 나열해주세요."
      onSubmit={onSubmit}
      nextText={loading ? '저장 중...' : undefined}
    >
      <Wrapper>
        <Numbers>
          {categories?.map((_, index) => (
            <Number key={index}>{index + 1}</Number>
          ))}
        </Numbers>
        <Buttons values={ids} onReorder={setIds}>
          {ids.map(id => (
            <DraggableCard key={id} id={id}>
              {categories?.find(ct => ct.id === id)?.name}
            </DraggableCard>
          ))}
        </Buttons>
      </Wrapper>
    </SignupLayout>
  );
}
