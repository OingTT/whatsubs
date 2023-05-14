import styled from "@emotion/styled";
import { Warning } from "@phosphor-icons/react";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  background-color: #ffeecc;
  overflow: auto;
  gap: 12px;
  border-radius: 16px;
  font-size: 14px;

  & > svg {
    min-width: 32px;
  }
`;

interface AlertForm {
  children?: React.ReactNode;
}

export default function Alert({ children }: AlertForm) {
  return (
    <Wrapper>
      <Warning size={32} color="#ffcc66" weight="fill" />
      {children}
    </Wrapper>
  );
}
