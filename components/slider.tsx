import useIsDesktop from '@/lib/client/useIsDesktop';
import styled from '@emotion/styled';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import Poster from './poster/poster';
import { useEffect, useState } from 'react';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { Content } from '@/lib/client/interface';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  @media (min-width: 1200px) {
    width: 1176px;
  }
`;

const Title = styled.div`
  padding-left: 24px;

  @media (min-width: 1200px) {
    padding-left: 120px;
  }

  @media (max-width: 809px) {
    padding-left: 16px;
  }
`;

const Contents = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 24px 24px 24px;
  margin-bottom: -24px;
  overflow: auto;
  gap: 24px;
  position: relative;

  @media (max-width: 809px) {
    padding: 12px 16px 16px 16px;
    margin-bottom: -16px;
    gap: 16px;
  }
`;

const PostersWrapper = styled.div`
  position: relative;
  height: 252px;
  width: 100%;

  @media (min-width: 1200px) {
    width: 936px;
  }

  @media (max-width: 809px) {
    height: 180px;
  }
`;

const Posters = styled(motion.div)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  width: 100%;
  position: absolute;

  @media (max-width: 809px) {
    gap: 16px;
  }
`;

const DisabledText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-secondary);
  position: absolute;
`;

const Button = styled.div<{ disabled: boolean }>`
  width: 72px;
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(32px);
  background-color: var(--secondary);
  border-radius: 100%;
  cursor: pointer;
  z-index: 1;

  & > svg {
    opacity: ${props => (props.disabled ? 0.2 : 1)};
  }

  @media (max-width: 1199px) {
    display: none;
  }
`;

const postersVariants: Variants = {
  initial: (isGoingBack: boolean) => ({
    opacity: 0,
    scale: 0.5,
    x: isGoingBack ? -160 : 160,
  }),
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
  },
  exit: (isGoingBack: boolean) => ({
    opacity: 0,
    scale: 0.5,
    x: isGoingBack ? 160 : -160,
  }),
};

const offset = 5;

interface SliderProps {
  title: string;
  contents?: Content[];
  disabled?: boolean;
}

export default function Slider({ title, contents, disabled }: SliderProps) {
  const isDesktop = useIsDesktop();
  const [index, setIndex] = useState(0);
  const [isLast, setIsLast] = useState(true);
  const [isGoingBack, setIsGoingBack] = useState(false);

  // Reset index when contents changed
  useEffect(() => {
    setIndex(0);
  }, [contents]);

  // Set isLast when index changed
  useEffect(() => {
    if (!contents) return;
    setIsLast(contents.length <= index * offset + offset);
  }, [contents, index]);

  // Set isGoingBack when index changed
  const handlePrev = async () => {
    if (index === 0) return;

    setIsGoingBack(true);
    setIndex(index - 1);
  };

  // Set isGoingBack when index changed
  const handleNext = async () => {
    if (!contents || isLast) return;

    setIsGoingBack(false);
    setIndex(index + 1);
  };

  return (
    <Wrapper>
      <Title>
        <h5>{title}</h5>
      </Title>

      <Contents>
        <Button onClick={handlePrev} disabled={index === 0}>
          <CaretLeft size={24} weight="bold" />
        </Button>

        <PostersWrapper>
          <AnimatePresence>
            {disabled ? (
              <DisabledText>준비 중인 기능이에요.</DisabledText>
            ) : contents?.length === 0 ? (
              <DisabledText>콘텐츠가 없어요.</DisabledText>
            ) : (
              <Posters
                variants={postersVariants}
                custom={isGoingBack}
                initial="initial"
                animate="visible"
                exit="exit"
                key={index}
              >
                {isDesktop
                  ? contents
                      ?.slice(index * offset, (index + 1) * offset)
                      .map((content, index) => (
                        <Poster key={index} {...content} />
                      ))
                  : contents?.map((content, index) => (
                      <Poster key={index} {...content} />
                    ))}
              </Posters>
            )}
          </AnimatePresence>
        </PostersWrapper>

        <Button onClick={handleNext} disabled={isLast}>
          <CaretRight size={24} weight="bold" />
        </Button>
      </Contents>
    </Wrapper>
  );
}
