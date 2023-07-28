import Layout from '@/components/layout/layout';
import Slider from '@/components/slider';
import WatchSelector from '@/components/watch-selector';
import {
  Collection,
  Content,
  MovieDetail,
  TVDetail,
} from '@/lib/client/interface';
import styled from '@emotion/styled';
import { ContentType, Subscription } from '@prisma/client';
import Image from 'next/image';
import useSWR, { Fetcher } from 'swr';
import * as cheerio from 'cheerio';
import Person from '@/components/person';
import { Grid, Section, Container, Caption } from '@/lib/client/style';
import { GetServerSideProps } from 'next';
import { IconPlayerPlayFilled, IconStarFilled } from '@tabler/icons-react';
import Skeleton from 'react-loading-skeleton';

const Backdrop = styled.div`
  width: 100%;
  height: 320px;
  background-color: var(--secondary);
  position: relative;

  & > img {
    object-fit: cover;
  }

  @media (max-width: 809px) {
    height: 240px;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 24px;

  @media (max-width: 809px) {
    gap: 16px;
  }
`;

const TitleBar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SubTitle = styled.h6`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
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
  border: 1px solid var(--text-secondary);
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
  box-shadow: ${props =>
    props.disabled ? 'none' : '0px 2px 8px rgba(0, 0, 0, 0.25)'};
  background-color: var(
    ${props => (props.disabled ? '--secondary' : '--primary')}
  );
  color: var(--text-primary);
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
  background-color: var(--secondary);
  border-radius: 8px;
  font-weight: 500;

  @media (max-width: 809px) {
    height: 32px;
    padding: 0px 16px 0px 16px;
    font-size: 0.875rem; // 14px
  }
`;

const Overview = styled.p`
  width: 100%;
`;

export const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: {
      type: context.query.type?.toString().toUpperCase(),
      id: Number(context.query.id),
    },
  };
};

interface ContentProps {
  type: ContentType;
  id: number;
}

export default function Content({ type, id }: ContentProps) {
  const { data: subscriptions } = useSWR<Subscription[]>('/api/subscriptions');
  const { data: rating } = useSWR<{ rating?: number }>(
    `/api/contents/${type.toLowerCase()}/${id}/reviews/values`
  );

  const getContentDetail: Fetcher<
    MovieDetail | TVDetail,
    string
  > = async url => {
    const response = await fetch(url);
    const data = await response.json();
    data.type = type;

    return data;
  };

  const { data: contentDetail } = useSWR(
    type === ContentType.MOVIE
      ? `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&watch_region=KR&append_to_response=credits,recommendations,release_dates,similar,watch/providers`
      : `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&watch_region=KR&append_to_response=aggregate_credits,content_ratings,recommendations,similar,watch/providers`,
    getContentDetail
  );

  const { data: collection } = useSWR<Collection>(
    contentDetail?.type === 'MOVIE' &&
      contentDetail.belongs_to_collection &&
      `https://api.themoviedb.org/3/collection/${contentDetail.belongs_to_collection.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );

  const collections = collection?.parts.map(
    (part): Content => ({
      type,
      id: part.id,
    })
  );

  const recommendations = contentDetail?.recommendations?.results.map(
    (result): Content => ({
      type,
      id: result.id,
    })
  );
  const similar = contentDetail?.similar?.results.map(
    (result): Content => ({
      type,
      id: result.id,
    })
  );

  const directorNames =
    contentDetail?.type === ContentType.MOVIE
      ? contentDetail.credits?.crew
          .filter(crew => crew.job === 'Director')
          .map(crew => crew.name)
      : undefined;
  const writerNames =
    contentDetail?.type === ContentType.MOVIE
      ? contentDetail.credits?.crew
          .filter(crew => crew.job === 'Writer' || crew.job === 'Screenplay')
          .map(crew => crew.name)
      : undefined;
  const { data: translatedDirectors } = useSWR(
    directorNames &&
      `/api/translate/${encodeURIComponent(directorNames.join(','))}`
  );
  const { data: translatedWriters } = useSWR(
    writerNames && `/api/translate/${encodeURIComponent(writerNames.join(','))}`
  );

  const director =
    translatedDirectors?.translatedText || directorNames?.join(', ');
  const writer = translatedWriters?.translatedText || writerNames?.join(', ');

  const creatorNames =
    contentDetail?.type === ContentType.TV
      ? contentDetail.created_by.map(creator => creator.name)
      : undefined;
  const { data: translatedCreators } = useSWR(
    creatorNames &&
      `/api/translate/${encodeURIComponent(creatorNames.join(','))}`
  );

  const creator =
    translatedCreators?.translatedText || creatorNames?.join(', ');

  const certification =
    contentDetail?.type === 'MOVIE'
      ? contentDetail.release_dates?.results
          ?.find(result => result.iso_3166_1 === 'KR')
          ?.release_dates?.find(date => date.certification !== '')
          ?.certification
      : contentDetail?.content_ratings?.results?.find(
          result => result.iso_3166_1 === 'KR'
        )?.rating;

  const origin_url = contentDetail?.['watch/providers']?.results?.KR?.link;
  const result_url =
    'https://whatsubs.herokuapp.com/https://www.themoviedb.org/' +
    origin_url?.replace('https://www.themoviedb.org/', '');

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

        if (typeof url === 'string') {
          urls.push(url);
        }
      }
    });

    return { providers, urls };
  });

  return (
    <Layout
      title={
        contentDetail?.type === ContentType.MOVIE
          ? contentDetail.title
          : contentDetail?.name
      }
      fit
    >
      <Backdrop>
        {contentDetail?.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${contentDetail.backdrop_path}`}
            fill
            alt="Backdrop"
            unoptimized
          />
        )}
      </Backdrop>
      <Container>
        <Header>
          <TitleBar>
            <h2>
              {contentDetail ? (
                contentDetail.type === 'MOVIE' ? (
                  contentDetail.title
                ) : (
                  contentDetail.name
                )
              ) : (
                <Skeleton />
              )}
            </h2>
            <SubTitle>
              {contentDetail ? (
                <>
                  <Rating>
                    <IconStarFilled size={16} />
                    {rating?.rating?.toFixed(1) || '-.-'}
                  </Rating>
                  {contentDetail?.type === ContentType.MOVIE
                    ? contentDetail.release_date.slice(0, 4)
                    : contentDetail?.first_air_date.slice(0, 4)}
                  <Certification>{certification || '정보 없음'}</Certification>
                </>
              ) : (
                <Skeleton width={120} />
              )}
            </SubTitle>
          </TitleBar>

          <WatchSelector type={type} id={id} absoluteStars count />
        </Header>

        <Selector>
          <a href={playLink?.urls[0]} target="_blank" rel="noopener">
            <PlayButton disabled={!playLink || playLink.urls.length === 0}>
              <IconPlayerPlayFilled size={16} />
            </PlayButton>
          </a>

          <Providers>
            {contentDetail?.['watch/providers']?.results?.KR?.flatrate?.map(
              provider => {
                const watchProvider = subscriptions?.find(
                  subscription =>
                    subscription.providerId === provider.provider_id
                );
                return (
                  watchProvider && (
                    <Provider
                      key={provider.provider_id}
                      src={`/images/subs/${watchProvider.key}.png`}
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

        <Section>
          <Overview>
            {contentDetail ? contentDetail.overview : <Skeleton count={3} />}
          </Overview>
        </Section>

        <Genres>
          {contentDetail?.genres.map(genre => (
            <Genre key={genre.id}>{genre.name}</Genre>
          )) || (
            <>
              <Skeleton wrapper={Genre} width={40} />
              <Skeleton wrapper={Genre} width={40} />
              <Skeleton wrapper={Genre} width={40} />
            </>
          )}
        </Genres>

        <Section>
          <h5>출연진</h5>
          <Grid>
            {contentDetail?.type === ContentType.MOVIE
              ? contentDetail.credits?.cast
                  .slice(0, 6)
                  .map(person => (
                    <Person
                      key={person.id}
                      id={person.id}
                      name={person.name}
                      profilePath={person.profile_path}
                      info={person.character}
                    />
                  ))
              : contentDetail?.aggregate_credits?.cast
                  .slice(0, 6)
                  .map(person => (
                    <Person
                      key={person.id}
                      id={person.id}
                      name={person.name}
                      profilePath={person.profile_path}
                      info={person.roles[0].character}
                    />
                  ))}
          </Grid>
        </Section>
      </Container>

      <Container fill>
        {collections && <Slider title="시리즈" contents={collections} />}
        <Slider title="추천 콘텐츠" contents={recommendations} />
        <Slider title="비슷한 콘텐츠" contents={similar} />
      </Container>

      <Container>
        <Section>
          <h5>상세 정보</h5>
          <Caption>
            {contentDetail ? (
              contentDetail.type === ContentType.MOVIE ? (
                <>
                  감독: {director || '정보 없음'}
                  <br />
                  각본: {writer || '정보 없음'}
                </>
              ) : (
                <>크리에이터: {creator || '정보 없음'}</>
              )
            ) : (
              <Skeleton width={160} />
            )}
          </Caption>
        </Section>
      </Container>
    </Layout>
  );
}
