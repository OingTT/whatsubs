import SignupLayout from "@/components/signup-layout";
import styled from "@emotion/styled";
import { ContentType, Subscription } from "@prisma/client";
import { useRouter } from "next/router";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import DraggableCard from "@/components/draggable-card";
import { useEffect } from "react";
import useMutation from "@/lib/client/useMutation";

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

interface ContentTypesForm {
  contentTypes: number[];
}

export default function Subscription() {
  const router = useRouter();
  const { data: userContentTypes, mutate } = useSWR<number[]>(
    "/api/user/content-types"
  );
  const { data: contentTypes } = useSWR<ContentType[]>("/api/content-types");
  const { handleSubmit, setValue, watch } = useForm<ContentTypesForm>();
  const [updateContentTypes, { loading, data }] = useMutation<number[]>(
    "/api/user/content-types"
  );

  useEffect(() => {
    if (contentTypes) {
      if (userContentTypes && userContentTypes.length === contentTypes.length) {
        setValue("contentTypes", userContentTypes, { shouldTouch: true });
      } else {
        setValue(
          "contentTypes",
          contentTypes.map((contentType) => contentType.id),
          { shouldTouch: true }
        );
      }
    }
  }, [contentTypes, setValue, userContentTypes]);

  useEffect(() => {
    if (data) {
      console.log(data);
      mutate(data);
      router.push("/new/3");
    }
  }, [data, mutate, router]);

  const onSubmit = (data: ContentTypesForm) => {
    if (loading) return;
    updateContentTypes(data);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newContentTypes = [...watch("contentTypes")];
    const [removed] = newContentTypes.splice(result.source.index, 1);
    newContentTypes.splice(result.destination.index, 0, removed);

    setValue("contentTypes", newContentTypes, { shouldValidate: true });
  };

  return (
    <SignupLayout
      progress={200 / 6}
      title="방금 고른 조합이 나에게 꼭 맞는지 알아볼까요?"
      subtitle="콘텐츠 종류를 선호하는 순서대로 나열해주세요."
      onSubmit={handleSubmit(onSubmit)}
    >
      <Wrapper>
        <Numbers>
          {contentTypes?.map((_, index) => (
            <Number key={index}>{index + 1}</Number>
          ))}
        </Numbers>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="content-types">
            {(provided) => (
              <Buttons {...provided.droppableProps} ref={provided.innerRef}>
                {watch("contentTypes")?.map((contentType, index) => (
                  <DraggableCard
                    key={contentType}
                    draggableId={contentType.toString()}
                    index={index}
                  >
                    {contentTypes?.find((ct) => ct.id === contentType)?.name}
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
