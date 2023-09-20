import styled from '@emotion/styled';
import { Variants, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Wrapper = styled(motion.div)`
  width: calc(100% + 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--secondary);
`;

const Background = styled(motion.div)`
  width: 100%;
  height: 480px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--secondary);
  position: relative;

  & > img {
    object-fit: cover;
    opacity: 0.75;
    transform: translate3d(0, 0, 0);
    filter: blur(40px);

    @media (max-width: 1199px) {
      filter: blur(24px);
    }

    @media (max-width: 809px) {
      display: none;
    }
  }

  @media (max-width: 1199px) {
    width: 100%;
    height: 400px;
  }

  @media (max-width: 809px) {
    height: 240px;
  }
`;

const Main = styled.div`
  width: 936px;
  height: 400px;
  background-color: var(--secondary);
  position: relative;
  border-radius: 32px;
  overflow: hidden;

  & > img {
    object-fit: cover;
  }

  @media (max-width: 1199px) {
    width: 100%;
    border-radius: 0px;
  }

  @media (max-width: 809px) {
    height: 240px;
  }
`;

const backgroundVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

interface BackdropProps {
  src?: string;
}

export default function Backdrop({ src }: BackdropProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [src]);

  return (
    <Wrapper>
      <Background
        variants={backgroundVariants}
        initial="initial"
        animate={isLoaded ? 'animate' : 'initial'}
      >
        {src && <Image src={src} fill alt="Background" unoptimized />}
        <Main>
          {src && (
            <Image
              src={src}
              fill
              alt="Backdrop"
              unoptimized
              onLoadingComplete={() => setIsLoaded(true)}
            />
          )}
        </Main>
      </Background>
    </Wrapper>
  );
}
