import styled from "@emotion/styled";
import Image from "next/image";

const Wrapper = styled.div`
  width: 100vw;
  height: 100dvh;
  display: flex;
  background-image: url(https://images.unsplash.com/photo-1549226024-48875665c1ea);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  @media (min-width: 810px) {
    min-height: 800px;
  }
`;

const Dimmer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Right = styled.div`
  flex: 1;
  width: 1fr;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Left = styled(Right)`
  @media (max-width: 1199px) {
    display: none;
  }
`;

const Content = styled.div`
  width: 480px;
  height: 640px;
  display: flex;
  padding: 24px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border-radius: 16px;

  @media (max-width: 809px) {
    width: 100%;
    height: 100%;
    border-radius: 0;
  }
`;

interface WelcomeLayoutProps {
  children?: React.ReactNode;
}

export default function WelcomeLayout({ children }: WelcomeLayoutProps) {
  return (
    <Wrapper>
      <Dimmer>
        <Left>
          <Image
            src="/images/whatsubs-full-light.png"
            width="191"
            height="64"
            alt="FullLogo"
            priority
          />
        </Left>
        <Right>
          <Content>{children}</Content>
        </Right>
      </Dimmer>
    </Wrapper>
  );
}
