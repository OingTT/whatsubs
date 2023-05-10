import axios from "axios";
import styled from "@emotion/styled";
import { useState } from "react";
import Layout from "@/components/layout";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface Actor {
  id: number;
  name: string;
}

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
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
  display: flex;
  align-items: center;
`;
const Input = styled.input`
  box-sizing: border-box;
  flex-shrink: 0;
  width: 640px;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 16px 16px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  overflow: hidden;
  flex: 1 0 0px;
  position: relative;
  align-content: center;
  flex-wrap: nowrap;

  &:focus {
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const MovieList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 1rem;
  list-style: none;
  margin: 2rem 0;
  padding: 0;
`;

const MovieItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Poster = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1rem;
  text-align: center;
  margin: 0;
`;

const ActorInfo = styled.div`
  margin-top: 20px;
  font-size: 18px;
`;

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    const searchMovieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&region=KR&query=${searchTerm}`;
    const searchActorUrl = `https://api.themoviedb.org/3/search/person?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&region=KR&query=${searchTerm}`;
    const searchTVShowUrl = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&region=KR&query=${searchTerm}`;

    const [actorResponse, movieResponse, tvShowResponse] = await Promise.all([
      axios.get(searchActorUrl),
      axios.get(searchMovieUrl),
      axios.get(searchTVShowUrl),
    ]);

    const actorData = actorResponse.data.results[0];
    if (actorData) {
      const actorInfo: Actor = {
        id: actorData.id,
        name: actorData.name,
      };
      setActor(actorInfo);
      fetchMovies(actorInfo.id);
      fetchTVShows(actorInfo.id);
    } else {
      setActor(null);
      setMovies([]);
      setTVShows([]);
    }
    const movieData = movieResponse.data.results;
    setMovies(movieData);

    const tvShowData = tvShowResponse.data.results;
    setTVShows(tvShowData);
  };

  const fetchMovies = async (actorId: number) => {
    const url = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&region=KR`;
    const response = await axios.get(url);
    setMovies(response.data.cast);
  };

  const fetchTVShows = async (actorId: number) => {
    const url = `https://api.themoviedb.org/3/person/${actorId}/tv_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&region=KR`;
    const response = await axios.get(url);
    setTVShows(response.data.cast);
  };

  return (
    <Layout>
      <Wrapper>
        <SearchBox>
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          <Button onClick={handleSearch}>검색</Button>
        </SearchBox>
        {actor && <h3>{actor.name}</h3>}
        <MovieList>
          <h2>영화</h2>
          {movies.map((movie) => (
            <MovieItem key={movie.id}>
              <Poster
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              />
              <Title>{movie.title}</Title>
            </MovieItem>
          ))}
        </MovieList>
        <MovieList>
          <h2>tv</h2>
          {tvShows.map((tvShow) => (
            <MovieItem key={tvShow.id}>
              <Poster
                src={`https://image.tmdb.org/t/p/w200${tvShow.poster_path}`}
              />
              <Title>{tvShow.name}</Title>
            </MovieItem>
          ))}
        </MovieList>
      </Wrapper>
    </Layout>
  );
}
