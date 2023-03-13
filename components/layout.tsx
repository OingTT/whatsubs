import styled from "@emotion/styled";
import Topbar from "./topbar";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 72px 0px 0px 0px;
  gap: 8px;
`;

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Wrapper>
      <Topbar />
      {children}
    </Wrapper>
  );
}
