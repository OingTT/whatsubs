import styled from '@emotion/styled';
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

const Wrapper = styled.label`
  cursor: pointer;
  user-select: none;
`;

const Input = styled.input`
  display: none;

  &:checked ~ div {
    background-color: var(--primary);
    color: var(--text-primary);
  }
`;

const Box = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 24px 0px 24px;
  background-color: var(--secondary);
  border-radius: 8px;
  font-weight: 500;

  @media (max-width: 809px) {
    height: 32px;
    padding: 0px 16px 0px 16px;
    font-size: 0.875rem; // 14px
  }
`;

interface CheckButtonProps {
  id: string | number;
  register: UseFormRegisterReturn;
  children?: React.ReactNode;
}

export default function CheckButton({
  id,
  children,
  register,
}: CheckButtonProps) {
  return (
    <Wrapper htmlFor={register.name + id}>
      <Input type="checkbox" id={register.name + id} {...register} value={id} />
      <Box>{children}</Box>
    </Wrapper>
  );
}
