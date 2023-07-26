import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlass } from '@phosphor-icons/react';
import useUser from '@/lib/client/useUser';
import NavLink from './nav-link';
import { Spacer } from '@/lib/client/style';

const Wrapper = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 32px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  background-color: var(--background-light);
  gap: 24px;
  position: fixed;
  top: 0;
  z-index: 100;

  @media (max-width: 809px) {
    padding: 24px;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  }
`;

const Logo = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 24px;

  @media (prefers-color-scheme: dark) {
    filter: invert(1);
  }
`;

const User = styled(Image)`
  border-radius: 100%;
`;

export default function Topbar() {
  const user = useUser();

  return (
    <Wrapper>
      <Link href="/">
        <Logo>
          <Image
            src="/images/logo/whatsubs.png"
            width="48"
            height="48"
            alt="Logo"
            priority
          />
        </Logo>
      </Link>

      <NavLink href="/explore">탐색</NavLink>
      <NavLink href="/chart">차트</NavLink>

      <Spacer />

      <Link href="/search">
        <MagnifyingGlass size="24" />
      </Link>
      <Link href="/setting">
        <User
          src={user?.avatar || '/images/avatar.png'}
          width="32"
          height="32"
          alt="User"
          priority
          unoptimized
        />
      </Link>
    </Wrapper>
  );
}
