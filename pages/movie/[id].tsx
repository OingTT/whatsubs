import Layout from "@/components/layout";
import WatchSelector from "@/components/watch-selector";
import useIsMobile from "@/lib/client/useIsMobile";
import styled from "@emotion/styled";
import { Play } from "@phosphor-icons/react";
import { useRouter } from "next/router";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  gap: 24px;

  @media (min-width: 1200px) {
    width: 984px;
  }

  @media (max-width: 810px) {
    padding: 16px;
    gap: 16px;
  }
`;

const Background = styled.div`
  width: 100%;
  height: 240px;
  background-color: #dddddd;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TitleBar = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -1.5px;
  color: #111;

  @media (max-width: 1200px) {
    font-size: 32px;
  }

  @media (max-width: 810px) {
    font-size: 24px;
  }
`;

const SubTitle = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  letter-spacing: -0.5px;

  @media (max-width: 810px) {
    font-size: 16px;
  }
`;

const Selector = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

const PlayButton = styled.div`
  width: 96px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  background-color: #000000;
  border-radius: 8px;
`;

const Providers = styled.div`
  display: flex;
  gap: 8px;
`;

const Provider = styled.div`
  width: 32px;
  height: 32px;
  background-color: #000000;
  border-radius: 100%;
`;

const Overview = styled.div`
  line-height: 1.2;
  color: #333;
`;

const Genres = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
`;

const Genre = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 24px 0px 24px;
  background-color: #eeeeee;
  border-radius: 8px;
  color: #333;

  @media (max-width: 810px) {
    height: 32px;
    padding: 0px 16px 0px 16px;
    font-size: 12px;
  }
`;

const Details = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 24px 24px 24px;
  gap: 16px;

  @media (min-width: 1200px) {
    width: 984px;
  }

  @media (max-width: 810px) {
    padding: 0px 16px 16px 16px;
    gap: 8px;
  }
`;

const DetailsTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;

  @media (max-width: 810px) {
    font-size: 16px;
  }
`;

const DetailsBody = styled.div`
  line-height: 1.4;
  font-weight: 500;
  color: #666;

  @media (max-width: 810px) {
    font-size: 12px;
  }
`;

export default function Movie() {
  const isMobile = useIsMobile();

  const {
    query: { id },
  } = useRouter();

  return (
    <Layout>
      <Background />
      <Wrapper>
        <Header>
          <TitleBar>
            <Title>제목</Title>
            <SubTitle>평점 개봉연도 관람등급</SubTitle>
          </TitleBar>

          <WatchSelector id={Number(id)} large={!isMobile} absoluteStars />
        </Header>

        <Selector>
          <PlayButton>
            <Play color="white" weight="fill" />
          </PlayButton>
          <Providers>
            <Provider />
            <Provider />
            <Provider />
          </Providers>
        </Selector>

        <Overview>
          우는 못할 봄날의 하는 때문이다. 청춘 그와 청춘 보라. 속잎나고, 얼마나
          고행을 미인을 인간에 우리 불어 피고, 위하여 힘있다. 영원히 힘차게
          무엇을 고동을 풀이 사막이다. 사람은 열락의 석가는 하는 하는 청춘
          그들은 아름다우냐? 얼마나 청춘에서만 영락과 바이며, 사는가 풍부하게
          그러므로 싸인 칼이다. 생생하며, 그들은 원질이 것이다. 피가 들어 기관과
          천지는 피고, 무엇을 못할 인간의 만물은 것이다. 평화스러운 과실이 뭇
          온갖 어디 피다.
        </Overview>

        <Genres>
          <Genre>SF</Genre>
          <Genre>모험</Genre>
          <Genre>액션</Genre>
        </Genres>
      </Wrapper>

      {/* <TouchSlider />
      <TouchSlider />
      <TouchSlider /> */}

      <Details>
        <DetailsTitle>상세 정보</DetailsTitle>
        <DetailsBody>
          감독: 홍길동
          <br />
          각본: 홍길동
          <br />
          관람등급: 전체관람가
        </DetailsBody>
      </Details>
    </Layout>
  );
}
