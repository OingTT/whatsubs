import styled from '@emotion/styled';
import { IconStarFilled } from '@tabler/icons-react';

const StarIcon = styled(IconStarFilled)<{ enabled?: boolean }>`
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
  return <StarIcon size={size} enabled={fill} onClick={onClick} />;
}
