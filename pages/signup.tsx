import PrimaryButton from "@/components/button/primary-button";
import SecondaryButton from "@/components/button/secondary-button";
import TextInput from "@/components/input/text-input";
import Radio from "@/components/input/radio";
import useMutation from "@/lib/client/useMutation";
import styled from "@emotion/styled";
import { PencilSimple } from "@phosphor-icons/react";
import { Occupation, User } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import Select from "@/components/input/select";

const occupations = [
  "기타",
  "교육자",
  "예술가",
  "사무직",
  "대학(원)생",
  "서비스직",
  "의료직",
  "경영자",
  "농업",
  "건축가",
  "초/중/고등학생",
  "변호사",
  "개발자",
  "은퇴",
  "영업직",
  "과학자",
  "자영업자",
  "공학자",
  "수공업자",
  "미취업자/주부",
  "작가",
];

const Wrapper = styled.form`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 800px;
  gap: 64px;
  background-image: url(https://images.unsplash.com/photo-1549226024-48875665c1ea);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const ImageWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const UserImage = styled(Image)`
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border-radius: 100%;
  background-color: #000;
`;

const EditButton = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  position: absolute;
  border-radius: 100%;
  bottom: 0;
  right: 0;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Hint = styled.span`
  font-weight: bold;
  font-size: 12px;
  color: #fff;
`;

interface SignupForm {
  name: string;
  birth: Date;
  occupation: string;
  gender: "M" | "F";
}

export default function Signup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { register, handleSubmit } = useForm<SignupForm>();
  const [signup, { loading, data, error }] =
    useMutation<User>("/api/user/signup");
  const { data: user, mutate } = useSWR<User>("/api/user");

  // Check login
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace("/login");
    }
  }, [router, session, status]);

  // Check signup
  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [router, user]);

  useEffect(() => {
    if (data) {
      mutate(data);
    }
  }, [data, mutate]);

  const onValid = (data: SignupForm) => {
    if (loading) return;

    signup(data);
  };

  const onCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    signOut({ callbackUrl: "/login" });
  };

  return (
    <Wrapper onSubmit={handleSubmit(onValid)}>
      <ImageWrapper>
        <UserImage
          src={
            session?.user?.image
              ? session.user.image
              : "/images/whatsubs-dark.png"
          }
          width="80"
          height="80"
          alt="UserImage"
        />
        {/* <EditButton>
          <PencilSimple color="#333" weight="bold" />
        </EditButton> */}
      </ImageWrapper>

      <Group>
        <TextInput
          type="text"
          register={register("name", { required: true })}
          defaultValue={session?.user?.name!}
          label="닉네임"
          required
        />
        <TextInput
          type="date"
          register={register("birth", { required: true, valueAsDate: true })}
          label="생년월일"
          required
        />
        <Select
          register={register("occupation", { required: true })}
          label="직업"
          required
        >
          {Object.keys(Occupation).map((occupation, index) => (
            <option key={index} value={occupation}>
              {occupations[index]}
            </option>
          ))}
        </Select>
        <Radio
          register={register("gender", { required: true })}
          ids={["M", "F"]}
          labels={["남", "여"]}
          required
        />
      </Group>

      <Group>
        <SecondaryButton onClick={onCancel}>취소</SecondaryButton>
        <PrimaryButton>{loading ? "가입 중..." : "가입하기"}</PrimaryButton>
        <Hint>개인정보는 보다 정확한 콘텐츠 추천을 위해 수집해요.</Hint>
      </Group>
    </Wrapper>
  );
}
