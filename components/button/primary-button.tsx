import styled from "@emotion/styled";
import React from "react";

const Button = styled.button`
  width: 288px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.25);
  background-color: #000000;
  overflow: hidden;
  border-radius: 16px;
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  border: none;
  cursor: pointer;
`;

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}

export default function PrimaryButton({ onClick, children }: ButtonProps) {
  return <Button onClick={onClick}>{children}</Button>;
}
