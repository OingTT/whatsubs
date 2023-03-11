import LoginButton from "@/components/login-button";
import styled from "@emotion/styled";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 800px;
  gap: 80px;
  background-image: url(https://images.unsplash.com/photo-1549226024-48875665c1ea);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const Logo = styled(Image)`
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border-radius: 100%;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [router, session]);

  return (
    <Wrapper>
      <Logo src="/images/whatsubs-dark.png" width="80" height="80" alt="Logo" />
      <Group>
        <LoginButton provider="google" text="Google 계정으로 로그인" />
        <LoginButton provider="naver" text="네이버 아이디로 로그인" />
        <LoginButton provider="kakao" text="카카오 로그인" />
      </Group>
    </Wrapper>
  );
}
