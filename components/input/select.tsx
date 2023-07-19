import styled from '@emotion/styled';
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const Selector = styled.select`
  appearance: none;
  width: 100%;
  height: 56px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
  border-radius: 16px;
  border: none;
  padding: 24px 16px 8px 16px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  font-family: inherit;

  datalist {
    font-size: 32px;
  }
`;

const Label = styled.label`
  position: absolute;
  top: 8px;
  left: 16px;
  color: #999;
  font-weight: bold;
  font-size: 12px;
`;

interface SelectProps {
  register: UseFormRegisterReturn;
  defaultValue?: string;
  label: string;
  required?: boolean;
  children?: React.ReactNode;
}

export default function Select({
  register,
  defaultValue,
  label,
  required,
  children,
}: SelectProps) {
  return (
    <Wrapper>
      <Selector
        id={label}
        {...register}
        defaultValue={defaultValue}
        required={required}
      >
        {children}
      </Selector>
      <Label htmlFor={label}>{label}</Label>
    </Wrapper>
  );
}
