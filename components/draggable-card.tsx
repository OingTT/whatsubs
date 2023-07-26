import styled from '@emotion/styled';
import { Draggable } from '@hello-pangea/dnd';
import { List } from '@phosphor-icons/react';
import React from 'react';

const Wrapper = styled.div`
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
  draggableId: string;
  index: number;
  children?: React.ReactNode;
}

export default React.memo(function DraggableCard({
  draggableId,
  index,
  children,
}: DraggableCardProps) {
  return (
    <Draggable draggableId={draggableId} index={index}>
      {provided => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Text>{children}</Text>
          <List size={24} />
        </Wrapper>
      )}
    </Draggable>
  );
});
