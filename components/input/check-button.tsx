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
  padding: 0px 24px;
  background-color: var(--secondary);
  border-radius: 8px;

  @media (max-width: 809px) {
    height: 36px;
    padding: 0px 20px;
    font-size: 0.875rem; // 14px
  }
`;

const Text = styled.h6`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-weight: 500;

  & > svg {
    width: 1rem; // 16px
    height: 1rem; // 16px
  }

  @media (max-width: 809px) {
    gap: 6px;
    font-size: 0.875rem; // 14px

    & > svg {
      width: 0.875rem; // 14px
      height: 0.875rem; // 14px
    }
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
      <Box>
        <Text>{children}</Text>
      </Box>
    </Wrapper>
  );
}
