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
import { Section, Container } from '@/lib/client/style';
import { GetServerSideProps } from 'next';
import { IconPlayerPlayFilled, IconStarFilled } from '@tabler/icons-react';
import Skeleton from 'react-loading-skeleton';
import Comments from '@/components/content/comments';
import Casts from '@/components/content/casts';
import usePlayLinks from '@/lib/client/usePlayLinks';
import Genres from '@/components/content/genres';
import Details from '@/components/content/details';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

const Backdrop = styled.div`
  width: 936px;
  height: 400px;
  background-color: var(--secondary);
  position: relative;
  border-radius: 32px;
  overflow: hidden;

  & > img {
    object-fit: cover;
  }

  @media (max-width: 1199px) {
    width: 100%;
    border-radius: 0px;
  }

  @media (max-width: 809px) {
    height: 240px;
  }
`;

const Background = styled.div`
  width: calc(100% + 80px);
  height: 480px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--secondary);
  position: relative;

  & > img {
    object-fit: cover;
    opacity: 0.75;
    transform: translate3d(0, 0, 0);
    filter: blur(40px);

    @media (max-width: 1199px) {
      filter: blur(24px);
    }

    @media (max-width: 809px) {
      display: none;
    }
  }

  @media (max-width: 1199px) {
    width: 100%;
    height: 400px;
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
  align-items: flex-start;
  gap: 24px;

  @media (max-width: 809px) {
    gap: 16px;
  }
`;

const Left = styled.div`
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

const Right = styled.div`
  margin-top: 4px;
`;

const Rating = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
`;

const Certification = styled.div`
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 4px;
  border: 1.5px solid var(--text-secondary);
  border-radius: 4px;
  font-size: 0.75rem; // 12px
  line-height: 1.25;
  font-weight: 500;
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

const Overview = styled.p`
  width: 100%;
`;

interface ContentProps {
  type: ContentType;
  id: number;
}

export default function Content({ type, id }: ContentProps) {
  const { data: subscriptions } = useSWR<Subscription[]>('/api/subscriptions');
  const { data: rating } = useSWR<{ rating?: number }>(
    `/api/contents/${type.toLowerCase()}/${id}/reviews/values`
  );

  const fetchContentDetail: Fetcher<
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
    fetchContentDetail
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

  const certification =
    contentDetail?.type === 'MOVIE'
      ? contentDetail.release_dates?.results
          ?.find(result => result.iso_3166_1 === 'KR')
          ?.release_dates?.find(date => date.certification !== '')
          ?.certification
      : contentDetail?.content_ratings?.results?.find(
          result => result.iso_3166_1 === 'KR'
        )?.rating;

  const playLinks = usePlayLinks(
    contentDetail?.['watch/providers']?.results?.KR?.link
  );

  return (
    <Layout
      title={
        contentDetail?.type === ContentType.MOVIE
          ? contentDetail.title
          : contentDetail?.name
      }
      fit
    >
      <Background>
        {contentDetail?.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${contentDetail.backdrop_path}`}
            fill
            alt="Background"
            unoptimized
          />
        )}
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
      </Background>
      <Container>
        <Header>
          <Left>
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
                    <IconStarFilled size={14} />
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
          </Left>

          <Right>
            <WatchSelector type={type} id={id} absoluteStars count />
          </Right>
        </Header>

        <Selector>
          <a href={playLinks?.urls[0]} target="_blank" rel="noopener">
            <PlayButton disabled={!playLinks || playLinks.urls.length === 0}>
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

        <Genres genres={contentDetail?.genres} />
        <Casts contentDetail={contentDetail} />
        <Comments type={type} id={id} />
      </Container>

      <Container fill>
        {collections && <Slider title="시리즈" contents={collections} />}
        <Slider title="추천 콘텐츠" contents={recommendations} />
        <Slider title="비슷한 콘텐츠" contents={similar} />
      </Container>

      <Container>
        <Details contentDetail={contentDetail} />
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      type: context.query.type?.toString().toUpperCase(),
      id: Number(context.query.id),
    },
  };
};
