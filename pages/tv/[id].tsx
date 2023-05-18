import Alert from "@/components/alert";
import Layout from "@/components/layout";
import Person from "@/components/person";
import Slider from "@/components/slider";
import WatchSelector from "@/components/watch-selector";
import { TVDetail } from "@/lib/client/interface";
import { Grid } from "@/lib/client/style";
import styled from "@emotion/styled";
import { Play } from "@phosphor-icons/react";
import { ContentType, Subscription } from "@prisma/client";
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

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 809px) {
    gap: 8px;
  }
`;

const GroupTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #333;

  @media (max-width: 809px) {
    font-size: 16px;
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

export default function TV() {
  const {
    query: { id },
  } = useRouter();
  const { data: subscriptions } = useSWR<Subscription[]>("/api/subscriptions");
  const { data } = useSWR<TVDetail>(
    id &&
      `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&watch_region=KR&append_to_response=aggregate_credits,content_ratings,watch/providers`
  );

  const creator = data?.created_by.map((creator) => creator.name).join(", ");
  const rating = data?.content_ratings?.results?.find(
    (result) => result.iso_3166_1 === "KR"
  )?.rating;

  return (
    <Layout title={data?.name} fit>
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
            <Title>{data ? data.name : "제목"}</Title>
            <SubTitle>
              평점 {data?.vote_average.toFixed(1)} 개봉연도{" "}
              {data?.first_air_date.slice(0, 4)} 관람등급{" "}
              {rating || "정보 없음"}
            </SubTitle>
          </TitleBar>

          <WatchSelector type={ContentType.TV} id={Number(id)} absoluteStars />
        </Header>

        <Selector>
          <PlayButton>
            <Play color="white" weight="fill" />
          </PlayButton>
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

        <Group>
          <GroupTitle>출연진</GroupTitle>
          <Grid>
            {data?.aggregate_credits.cast.slice(0, 10).map((cast) => (
              <Person
                key={cast.id}
                id={cast.id}
                profilePath={cast.profile_path}
                name={cast.name}
                info={cast.roles[0].character}
              />
            ))}
          </Grid>
        </Group>
      </Wrapper>

      <Slider title="추천 콘텐츠" disabled />
      <Slider title="비슷한 콘텐츠" disabled />

      <Details>
        <DetailsTitle>상세 정보</DetailsTitle>
        <DetailsBody>크리에이터: {creator || "정보 없음"}</DetailsBody>
      </Details>
    </Layout>
  );
}
