import styled from "@emotion/styled";
import React from "react";

const Wrapper = styled.div<{ size: number }>`
  width: 2px;
  border-radius: 1px;
  height: ${(props) => props.size}px;
  background-color: #999;
`;

interface VerticalBarProps {
  size: number;
}

export default function VerticalBar({ size }: VerticalBarProps) {
  return <Wrapper size={size} />;
}
