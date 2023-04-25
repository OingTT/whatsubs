import styled from "@emotion/styled";
import Topbar from "./topbar";

const Wrapper = styled.div<{ fit?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: ${(props) => (props.fit ? "64px 0px 0px 0px" : "72px 0px 0px 0px")};
  gap: 8px;
`;

interface LayoutProps {
  fit?: boolean;
  children?: React.ReactNode;
}

export default function Layout({ fit, children }: LayoutProps) {
  return (
    <Wrapper fit={fit}>
      <Topbar />
      {children}
    </Wrapper>
  );
}
