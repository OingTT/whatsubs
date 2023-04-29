import Button from "@/components/button";
import SignupLayout from "@/components/signup-layout";
import styled from "@emotion/styled";
import { ContentType, Subscription } from "@prisma/client";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useSWR from "swr";

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
  gap: 16px;
`;

interface ContentTypesForm {
  contentTypes: string[];
}

export default function Subscription() {
  const router = useRouter();
  const { data } = useSWR<ContentType[]>("/api/content-types");
  const { register, handleSubmit } = useForm<ContentTypesForm>({});

  const onSubmit = (data: ContentTypesForm) => {
    router.push("/new/3");
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
          {data?.map((_, index) => (
            <Number key={index}>{index + 1}</Number>
          ))}
        </Numbers>
        <Buttons>
          {data?.map((contentType) => (
            <Button key={contentType.id}>{contentType.name}</Button>
          ))}
        </Buttons>
      </Wrapper>
    </SignupLayout>
  );
}
