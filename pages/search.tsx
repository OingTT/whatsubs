import Layout from '@/components/layout/layout';
import PersonCard from '@/components/person-card';
import Slider from '@/components/slider';
import { Movie, TV } from '@/lib/client/interface';
import { searchQueryState } from '@/lib/client/state';
import { Container, Grid, Section } from '@/lib/client/style';
import styled from '@emotion/styled';
import { ContentType } from '@prisma/client';
import { IconCircleXFilled, IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import useSWR from 'swr';

interface Person {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
}

const SearchBox = styled.div`
  width: 100%;
  position: relative;
`;

const Input = styled.input`
  appearance: none;
  width: 100%;
  height: 56px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  background-color: var(--background-light);
  overflow: hidden;
  border-radius: 16px;
  border: none;
  padding: 16px 52px;
  font-weight: bold;
  font-family: inherit;

  @media (max-width: 809px) {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  }
`;

const SearchIcon = styled.label`
  position: absolute;
  top: 16px;
  left: 16px;
`;

const ClearIcon = styled.label`
  position: absolute;
  top: 16px;
  right: 16px;
  color: var(--text-secondary);
  cursor: pointer;
`;

interface SearchForm {
  query: string;
}

export default function Search() {
  const [query, setQuery] = useRecoilState(searchQueryState);
  const [person, setPerson] = useState<Person>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TV[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  const { register, watch, setValue } = useForm<SearchForm>({
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

  return (
    <Layout>
      <Container>
        <SearchBox>
          <SearchIcon htmlFor="query">
            <IconSearch stroke={1.5} />
          </SearchIcon>
          <Input
            id="query"
            type="text"
            {...register('query', {
              onChange: e => {
                setQuery(e.target.value);
              },
            })}
            autoFocus
          />

          <ClearIcon
            htmlFor="query"
            onClick={() => {
              setValue('query', '');
              setQuery('');
            }}
          >
            {watch('query') && <IconCircleXFilled />}
          </ClearIcon>
        </SearchBox>
      </Container>
      <Container fill>
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
      <Container fit>
        <Section>
          <h5>인물</h5>
          <Grid>
            {people.map(person => (
              <PersonCard key={person.id} id={person.id} />
            ))}
          </Grid>
        </Section>
      </Container>
    </Layout>
  );
}

export { getServerSideSession as getServerSideProps } from '@/lib/server/session';
