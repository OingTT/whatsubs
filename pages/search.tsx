import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { useForm } from "react-hook-form";
import { MagnifyingGlass } from "@phosphor-icons/react";
import Slider from "@/components/slider";
import { ContentType } from "@prisma/client";
import { Grid } from "@/lib/client/style";
import Person from "@/components/person";
import useSWR from "swr";
import { Movie, TV } from "@/lib/client/interface";
import { useRecoilState } from "recoil";
import { searchQueryState } from "@/lib/client/state";

interface Person {
  id: number;
  name: string;
  profile_path: string;
  known_for_department: string;
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  gap: 24px;
  position: relative;

  @media (min-width: 1200px) {
    width: 984px;
  }

  @media (max-width: 809px) {
    padding: 16px;
    gap: 16px;
  }
`;

const SearchBox = styled.div`
  width: 100%;
  position: relative;
`;

const Input = styled.input`
  appearance: none;
  width: 100%;
  height: 56px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
  border-radius: 16px;
  border: none;
  padding: 16px;
  padding-right: 56px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  font-family: inherit;
`;

const SearchIcon = styled.label`
  position: absolute;
  top: 16px;
  right: 16px;
`;

const People = styled.div`
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

interface SearchForm {
  query: string;
}

export default function Search() {
  const [query, setQuery] = useRecoilState(searchQueryState);
  const [person, setPerson] = useState<Person>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TV[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  const { register, watch } = useForm<SearchForm>({
    defaultValues: {
      query: query,
    },
  });

  const { data: moviesData } = useSWR(
    `https://api.themoviedb.org/3/search/movie?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=ko-KR&query=${watch("query")}`
  );

  const { data: tvShowsData } = useSWR(
    `https://api.themoviedb.org/3/search/tv?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=ko-KR&query=${watch("query")}`
  );

  const { data: peopleData } = useSWR(
    `https://api.themoviedb.org/3/search/person?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=ko-KR&query=${watch("query")}`
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
      <Wrapper>
        <SearchBox>
          <Input
            id="query"
            type="text"
            {...register("query", {
              onChange: (e) => {
                setQuery(e.target.value);
              },
            })}
          />
          <SearchIcon htmlFor="query">
            <MagnifyingGlass size={24} color="#333" />
          </SearchIcon>
        </SearchBox>
      </Wrapper>
      <Slider
        title="영화"
        contents={movies.map((movie) => ({
          type: ContentType.MOVIE,
          id: movie.id,
        }))}
      />
      <Slider
        title="TV 프로그램"
        contents={tvShows.map((tvShow) => ({
          type: ContentType.TV,
          id: tvShow.id,
        }))}
      />
      <People>
        <GroupTitle>인물</GroupTitle>
        <Grid>
          {people.map((person) => (
            <Person
              key={person.id}
              id={person.id}
              name={person.name}
              info={person.known_for_department}
              profilePath={person.profile_path}
            />
          ))}
        </Grid>
      </People>
    </Layout>
  );
}
