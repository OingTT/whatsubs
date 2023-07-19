import { Caption } from '@/lib/client/style';
import styled from '@emotion/styled';
import { Info, Warning, WarningOctagon } from '@phosphor-icons/react';

type AlertType = 'warning' | 'error' | 'info';

const Wrapper = styled.div<{ type: AlertType }>`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  background-color: ${props =>
    props.type === 'warning'
      ? '#fec'
      : props.type === 'error'
      ? '#fcc'
      : '#cef'};
  overflow: auto;
  gap: 12px;
  border-radius: 16px;

  & > svg {
    min-width: 32px;
  }
`;

interface AlertProps {
  type: AlertType;
  children?: React.ReactNode;
}

export default function Alert({ type, children }: AlertProps) {
  return (
    <Wrapper type={type}>
      {type === 'warning' && <Warning size={32} color="#fa0" weight="fill" />}
      {type === 'error' && (
        <WarningOctagon size={32} color="#f33" weight="fill" />
      )}
      {type === 'info' && <Info size={32} color="#0af" weight="fill" />}

      <Caption>{children}</Caption>
    </Wrapper>
  );
}
