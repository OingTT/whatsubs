import styled from "@emotion/styled";
import WelcomeLayout from "./welcome-layout";
import Button from "./button";
import { useRouter } from "next/router";
import ProgressBar from "./progress-bar";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const Wrapper = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Titles = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.div`
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  font-weight: 600;
  color: #333333;
  font-size: 20px;
  letter-spacing: -0.5px;
  line-height: 1.4;
`;

const Subtitle = styled.div`
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  font-weight: 500;
  color: #999999;
  letter-spacing: -0.5px;
  line-height: 1.4;
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
`;

interface SignupLayoutProps {
  children?: React.ReactNode;
  progress: number;
  title: string;
  subtitle: string;
  nextText?: string;
  nextLink?: string;
  onSubmit?: (data: any) => void;
  onBack?: () => void;
}

export default function SignupLayout({
  children,
  progress,
  title,
  subtitle,
  nextText = "다음",
  nextLink,
  onSubmit = (e) => {
    e.preventDefault();
  },
  onBack,
}: SignupLayoutProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <WelcomeLayout>
      <Wrapper onSubmit={onSubmit}>
        <Header>
          <ProgressBar value={progress} />
          <Titles>
            <Title>{title}</Title>
            <Subtitle>{subtitle}</Subtitle>
          </Titles>
        </Header>
        {children}
        <Buttons>
          <Button onClick={onBack ? onBack : () => router.back()}>이전</Button>
          <Button onClick={() => nextLink && router.push(nextLink)} primary>
            {nextText}
          </Button>
        </Buttons>
      </Wrapper>
    </WelcomeLayout>
  );
}
