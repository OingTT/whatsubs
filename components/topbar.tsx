import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";

const Bar = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 64px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 32px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
  align-content: center;
  position: absolute;
`;

const Logo = styled(Image)`
  flex-shrink: 0;
  display: block;
  overflow: visible;
  position: relative;
  aspect-ratio: 1 / 1;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 24px;
  margin-right: 32px;
`;

const About = styled.div`
  flex-shrink: 0;
  width: fit-content; /* 46px */
  height: auto; /* 32px */
  white-space: pre;
  overflow: visible;
  position: relative;
  line-height: 1.2;
  margin-right: 32px;
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
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
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
  margin-left: 32px;
  margin-right: 0;
`;

export default function Topbar() {
  return (
    <Bar>
      <Link href={"/"} passHref>
        <Logo
          src={`/images/whatsubs-small.png`}
          width="32"
          height="32"
          alt="logo"
        />
      </Link>
      <Link href={"/"} passHref>
        <About>About</About>
      </Link>
      <Link href={"/login"} passHref>
        <Login>Login</Login>
      </Link>

      <Columns></Columns>

      <Link href={"/"} passHref>
        <MagnifyingGlass size={32}></MagnifyingGlass>
      </Link>
      <Link href={"/"} passHref>
        <User />
      </Link>
    </Bar>
  );
}
