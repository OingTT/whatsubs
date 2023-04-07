import { Movie } from "@/lib/client/interface";
import useIsDesktop from "@/lib/client/useIsDesktop";
import styled from "@emotion/styled";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import Poster from "./poster";

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
  data?: Movie[];
}

export default function Slider({ title, data }: SliderProps) {
  const isDesktop = useIsDesktop();

  return (
    <Wrapper>
      <Title>{title}</Title>
      {isDesktop ? (
        <Contents>
          <Button>
            <CaretLeft size={24} color="#333" weight="bold" />
          </Button>
          {data?.slice(0, 5).map((movie, index) => (
            <Poster key={index} data={movie} />
          ))}
          <Button>
            <CaretRight size={24} color="#333" weight="bold" />
          </Button>
        </Contents>
      ) : (
        <Contents>
          {data?.map((movie, index) => (
            <Poster key={index} data={movie} />
          ))}
        </Contents>
      )}
    </Wrapper>
  );
}
