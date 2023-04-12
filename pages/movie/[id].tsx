import Layout from "@/components/layout";
import WatchSelector from "@/components/watch-selector";
import { MovieDetail } from "@/lib/client/interface";
import useIsMobile from "@/lib/client/useIsMobile";
import styled from "@emotion/styled";
import { Play } from "@phosphor-icons/react";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
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

const Backdrop = styled.div`
  width: 100%;
  height: 480px;
  background-color: #dddddd;
  position: relative;
  object-fit: fill;
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

  const { data } = useSWR<MovieDetail>(
    id &&
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&watch_region=KR&append_to_response=credits,release_dates,watch/providers`
  );

  const director = data?.credits?.crew.find((crew) => crew.job === "Director");
  const writer = data?.credits?.crew.find((crew) => crew.job === "Screenplay");
  const rating = data?.release_dates?.results
    ?.find((result) => result.iso_3166_1 === "KR")
    ?.release_dates?.find((date) => date.certification !== "")?.certification;

  console.log(data?.["watch/providers"]?.results?.KR?.flatrate);

  return (
    <Layout>
      <Backdrop>
        {data?.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${data?.backdrop_path}`}
            fill
            alt="Backdrop"
            style={{ objectFit: "cover" }}
          />
        )}
      </Backdrop>
      <Wrapper>
        <Header>
          <TitleBar>
            <Title>{data ? data.title : "제목"}</Title>
            <SubTitle>
              평점 {data?.vote_average.toFixed(1)} 개봉연도{" "}
              {data?.release_date.slice(0, 4)} 관람등급 {rating || "정보 없음"}
            </SubTitle>
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

        <Overview>{data?.overview}</Overview>

        <Genres>
          {data?.genres.map((genre) => (
            <Genre key={genre.id}>{genre.name}</Genre>
          ))}
        </Genres>
      </Wrapper>

      {/* <TouchSlider />
      <TouchSlider />
      <TouchSlider /> */}

      <Details>
        <DetailsTitle>상세 정보</DetailsTitle>
        <DetailsBody>
          감독: {director?.name || "정보 없음"}
          <br />
          각본: {writer?.name || "정보 없음"}
          <br />
          관람등급: {rating || "정보 없음"}
        </DetailsBody>
      </Details>
    </Layout>
  );
}
