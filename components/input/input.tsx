import styled from "@emotion/styled";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

const Wrapper = styled.div`
  position: relative;
`;

const Inp = styled.input`
  width: 288px;
  height: 56px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
  border-radius: 16px;
  border: none;
  padding: 24px 16px 8px 16px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
`;

const Label = styled.label`
  position: absolute;
  top: 8px;
  left: 16px;
  color: #999;
  font-weight: 600;
  font-size: 12px;
`;

interface TextInputProps {
  type: React.HTMLInputTypeAttribute;
  register: UseFormRegisterReturn;
  defaultValue?: string;
  label: string;
  required?: boolean;
}

export default function Input({
  type,
  register,
  defaultValue,
  label,
  required,
}: TextInputProps) {
  return (
    <Wrapper>
      <Inp
        id={label}
        type={type}
        {...register}
        defaultValue={defaultValue}
        required={required}
        onKeyDown={(
          e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
          e.key === "Enter" && e.preventDefault();
        }}
      />
      <Label htmlFor={label}>{label}</Label>
    </Wrapper>
  );
}
