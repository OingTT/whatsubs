import styled from "@emotion/styled";
import React from "react";

const Wrapper = styled.div`
  width: 100%;
  height: 12px;
  display: flex;
  justify-content: flex-start;
  background-color: #eeeeee;
  border-radius: 6px;
`;

const Progress = styled.div<{ value: number }>`
  width: ${(props) => props.value}%;
  height: 100%;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
  background-color: #000000;
  border-radius: 6px;
`;

interface ProgressBarProps {
  value?: number;
}

export default function ProgressBar({ value = 50 }: ProgressBarProps) {
  return (
    <Wrapper>
      <Progress value={value} />
    </Wrapper>
  );
}
