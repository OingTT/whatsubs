import styled from "@emotion/styled";
import Image from "next/image";

const Bar = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 32px 32px 32px 32px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
  align-content: center;
  flex-wrap: nowrap;
  gap: 24;
  position: absolute;
  border-radius: 0px 0px 0px 0px;
`;

const Logo = styled(Image)`
  flex-shrink: 0;
  display: block;
  overflow: visible;
  position: relative;
  aspect-ratio: 1 / 1;
  background-image: url(Frame 29.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 24px;
  margin-right: 16px;
`;

const About = styled.div`
  flex-shrink: 0;
  width: fit-content; /* 46px */
  height: auto; /* 32px */
  white-space: pre;
  overflow: visible;
  position: relative;
  line-height: 1.2;
  margin-right: 16px;
`;

const Login = styled.div`
  flex-shrink: 0;
  width: fit-content; /* 41px */
  height: auto; /* 32px */
  white-space: pre;
  overflow: visible;
  position: relative;
  line-height: 1.2;
  margin-right: auto;
`;

const Search = styled(Image)`
  flex-shrink: 0;
  display: block;
  overflow: visible;
  position: relative;
  aspect-ratio: 1 / 1;
  background-image: url(Frame 29.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 24px;
  margin-left: auto;
  filter: grayscale(100%);
`;

const User = styled.div`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: block;
  background-color: #333333;
  overflow: visible;
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  margin-left: 16px;
`;

export default function Topbar() {
  return (
    <Bar>
      <Logo
        src={`/images/whatsubs-small.png`}
        width="24"
        height="24"
        alt="logo"
      />
      <About>About</About>
      <Login>Login</Login>
      <Search src={`/images/search.png`} width="24" height="24" alt="search" />
      <User />
    </Bar>
  );
}
