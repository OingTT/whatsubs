import styled from '@emotion/styled';
import { Variants, motion } from 'framer-motion';

const Wrapper = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--secondary);
`;

const placeholderVariants: Variants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 0,
  },
};

interface PlaceholderProps {
  isLoaded: boolean;
  children?: React.ReactNode;
}

export default function Placeholder({ isLoaded, children }: PlaceholderProps) {
  return (
    <Wrapper
      variants={placeholderVariants}
      initial="initial"
      animate={isLoaded ? 'animate' : 'initial'}
    >
      {children}
    </Wrapper>
  );
}
