import Layout from '@/components/layout/layout';
import { Person, Movie, TV } from '@/lib/client/interface';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import useSWR from 'swr';
import { authOptions } from '../api/auth/[...nextauth]';
import styled from '@emotion/styled';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Slider from '@/components/slider';
import { ContentType } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { searchQueryState } from '@/lib/client/state';
import { Container } from '@/lib/client/style';
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandFacebook,
} from '@tabler/icons-react';

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  aspect-ratio: 2/1;
  //cursor: pointer;
`;

const Texts = styled.div`
  flex: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 8px 0px 8px 12px;
  gap: 4px;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 50px;
`;

const Info = styled.div`
  font-weight: 500;
  font-size: 50px;
`;

interface SearchForm {
  query: string;
}

function checkKor(str: string) {
  const regExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g;
  if (regExp.test(str)) {
    return true;
  } else {
    return false;
  }
}

function getKoreanName(data: Person) {
  if (checkKor(data.name)) {
    return data.name;
  }
  const koreanName = data.also_known_as.find(name => checkKor(name));
  if (koreanName) {
    return koreanName;
  }

  return data.name;
}

function getKoreanDepartment(department: string) {
  if (department === 'Acting') {
    return '배우';
  } else if (department === 'Directing') {
    return '감독';
  } else if (department === 'Production') {
    return '제작';
  }
  return department;
}

export default function PersonProfile({
  id,
  name,
  profile_path,
  known_for_department,
}: Person) {
  const [query, setQuery] = useRecoilState(searchQueryState);
  const [person, setPerson] = useState<Person>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TV[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const { data: data } = useSWR<Person>(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=external_ids&language=ko-KR`
  );

  const { watch } = useForm<SearchForm>({
    defaultValues: {
      query: query,
    },
  });
  const { data: moviesData } = useSWR(
    `https://api.themoviedb.org/3/search/movie?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=ko-KR&query=${watch('query')}`
  );

  const { data: tvShowsData } = useSWR(
    `https://api.themoviedb.org/3/search/tv?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=ko-KR&query=${watch('query')}`
  );

  const { data: peopleData } = useSWR(
    `https://api.themoviedb.org/3/search/person?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=ko-KR&query=${watch('query')}`
  );

  const { data: personMovies } = useSWR(
    person &&
      `https://api.themoviedb.org/3/person/${person.id}/movie_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );

  const { data: personTVShows } = useSWR(
    person &&
      `https://api.themoviedb.org/3/person/${person.id}/tv_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );
  useEffect(() => {
    if (moviesData) {
      setMovies(moviesData.results);
    }
  }, [moviesData]);

  useEffect(() => {
    if (tvShowsData) {
      setTVShows(tvShowsData.results);
    }
  }, [tvShowsData]);

  useEffect(() => {
    if (peopleData) {
      setPeople(peopleData.results);
    }
  }, [peopleData]);

  useEffect(() => {
    if (people.length === 1) {
      setPerson(people[0]);
    } else {
      setPerson(undefined);
    }
  }, [people]);

  useEffect(() => {
    if (personMovies && movies.length === 0) {
      setMovies(personMovies.cast);
    }
  }, [movies.length, personMovies]);

  useEffect(() => {
    if (personTVShows && tvShows.length === 0) {
      setTVShows(personTVShows.cast);
    }
  }, [personTVShows, tvShows.length]);

  console.log(data?.external_ids.instagram_id);

  return (
    <Layout>
      <Container>
        <Wrapper>
          <Image
            src={
              (profile_path = `https://image.tmdb.org/t/p/w154${data?.profile_path}`)
            }
            alt={name}
            priority
            unoptimized
            width={168}
            height={252}
          />
          <Texts>
            <Name>{data ? getKoreanName(data) : '...'}</Name>
            <Info>
              {data ? getKoreanDepartment(data.known_for_department) : '...'}
            </Info>
          </Texts>
        </Wrapper>
        <IconBrandTwitter
          size={24}
          cursor={'pointer'}
          onClick={() => {
            if (data?.external_ids?.twitter_id) {
              window.open(
                `https://twitter.com/${data.external_ids.twitter_id}`
              );
            }
          }}
        />
        <IconBrandFacebook
          size={24}
          cursor={'pointer'}
          onClick={() => {
            if (data?.external_ids?.facebook_id) {
              window.open(
                `https://www.facebook.com/${data.external_ids.facebook_id}`
              );
            }
          }}
        />
        <IconBrandTwitter
          size={24}
          cursor={'pointer'}
          onClick={() => {
            if (data?.external_ids?.twitter_id) {
              window.open(
                `https://twitter.com/${data.external_ids.twitter_id}`
              );
            }
          }}
        />
      </Container>
      <Container>
        <Slider
          title="영화"
          contents={movies.map(movie => ({
            type: ContentType.MOVIE,
            id: movie.id,
          }))}
        />
        <Slider
          title="TV 프로그램"
          contents={tvShows.map(tvShow => ({
            type: ContentType.TV,
            id: tvShow.id,
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
