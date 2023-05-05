import useIsDesktop from "@/lib/client/useIsDesktop";
import styled from "@emotion/styled";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Poster from "./poster";
import { useEffect, useState } from "react";
import { AnimatePresence, Variants, motion } from "framer-motion";

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
  font-size: 20px;
  padding-left: 24px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  letter-spacing: -0.5px;

  @media (min-width: 1200px) {
    padding-left: 120px;
  }

  @media (max-width: 809px) {
    padding-left: 16px;
    font-size: 16px;
  }
`;

const Contents = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 24px 24px 24px;
  overflow: auto;
  gap: 24px;
  position: relative;

  @media (max-width: 809px) {
    padding: 8px 16px 16px 16px;
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

const DisableText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  position: absolute;
`;

const Button = styled.div<{ disable: boolean }>`
  width: 72px;
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(32px);
  background-color: rgba(232, 232, 232, 0.75);
  border-radius: 100%;
  cursor: pointer;
  z-index: 1;
  color: ${(props) => (props.disable ? "#bbb" : "#333")};

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
  ids?: number[];
  disable?: boolean;
}

export default function Slider({ title, ids, disable }: SliderProps) {
  const isDesktop = useIsDesktop();
  const [index, setIndex] = useState(0);
  const [isLast, setIsLast] = useState(true);
  const [isGoingBack, setIsGoingBack] = useState(false);

  useEffect(() => {
    if (!ids) return;
    setIsLast(ids.length <= index * offset + offset);
  }, [ids, index]);

  const handlePrev = async () => {
    if (index === 0) return;

    setIsGoingBack(true);
    setIndex(index - 1);
  };

  const handleNext = async () => {
    if (!ids || isLast) return;

    setIsGoingBack(false);
    setIndex(index + 1);
  };

  return (
    <Wrapper>
      <Title>{title}</Title>

      <Contents>
        <Button onClick={handlePrev} disable={index === 0}>
          <CaretLeft size={24} weight="bold" />
        </Button>

        <PostersWrapper>
          <AnimatePresence>
            {disable ? (
              <DisableText>준비 중인 기능이에요.</DisableText>
            ) : (
              <Posters
                variants={postersVariants}
                custom={isGoingBack}
                initial="initial"
                animate="visible"
                exit="exit"
                key={ids?.[index]}
              >
                {isDesktop
                  ? ids
                      ?.slice(index * offset, (index + 1) * offset)
                      .map((id, index) => <Poster key={index} id={id} />)
                  : ids?.map((id, index) => <Poster key={index} id={id} />)}
              </Posters>
            )}
          </AnimatePresence>
        </PostersWrapper>

        <Button onClick={handleNext} disable={isLast}>
          <CaretRight size={24} weight="bold" />
        </Button>
      </Contents>
    </Wrapper>
  );
}
