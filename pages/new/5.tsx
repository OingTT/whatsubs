import TextInput from "@/components/input/text-input";
import SignupLayout from "@/components/signup-layout";
import styled from "@emotion/styled";
import { PencilSimple } from "@phosphor-icons/react";
import { GetServerSidePropsContext } from "next";
import { Session, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { authOptions } from "../api/auth/[...nextauth]";
import useMutation from "@/lib/client/useMutation";
import { useEffect } from "react";

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

const EditButton = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  background-color: rgba(232, 232, 232, 0.75);
  position: absolute;
  border-radius: 16px;
  bottom: 0;
  right: 0;
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: { session: JSON.parse(JSON.stringify(session)) },
  };
}

export default function Profile() {
  const router = useRouter();
  const { data: session } = useSession();
  const { register, handleSubmit } = useForm<ProfileForm>({
    defaultValues: {
      avatar: session?.user.image || undefined,
      name: session?.user.name || undefined,
    },
  });
  const [updateProfile, { loading, data }] =
    useMutation<ProfileForm>("/api/user/profile");

  useEffect(() => {
    if (data) {
      router.push("/new/6");
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
    >
      <Wrapper>
        <Images>
          <ImageWrapper>
            <Input
              type="radio"
              {...register("avatar", { required: true })}
              value={session?.user.image || undefined}
            />
            <UserImage
              src={
                session?.user?.image ? session.user.image : "/images/avatar.png"
              }
              width="80"
              height="80"
              alt="UserImage"
            />
            {/* <EditButton>
              <PencilSimple color="#333" />
            </EditButton> */}
          </ImageWrapper>

          <ImageWrapper>
            <Input
              type="radio"
              {...register("avatar", { required: true })}
              value=""
            />
            <UserImage
              src={"/images/avatar.png"}
              width="80"
              height="80"
              alt="UserImage"
            />
          </ImageWrapper>
        </Images>

        <TextInput
          type="text"
          register={register("name", { required: true })}
          label="닉네임"
          required
        />
      </Wrapper>
    </SignupLayout>
  );
}