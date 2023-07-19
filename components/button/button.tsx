import styled from '@emotion/styled';
import React from 'react';

const Wrapper = styled.button<{ primary?: boolean }>`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${props =>
    props.primary ? '0px 2px 8px 0px rgba(0, 0, 0, 0.25)' : 'none'};
  background-color: ${props => (props.primary ? '#000' : '#eee')};
  overflow: hidden;
  border-radius: 16px;
  color: ${props => (props.primary ? '#fff' : '#333')};
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  primary?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export default function Button({
  onClick,
  children,
  primary,
  type,
}: ButtonProps) {
  return (
    <Wrapper type={type} onClick={onClick} primary={primary}>
      {children}
    </Wrapper>
  );
}
