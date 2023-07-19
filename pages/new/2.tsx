import SignupLayout from '@/components/layout/signup-layout';
import styled from '@emotion/styled';
import { Category, Subscription } from '@prisma/client';
import { useRouter } from 'next/router';
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import DraggableCard from '@/components/draggable-card';
import { useEffect } from 'react';
import useMutation from '@/lib/client/useMutation';

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
  color: #bbbbbb;
  font-weight: 600;
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

interface CategoriesForm {
  categories: number[];
}

export default function Subscription() {
  const router = useRouter();
  const { data: userCategories, mutate } = useSWR<number[]>(
    '/api/user/categories'
  );
  const { data: categories } = useSWR<Category[]>('/api/categories');
  const { handleSubmit, setValue, watch } = useForm<CategoriesForm>();
  const [updateCategories, { loading, data }] = useMutation<number[]>(
    '/api/user/categories'
  );

  useEffect(() => {
    if (categories) {
      if (userCategories && userCategories.length === categories.length) {
        setValue('categories', userCategories, { shouldTouch: true });
      } else {
        setValue(
          'categories',
          categories.map(category => category.id),
          { shouldTouch: true }
        );
      }
    }
  }, [categories, setValue, userCategories]);

  useEffect(() => {
    if (data) {
      console.log(data);
      mutate(data);
      router.push('/new/3');
    }
  }, [data, mutate, router]);

  const onSubmit = (data: CategoriesForm) => {
    if (loading) return;
    updateCategories(data);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newCategories = [...watch('categories')];
    const [removed] = newCategories.splice(result.source.index, 1);
    newCategories.splice(result.destination.index, 0, removed);

    setValue('categories', newCategories, { shouldValidate: true });
  };

  return (
    <SignupLayout
      progress={200 / 6}
      title="방금 고른 조합이 나에게 꼭 맞는지 알아볼까요?"
      subtitle="콘텐츠 종류를 선호하는 순서대로 나열해주세요."
      onSubmit={handleSubmit(onSubmit)}
      nextText={loading ? '저장 중...' : undefined}
    >
      <Wrapper>
        <Numbers>
          {categories?.map((_, index) => (
            <Number key={index}>{index + 1}</Number>
          ))}
        </Numbers>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories">
            {provided => (
              <Buttons {...provided.droppableProps} ref={provided.innerRef}>
                {watch('categories')?.map((category, index) => (
                  <DraggableCard
                    key={category}
                    draggableId={category.toString()}
                    index={index}
                  >
                    {categories?.find(ct => ct.id === category)?.name}
                  </DraggableCard>
                ))}
                {provided.placeholder}
              </Buttons>
            )}
          </Droppable>
        </DragDropContext>
      </Wrapper>
    </SignupLayout>
  );
}
