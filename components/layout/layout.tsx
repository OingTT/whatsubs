import styled from '@emotion/styled';
import Topbar from '../topbar';
import Head from 'next/head';

const Wrapper = styled.div<{ fit?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: ${props => (props.fit ? '64px 0px 0px 0px' : '72px 0px 0px 0px')};
`;

interface LayoutProps {
  title?: string;
  fit?: boolean;
  children?: React.ReactNode;
}

export default function Layout({ title, fit, children }: LayoutProps) {
  return (
    <Wrapper fit={fit}>
      <Head>
        <title>{title ? `${title} - Whatsubs` : 'Whatsubs'}</title>
      </Head>
      <Topbar />
      {children}
    </Wrapper>
  );
}
