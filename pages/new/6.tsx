import Radio from "@/components/input/radio";
import Select from "@/components/input/select";
import TextInput from "@/components/input/text-input";
import SignupLayout from "@/components/signup-layout";
import styled from "@emotion/styled";
import { Occupation } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { authOptions } from "../api/auth/[...nextauth]";
import useMutation from "@/lib/client/useMutation";
import { useEffect } from "react";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

interface PrivacyForm {
  birth: Date;
  occupation: number;
  gender: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: { session },
  };
}

export default function Privacy() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { data: occupation } = useSWR<Occupation[]>("/api/occupations");
  const { register, handleSubmit } = useForm<PrivacyForm>({
    defaultValues: {
      birth: session?.user.birth || undefined,
      occupation: session?.user.occupationId || undefined,
      gender: session?.user.gender || undefined,
    },
  });
  const [updatePrivacy, { loading, data }] =
    useMutation<PrivacyForm>("/api/user/privacy");

  useEffect(() => {
    if (data) {
      update();
      router.push("/");
    }
  }, [data, router, update]);

  const onSubmit = (data: PrivacyForm) => {
    if (loading) return;
    updatePrivacy(data);
  };

  return (
    <SignupLayout
      progress={600 / 6}
      title="마지막으로 사용자 정보를 입력해주세요."
      subtitle="꼭 맞는 추천을 위해 수집하며, 외부에 공개되지 않아요."
      onSubmit={handleSubmit(onSubmit)}
      nextText="🎉 가입하기"
    >
      <Wrapper>
        <TextInput
          type="date"
          register={register("birth", { required: true, valueAsDate: true })}
          label="생년월일"
          required
        />
        <Select
          register={register("occupation", {
            required: true,
            valueAsNumber: true,
          })}
          label="직업"
          required
        >
          {occupation?.map((occupation) => (
            <option key={occupation.id} value={occupation.id}>
              {occupation.name}
            </option>
          ))}
        </Select>
        <Radio
          register={register("gender", { required: true })}
          ids={["M", "F"]}
          labels={["남", "여"]}
          required
        />
      </Wrapper>
    </SignupLayout>
  );
}
