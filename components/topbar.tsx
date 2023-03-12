import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";

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
  margin-left: auto;
`;

const Columns = styled.div`
  flex-shrink: 0;
  flex: 1 0 0px;
  width: 1px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: visible;
  position: relative;
  padding: 0px 0px 0px 0px;
  align-content: center;
  flex-wrap: nowrap;
  gap: 10;
  border-radius: 0px 0px 0px 0px;
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
  margin-right: 0;
`;

export default function Topbar() {
  return (
    <Bar>
      <Link href={"/"}>
        <Logo
          src={`/images/whatsubs-small.png`}
          width="24"
          height="24"
          alt="logo"
        />
      </Link>
      <Link href={"/"}>
        <About>About</About>
      </Link>
      <Link href={"/login"}>
        <Login>Login</Login>
      </Link>

      <Columns></Columns>

      <Link href={"/"}>
        <Search
          src={`/images/search.png`}
          width="24"
          height="24"
          alt="search"
        />
      </Link>
      <Link href={"/"}>
        <User />
      </Link>
    </Bar>
  );
}
