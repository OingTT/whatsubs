import { Caption } from '@/lib/client/style';
import styled from '@emotion/styled';
import {
  IconAlertHexagonFilled,
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconInfoCircleFilled,
} from '@tabler/icons-react';

type AlertType = 'success' | 'danger' | 'warning' | 'info';

const Wrapper = styled.div<{ type: AlertType }>`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  background-color: var(
    ${props =>
      props.type === 'success'
        ? '--success'
        : props.type === 'danger'
        ? '--danger'
        : props.type === 'warning'
        ? '--warning'
        : '--info'}-light
  );
  overflow: auto;
  gap: 12px;
  border-radius: 16px;

  & > svg {
    min-width: 32px;
    color: var(
      ${props =>
        props.type === 'success'
          ? '--success'
          : props.type === 'danger'
          ? '--danger'
          : props.type === 'warning'
          ? '--warning'
          : '--info'}
    );
  }
`;

interface AlertProps {
  type: AlertType;
  children?: React.ReactNode;
}

export default function Alert({ type, children }: AlertProps) {
  return (
    <Wrapper type={type}>
      {type === 'success' && <IconCircleCheckFilled size={32} />}
      {type === 'danger' && <IconAlertHexagonFilled size={32} />}
      {type === 'warning' && <IconAlertTriangleFilled size={32} />}
      {type === 'info' && <IconInfoCircleFilled size={32} />}

      <Caption>{children}</Caption>
    </Wrapper>
  );
}
