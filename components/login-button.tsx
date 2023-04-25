import styled from "@emotion/styled";
import { BuiltInProviderType } from "next-auth/providers";
import { LiteralUnion, signIn } from "next-auth/react";
import Image from "next/image";

const Button = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
  align-content: center;
  flex-wrap: nowrap;
  gap: 16px;
  border-radius: 16px;
  cursor: pointer;

  header {
    flex: 1;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }
`;

const Logo = styled(Image)`
  overflow: hidden;
  border-radius: 100%;
`;

interface LoginButtonProps {
  provider: LiteralUnion<BuiltInProviderType, string>;
  text: string;
}

export default function LoginButton({ provider, text }: LoginButtonProps) {
  return (
    <Button onClick={() => signIn(provider, { callbackUrl: "/" })}>
      <Logo src={`/images/${provider}.png`} width="24" height="24" alt="logo" />
      <header>{text}</header>
    </Button>
  );
}
