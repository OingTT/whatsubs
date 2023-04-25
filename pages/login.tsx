import LoginButton from "@/components/login-button";
import styled from "@emotion/styled";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import SignupLayout from "@/components/welcome-layout";
import Image from "next/image";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 120px;
`;

const Logo = styled(Image)`
  @media (max-width: 1199px) {
    display: none;
  }
`;

const FullLogo = styled(Image)`
  @media (min-width: 1200px) {
    display: none;
  }
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// Prevent user from accessing login page if they are already logged in
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [router, session]);

  return (
    <SignupLayout>
      <Wrapper>
        <Logo
          src="/images/whatsubs-small.png"
          width="48"
          height="48"
          alt="Logo"
          priority
        />
        <FullLogo
          src="/images/whatsubs-full-dark.png"
          width="191"
          height="64"
          alt="FullLogo"
          priority
        />
        <Buttons>
          <LoginButton provider="google" text="Google 계정으로 로그인" />
          <LoginButton provider="naver" text="네이버 아이디로 로그인" />
          <LoginButton provider="kakao" text="카카오 로그인" />
        </Buttons>
      </Wrapper>
    </SignupLayout>
  );
}
