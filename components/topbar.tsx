import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import useUser from "@/lib/client/useUser";
import Nav from "./nav";

const Wrapper = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 32px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  gap: 24px;
  position: fixed;
  top: 0;
  z-index: 100;

  @media (max-width: 809px) {
    padding: 24px;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const User = styled(Image)`
  border-radius: 100%;
`;

export default function Topbar() {
  const user = useUser();

  return (
    <Wrapper>
      <Link href="/">
        <Image
          src="/images/whatsubs-small.png"
          width="24"
          height="24"
          alt="Logo"
          priority
        />
      </Link>

      <Nav href="/explore">탐색</Nav>
      <Nav href="/chart">차트</Nav>

      <Spacer />

      <Link href="/search">
        <MagnifyingGlass color="#333" size="24" />
      </Link>
      <Link href="/user">
        <User
          src={user?.avatar || "/images/avatar.png"}
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
