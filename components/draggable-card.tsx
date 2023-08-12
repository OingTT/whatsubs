import styled from '@emotion/styled';
import { IconGripHorizontal } from '@tabler/icons-react';
import React from 'react';
import { Reorder } from 'framer-motion';

const Wrapper = styled(Reorder.Item)`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: var(--secondary);
  gap: 8px;
  border-radius: 16px;
  margin-top: 8px;
  margin-bottom: 8px;

  cursor: grab;

  & > svg {
    color: var(--text-secondary);
  }
`;

const Text = styled.h6`
  width: 100%;
  text-align: center;
`;

interface DraggableCardProps {
  children?: React.ReactNode;
  id: number;
}

export default React.memo(function DraggableCard({
  children,
  id,
}: DraggableCardProps) {
  return (
    <Wrapper value={id}>
      <Text>{children}</Text>
      <IconGripHorizontal stroke={1.5} />
    </Wrapper>
  );
});
