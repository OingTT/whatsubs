import styled from '@emotion/styled';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const Wrapper = styled.button<{
  primary?: boolean;
  small?: boolean;
  loading?: boolean;
}>`
  width: ${props => (props.small ? 'auto' : '100%')};
  height: ${props => (props.small ? '40px' : '56px')};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${props =>
    props.primary
      ? props.small
        ? '0px 1px 4px 0px rgba(0, 0, 0, 0.25)'
        : '0px 2px 8px 0px rgba(0, 0, 0, 0.25)'
      : 'none'};
  background-color: var(
    ${props => (props.primary ? '--primary' : '--secondary')}
  );
  padding: ${props => (props.small ? '0 24px' : '0 48px')};
  border-radius: ${props => (props.small ? '8px' : '16px')};
  color: var(${props => (props.primary ? '--text-primary' : '--text')});
  border: none;
  cursor: ${props => (props.loading ? 'not-allowed' : 'pointer')};
`;

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
  primary?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  small?: boolean;
  loading?: boolean;
}

export default function Button({
  onClick,
  children,
  primary,
  type,
  small,
  loading,
}: ButtonProps) {
  return (
    <Wrapper
      type={type}
      onClick={onClick}
      primary={primary}
      small={small}
      loading={loading}
    >
      <h6>{loading ? <Skeleton width={40} /> : children}</h6>
    </Wrapper>
  );
}
