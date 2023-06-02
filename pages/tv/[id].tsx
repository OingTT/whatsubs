import Layout from "@/components/layout/layout";
import Person from "@/components/person";
import Slider from "@/components/slider";
import WatchSelector from "@/components/watch-selector";
import { Content, TVDetail } from "@/lib/client/interface";
import { Grid } from "@/lib/client/style";
import styled from "@emotion/styled";
import { Play, Star } from "@phosphor-icons/react";
import { ContentType, Subscription } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import useSWR from "swr";
import React from "react";
import * as cheerio from "cheerio";

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
  gap: 8px;
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

const SubTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  color: #bbb;
`;

const Rating = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const Certification = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 4px 0px 4px;
  border: 1px solid #bbb;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
`;

const Selector = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

const PlayButton = styled.div<{ disabled?: boolean }>`
  width: 96px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${(props) =>
    props.disabled ? "none" : "0px 2px 8px rgba(0, 0, 0, 0.25)"};
  background-color: ${(props) => (props.disabled ? "#eeeeee" : "#000000")};
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
  const { data: rating } = useSWR<{ rating: number }>(
    `/api/review/movie/${id}`
  );
  const { data } = useSWR<TVDetail>(
    id &&
      `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&watch_region=KR&append_to_response=aggregate_credits,content_ratings,recommendations,similar,watch/providers`
  );

  const recommendations = data?.recommendations?.results.map(
    (result): Content => ({
      type: ContentType.TV,
      id: result.id,
    })
  );
  const similar = data?.similar?.results.map(
    (result): Content => ({
      type: ContentType.TV,
      id: result.id,
    })
  );

  const creatorNames = data?.created_by.map((creator) => creator.name);
  const { data: translatedCreators } = useSWR(
    creatorNames &&
      `/api/translate/${encodeURIComponent(creatorNames.join(","))}`
  );

  const creator =
    translatedCreators?.translatedText || creatorNames?.join(", ");
  const certification = data?.content_ratings?.results?.find(
    (result) => result.iso_3166_1 === "KR"
  )?.rating;

  const origin_url = data?.["watch/providers"]?.results.KR?.link;
  const result_url =
    "https://whatsubs.herokuapp.com/https://www.themoviedb.org/" +
    origin_url?.replace("https://www.themoviedb.org/", "");

  //console.log({ data });
  //console.log({ origin_url });
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

        console.log({ url });

        if (typeof url === "string") {
          urls.push(url);
        }
      }
    });

    return { providers, urls };
  });

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
        <Header>
          <TitleBar>
            <Title>{data ? data.name : "제목"}</Title>
            <SubTitle>
              <Rating>
                <Star weight="fill" />
                {rating?.rating.toFixed(1) || "-.-"}
              </Rating>
              {data?.first_air_date.slice(0, 4)}
              <Certification>{certification || "정보 없음"}</Certification>
            </SubTitle>
          </TitleBar>

          <WatchSelector
            type={ContentType.TV}
            id={Number(id)}
            absoluteStars
            count
          />
        </Header>

        <Selector>
          <a href={playLink?.urls[0]} target="_blank" rel="noopener">
            <PlayButton disabled={playLink?.urls.length === 0}>
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

      <Slider title="추천 콘텐츠" contents={recommendations} />
      <Slider title="비슷한 콘텐츠" contents={similar} />

      <Details>
        <DetailsTitle>상세 정보</DetailsTitle>
        <DetailsBody>크리에이터: {creator || "정보 없음"}</DetailsBody>
      </Details>
    </Layout>
  );
}
