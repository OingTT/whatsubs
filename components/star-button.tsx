import styled from '@emotion/styled';
import { Star } from '@phosphor-icons/react';

const StarIcon = styled(Star)<{ enabled?: boolean }>`
  color: var(${({ enabled }) => (enabled ? '--warning' : '--secondary')});
  cursor: pointer;
`;

interface StarButtonProps {
  size?: number;
  fill?: boolean;
  onClick?: () => void;
}

export default function StarButton({
  size = 24,
  fill,
  onClick,
}: StarButtonProps) {
  return (
    <StarIcon size={size} weight="fill" enabled={fill} onClick={onClick} />
  );
}
