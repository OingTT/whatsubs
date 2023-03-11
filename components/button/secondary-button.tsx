import styled from "@emotion/styled";
import React from "react";

const Button = styled.button`
  width: 288px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  overflow: hidden;
  border-radius: 16px;
  color: #333;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}

export default function SecondaryButton({ onClick, children }: ButtonProps) {
  return <Button onClick={onClick}>{children}</Button>;
}
