import styled from '@emotion/styled';
import { BuiltInProviderType } from 'next-auth/providers';
import { LiteralUnion, signIn } from 'next-auth/react';
import Image from 'next/image';

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
  background-color: var(--background-light);
  overflow: hidden;
  align-content: center;
  flex-wrap: nowrap;
  gap: 16px;
  border-radius: 16px;
  cursor: pointer;
`;

const Logo = styled(Image)`
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  border-radius: 100%;
`;

const Text = styled.h6`
  flex: 1;
  text-align: center;
`;

interface LoginButtonProps {
  provider: LiteralUnion<BuiltInProviderType, string>;
  text: string;
}

export default function LoginButton({ provider, text }: LoginButtonProps) {
  return (
    <Button onClick={() => signIn(provider, { callbackUrl: '/' })}>
      <Logo
        src={`/images/login/${provider}.png`}
        width="24"
        height="24"
        alt="Logo"
        priority
      />
      <Text>{text}</Text>
    </Button>
  );
}
