import Layout from "@/components/layout";
import Slider from "@/components/slider";
import WatchSelector from "@/components/watch-selector";
import { MovieDetail } from "@/lib/client/interface";
import styled from "@emotion/styled";
import { Play } from "@phosphor-icons/react";
import { ContentType, Subscription } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import * as cheerio from "cheerio";
import Alert from "@/components/alert";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;

  @media (min-width: 1200px) {
    width: 984px;
  }

  @media (max-width: 809px) {
    padding: 16px;
    gap: 16px;
  }
`;

const Backdrop = styled.div`
  width: 100%;
  height: 320px;
  background-color: #dddddd;
  position: relative;
  object-fit: fill;

  @media (max-width: 809px) {
    height: 240px;
  }
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

  @media (max-width: 1199px) {
    font-size: 32px;
  }

  @media (max-width: 809px) {
    font-size: 24px;
  }
`;

const SubTitle = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  letter-spacing: -0.5px;

  @media (max-width: 809px) {
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

const Provider = styled(Image)`
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

  @media (max-width: 809px) {
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

  @media (max-width: 809px) {
    padding: 0px 16px 16px 16px;
    gap: 8px;
  }
`;

const DetailsTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;

  @media (max-width: 809px) {
    font-size: 16px;
  }
`;

const DetailsBody = styled.div`
  line-height: 1.4;
  font-weight: 500;
  color: #666;

  @media (max-width: 809px) {
    font-size: 12px;
  }
`;

export default function Movie() {
  const {
    query: { id },
  } = useRouter();
  const { data: subscriptions } = useSWR<Subscription[]>("/api/subscriptions");
  const { data } = useSWR<MovieDetail>(
    id &&
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&watch_region=KR&append_to_response=credits,release_dates,watch/providers`
  );

  const director = data?.credits?.crew
    .filter((crew) => crew.job === "Director")
    .map((crew) => crew.name)
    .join(", ");
  const writer = data?.credits?.crew
    .filter((crew) => crew.job === "Writer" || crew.job === "Screenplay")
    .map((crew) => crew.name)
    .join(", ");
  const rating = data?.release_dates?.results
    ?.find((result) => result.iso_3166_1 === "KR")
    ?.release_dates?.find((date) => date.certification !== "")?.certification;

  const origin_url = data?.["watch/providers"]?.results.KR?.link;
  const result_url =
    "https://cors-anywhere.herokuapp.com/https://www.themoviedb.org/" +
    origin_url?.replace("https://www.themoviedb.org/", "");

  console.log({ result_url });

  // link
  const { data: playLink } = useSWR(result_url, async (url) => {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const providers: string[] = [];
    const urls: string[] = [];

    $("ul.providers li a").each((index, element) => {
      const provider = $(element).attr("title");

      if (
        typeof provider === "string" &&
        provider[0] === "W" &&
        !providers.includes(provider)
      ) {
        providers.push(provider);

        const url = $(element).attr("href");

        if (typeof url === "string") {
          urls.push(url);
        }
      }
    });

    return { providers, urls };
  });

  console.log({ playLink });

  return (
    <Layout title={data?.title} fit>
      <Backdrop>
        {data?.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${data?.backdrop_path}`}
            fill
            alt="Backdrop"
            unoptimized
            style={{ objectFit: "cover" }}
          />
        )}
      </Backdrop>
      <Wrapper>
        <Alert>재생 기능은 아직 준비 중이에요.</Alert>
        <Header>
          <TitleBar>
            <Title>{data ? data.title : "제목"}</Title>
            <SubTitle>
              평점 {data?.vote_average.toFixed(1)} 개봉연도{" "}
              {data?.release_date.slice(0, 4)} 관람등급 {rating || "정보 없음"}
            </SubTitle>
          </TitleBar>

          <WatchSelector
            type={ContentType.MOVIE}
            id={Number(id)}
            absoluteStars
          />
        </Header>

        <Selector>
          <a href={playLink?.urls[0]} target="_blank" rel="noopener">
            <PlayButton>
              <Play color="white" weight="fill" />
            </PlayButton>
          </a>

          <Providers>
            {data?.["watch/providers"]?.results?.KR?.flatrate?.map(
              (provider) => {
                const watchProvider = subscriptions?.find(
                  (subscription) =>
                    subscription.providerId === provider.provider_id
                );
                return (
                  watchProvider && (
                    <Provider
                      key={provider.provider_id}
                      src={`/images/${watchProvider.key}.png`}
                      width={32}
                      height={32}
                      alt="Provider"
                    />
                  )
                );
              }
            )}
          </Providers>
        </Selector>

        <Overview>{data?.overview}</Overview>

        <Genres>
          {data?.genres.map((genre) => (
            <Genre key={genre.id}>{genre.name}</Genre>
          ))}
        </Genres>
      </Wrapper>

      <Slider title="추천 콘텐츠" disabled />
      <Slider title="비슷한 콘텐츠" disabled />

      <Details>
        <DetailsTitle>상세 정보</DetailsTitle>
        <DetailsBody>
          감독: {director || "정보 없음"}
          <br />
          각본: {writer || "정보 없음"}
        </DetailsBody>
      </Details>
    </Layout>
  );
}
