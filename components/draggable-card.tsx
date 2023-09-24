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
  margin: 8px 0px;
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
  value: number;
  children?: React.ReactNode;
}

export default function DraggableCard({ value, children }: DraggableCardProps) {
  return (
    <Wrapper value={value}>
      <Text>{children}</Text>
      <IconGripHorizontal stroke={1.5} />
    </Wrapper>
  );
}
