import styled from '@emotion/styled';
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

const Wrapper = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: var(--background-light);
  gap: 8px;
  border-radius: 16px;
  user-select: none;
`;

const Input = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;

  &:checked ~ label {
    background-color: var(--secondary);
    color: var(--text);
  }
`;

const Label = styled.label`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
`;

const Button = styled.div`
  width: 100%;
  height: 100%;
`;

interface RadioProps {
  register: UseFormRegisterReturn;
  defaultValue?: string;
  labels?: string[];
  ids: string[];
  required?: boolean;
}

export default function Radio({
  register,
  defaultValue,
  labels,
  ids,
  required,
}: RadioProps) {
  return (
    <Wrapper>
      {ids.map((id, index) => (
        <Button key={index}>
          <Input
            id={id}
            value={id}
            type="radio"
            {...register}
            defaultValue={defaultValue}
            required={required}
            onKeyDown={(
              e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              e.key === 'Enter' && e.preventDefault();
            }}
          />
          <Label htmlFor={id}>
            <h6>{labels ? labels[index] : id}</h6>
          </Label>
        </Button>
      ))}
    </Wrapper>
  );
}
