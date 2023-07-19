import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Wrapper = styled(Link)<{ selected: boolean }>`
  color: ${props => (props.selected ? '#333333' : '#999999')};
`;

interface NavProps {
  href: string;
  children: React.ReactNode;
}

export default function Nav({ href, children }: NavProps) {
  const router = useRouter();

  return (
    <Wrapper href={href} selected={href === router.pathname}>
      {children}
    </Wrapper>
  );
}
