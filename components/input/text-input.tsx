import styled from "@emotion/styled";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const Input = styled.input`
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
`;

const Label = styled.label`
  position: absolute;
  top: 8px;
  left: 16px;
  color: #999;
  font-weight: bold;
  font-size: 12px;
`;

interface TextInputProps {
  type: React.HTMLInputTypeAttribute;
  register: UseFormRegisterReturn;
  label: string;
  required?: boolean;
}

export default function TextInput({
  type,
  register,
  label,
  required,
}: TextInputProps) {
  return (
    <Wrapper>
      <Input
        id={label}
        type={type}
        {...register}
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
