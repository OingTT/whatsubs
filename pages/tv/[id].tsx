import Layout from '@/components/layout/layout';
import Person from '@/components/person';
import Slider from '@/components/slider';
import WatchSelector from '@/components/watch-selector';
import { Content, TVDetail } from '@/lib/client/interface';
import { Grid, Container, Section, Caption } from '@/lib/client/style';
import styled from '@emotion/styled';
import { Play, Star } from '@phosphor-icons/react';
import { ContentType, Subscription } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import React from 'react';
import * as cheerio from 'cheerio';

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

const SubTitle = styled.h6`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  color: #bbb;
  font-weight: 400;
`;

const Rating = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
`;

const Certification = styled.div`
  display: flex;
  padding: 0px 4px;
  border: 1px solid #bbb;
  border-radius: 4px;
  font-size: 0.75rem; // 12px
  line-height: 1.25;
`;

const Selector = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
`;

const PlayButton = styled.button`
  width: 96px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  font-size: 1rem;
  box-shadow: ${props =>
    props.disabled ? 'none' : '0px 2px 8px rgba(0, 0, 0, 0.25)'};
  background-color: ${props => (props.disabled ? '#eeeeee' : '#000000')};
  border-radius: 8px;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
`;

const Providers = styled.div`
  display: flex;
  gap: 8px;
`;

const Provider = styled(Image)`
  border-radius: 100%;
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

export default function TV() {
  const {
    query: { id },
  } = useRouter();
  const { data: subscriptions } = useSWR<Subscription[]>('/api/subscriptions');
  const { data: rating } = useSWR<{ rating: number }>(`/api/review/tv/${id}`);
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

  const creatorNames = data?.created_by.map(creator => creator.name);
  const { data: translatedCreators } = useSWR(
    creatorNames &&
      `/api/translate/${encodeURIComponent(creatorNames.join(','))}`
  );

  const creator =
    translatedCreators?.translatedText || creatorNames?.join(', ');
  const certification = data?.content_ratings?.results?.find(
    result => result.iso_3166_1 === 'KR'
  )?.rating;

  const origin_url = data?.['watch/providers']?.results.KR?.link;
  const result_url =
    'https://whatsubs.herokuapp.com/https://www.themoviedb.org/' +
    origin_url?.replace('https://www.themoviedb.org/', '');

  //console.log({ data });
  //console.log({ origin_url });
  console.log({ result_url });

  // link
  const { data: playLink } = useSWR(result_url, async url => {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const providers: string[] = [];
    const urls: string[] = [];

    $('ul.providers li a').each((index, element) => {
      const provider = $(element).attr('title');

      if (
        typeof provider === 'string' &&
        provider[0] === 'W' &&
        !providers.includes(provider)
      ) {
        providers.push(provider);

        const url = $(element).attr('href');

        console.log({ url });

        if (typeof url === 'string') {
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
            style={{ objectFit: 'cover' }}
          />
        )}
      </Backdrop>
      <Container>
        <Header>
          <TitleBar>
            <h2>{data ? data.name : '제목'}</h2>
            <SubTitle>
              <Rating>
                <Star weight="fill" />
                {rating?.rating.toFixed(1) || '-.-'}
              </Rating>
              {data?.first_air_date.slice(0, 4)}
              <Certification>{certification || '정보 없음'}</Certification>
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
            {data?.['watch/providers']?.results?.KR?.flatrate?.map(provider => {
              const watchProvider = subscriptions?.find(
                subscription => subscription.providerId === provider.provider_id
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
            })}
          </Providers>
        </Selector>

        <Section>
          <p>{data?.overview}</p>
        </Section>

        <Genres>
          {data?.genres.map(genre => (
            <Genre key={genre.id}>{genre.name}</Genre>
          ))}
        </Genres>

        <Section>
          <h5>출연진</h5>
          <Grid>
            {data?.aggregate_credits.cast
              .slice(0, 10)
              .map(cast => (
                <Person
                  key={cast.id}
                  id={cast.id}
                  profilePath={cast.profile_path}
                  name={cast.name}
                  info={cast.roles[0].character}
                />
              ))}
          </Grid>
        </Section>
      </Container>

      <Container fill>
        <Slider title="추천 콘텐츠" contents={recommendations} />
        <Slider title="비슷한 콘텐츠" contents={similar} />
      </Container>

      <Container>
        <Section>
          <h5>상세 정보</h5>
          <Caption>크리에이터: {creator || '정보 없음'}</Caption>
        </Section>
      </Container>
    </Layout>
  );
}
