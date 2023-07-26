import styled from '@emotion/styled';
import { Check } from '@phosphor-icons/react';
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  user-select: none;
`;

const Input = styled.input`
  display: none;

  &:checked ~ label div {
    background-color: var(--primary);
    color: var(--text-primary);
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const Box = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: var(--secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  color: transparent;
`;

interface RadioProps {
  register: UseFormRegisterReturn;
  children: React.ReactNode;
  required?: boolean;
}

export default function Radio({ register, children, required }: RadioProps) {
  return (
    <Wrapper>
      <Input
        id={register.name}
        type="checkbox"
        {...register}
        required={required}
        onKeyDown={(
          e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          e.key === 'Enter' && e.preventDefault();
        }}
      />
      <Label htmlFor={register.name}>
        <Box>
          <Check size={16} weight="bold" />
        </Box>
        {children}
      </Label>
    </Wrapper>
  );
}
