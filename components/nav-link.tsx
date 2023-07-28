import styled from '@emotion/styled';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Wrapper = styled(Link)<{ selected: boolean }>`
  color: ${props => (props.selected ? 'inherit' : 'var(--text-secondary)')};
`;

const Text = styled.h6`
  font-weight: 400;
`;

interface NavProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavProps) {
  const router = useRouter();

  return (
    <Wrapper href={href} selected={href === router.pathname}>
      <Text>{children}</Text>
    </Wrapper>
  );
}
