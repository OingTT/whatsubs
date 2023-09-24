import Layout from '@/components/layout/layout';
import Placeholder from '@/components/placeholder';
import Slider from '@/components/slider';
import { getKoreanDepartment, getKoreanName } from '@/lib/client/api';
import { Person } from '@/lib/client/interface';
import { Container } from '@/lib/client/style';
import styled from '@emotion/styled';
import { ContentType } from '@prisma/client';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { authOptions } from '../api/auth/[...nextauth]';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;

  @media (max-width: 809px) {
    gap: 16px;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 168px;
  height: 252px;
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--secondary);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.25);

  @media (max-width: 809px) {
    width: 120px;
    height: 180px;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0px 16px 0px;

  @media (max-width: 809px) {
    padding: 8px 0px 8px 0px;
  }
`;

const Texts = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Subtitle = styled.h5`
  color: var(--text-secondary);
`;

const Links = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
`;

interface PersonProfileProps {
  id: number;
}

const fetchTranslation = async (name: string) => {
  const response = await fetch(`/api/translate/${encodeURIComponent(name)}`);
  const data = await response.json();
  return data.translatedText || '';
};

export default function PersonProfile({ id }: PersonProfileProps) {
  const { data } = useSWR<Person>(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=external_ids,combined_credits&language=ko-KR`
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: translatedName } = useSWRImmutable(
    data && !getKoreanName(data) && data.name,
    fetchTranslation
  );

  return (
    <Layout>
      <Container>
        <Wrapper>
          <ImageWrapper>
            <Image
              src={'https://image.tmdb.org/t/p/w342' + data?.profile_path}
              alt="Profile"
              priority
              fill
              unoptimized
              onLoadingComplete={() => setIsLoaded(true)}
            />
            <Placeholder isLoaded={isLoaded} />
          </ImageWrapper>
          <Right>
            <Texts>
              <h2>
                {data ? (
                  getKoreanName(data) || translatedName || data.name
                ) : (
                  <Skeleton width={120} />
                )}
              </h2>
              <Subtitle>
                {data ? (
                  getKoreanDepartment(data.known_for_department)
                ) : (
                  <Skeleton width={40} />
                )}
              </Subtitle>
            </Texts>
            <Links>
              {data?.external_ids.facebook_id && (
                <a
                  href={`https://www.facebook.com/${data.external_ids.facebook_id}`}
                  target="_blank"
                >
                  <IconBrandFacebook stroke={1.5} />
                </a>
              )}
              {data?.external_ids.instagram_id && (
                <a
                  href={`https://www.instagram.com/${data.external_ids.instagram_id}`}
                  target="_blank"
                >
                  <IconBrandInstagram stroke={1.5} />
                </a>
              )}
              {data?.external_ids.twitter_id && (
                <a
                  href={`https://www.twitter.com/${data.external_ids.twitter_id}`}
                  target="_blank"
                >
                  <IconBrandX stroke={1.5} />
                </a>
              )}
              {data?.external_ids.tiktok_id && (
                <a
                  href={`https://www.tiktok.com/@${data.external_ids.tiktok_id}`}
                  target="_blank"
                >
                  <IconBrandTiktok stroke={1.5} />
                </a>
              )}
              {data?.external_ids.youtube_id && (
                <a
                  href={`https://www.youtube.com/channel/${data.external_ids.youtube_id}`}
                  target="_blank"
                >
                  <IconBrandYoutube stroke={1.5} />
                </a>
              )}
            </Links>
          </Right>
        </Wrapper>
      </Container>
      <Container fill>
        <Slider
          title="출연"
          contents={data?.combined_credits.cast.map(content => ({
            type: content.media_type.toUpperCase() as ContentType,
            id: content.id,
          }))}
        />
        <Slider
          title="연출"
          contents={data?.combined_credits.crew.map(content => ({
            type: content.media_type.toUpperCase() as ContentType,
            id: content.id,
          }))}
        />
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session: JSON.parse(JSON.stringify(session)),
      id: Number(context.query.id),
    },
  };
};
