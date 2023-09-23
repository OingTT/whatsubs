import Backdrop from '@/components/content/backdrop';
import Casts from '@/components/content/casts';
import Comments from '@/components/content/comments';
import Details from '@/components/content/details';
import Genres from '@/components/content/genres';
import PlaySelector from '@/components/content/play-selector';
import Seasons from '@/components/content/seasons';
import Layout from '@/components/layout/layout';
import Slider from '@/components/slider';
import WatchSelector from '@/components/watch-selector';
import { getTmdbImagePath } from '@/lib/client/api';
import {
  Collection,
  Content,
  MovieDetail,
  TVDetail,
} from '@/lib/client/interface';
import { Container, Section } from '@/lib/client/style';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import styled from '@emotion/styled';
import { ContentType } from '@prisma/client';
import { IconStarFilled } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Skeleton from 'react-loading-skeleton';
import useSWR, { Fetcher } from 'swr';

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

const Overview = styled.p`
  width: 100%;
`;

interface ContentProps {
  type: ContentType;
  id: number;
}

export default function Content({ type, id }: ContentProps) {
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

  const isMovie = contentDetail?.type === ContentType.MOVIE;

  const { data: collection } = useSWR<Collection>(
    isMovie &&
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

  const certification = isMovie
    ? contentDetail.release_dates?.results
        ?.find(result => result.iso_3166_1 === 'KR')
        ?.release_dates?.find(date => date.certification !== '')?.certification
    : contentDetail?.content_ratings?.results?.find(
        result => result.iso_3166_1 === 'KR'
      )?.rating;

  return (
    <Layout title={isMovie ? contentDetail.title : contentDetail?.name} fit>
      <Backdrop src={getTmdbImagePath(contentDetail?.backdrop_path)} />

      <Container>
        <Header>
          <Left>
            <h2>
              {contentDetail ? (
                isMovie ? (
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
                  {isMovie
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

        <PlaySelector contentDetail={contentDetail} />

        <Section>
          <Overview>
            {contentDetail ? contentDetail.overview : <Skeleton count={3} />}
          </Overview>
        </Section>

        <Genres genres={contentDetail?.genres} />

        {!isMovie && <Seasons contentDetail={contentDetail} />}

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
