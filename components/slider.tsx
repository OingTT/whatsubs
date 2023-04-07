import useIsDesktop from "@/lib/client/useIsDesktop";
import styled from "@emotion/styled";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  @media (min-width: 1200px) {
    width: fit-content;
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

  @media (max-width: 810px) {
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

  @media (max-width: 810px) {
    padding: 8px 16px 16px 16px;
    gap: 16px;
  }
`;

const Poster = styled.div`
  min-width: 168px;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.25);
  background-color: #333333;
  aspect-ratio: 2/3;
  border-radius: 16px;

  @media (max-width: 810px) {
    min-width: 120px;
  }
`;

const Button = styled.div`
  width: 72px;
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eeeeee;
  border-radius: 100%;
`;

interface SliderProps {
  title: string;
}

export default function Slider({ title }: SliderProps) {
  const isDesktop = useIsDesktop();

  return (
    <Wrapper>
      <Title>{title}</Title>
      {isDesktop ? (
        <Contents>
          <Button>
            <CaretLeft size={24} color="#333" weight="bold" />
          </Button>
          {Array.from({ length: 5 }, (_, index) => (
            <Poster key={index} />
          ))}
          <Button>
            <CaretRight size={24} color="#333" weight="bold" />
          </Button>
        </Contents>
      ) : (
        <Contents>
          {Array.from({ length: 20 }, (_, index) => (
            <Poster key={index} />
          ))}
        </Contents>
      )}
    </Wrapper>
  );
}
