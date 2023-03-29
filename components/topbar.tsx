import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";

const Bar = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 32px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  gap: 24px;
  position: fixed;
  top: 0;
`;

const Nav = styled(Link)`
  color: #666;
  font-weight: 400;
`;

const Spacer = styled.div`
  flex: 1;
`;

const User = styled(Image)`
  background-color: #333333;
  border-radius: 100%;
`;

export default function Topbar() {
  return (
    <Bar>
      <Link href="/">
        <Image
          src={`/images/whatsubs-small.png`}
          width="24"
          height="24"
          alt="Logo"
        />
      </Link>

      <Nav href="/review">평가하기</Nav>

      <Spacer />

      <Link href="/search">
        <MagnifyingGlass color="#333" size="24" />
      </Link>
      <Link href="/user">
        <User
          src="/images/whatsubs-dark.png"
          width="32"
          height="32"
          alt="User"
        />
      </Link>
    </Bar>
  );
}
