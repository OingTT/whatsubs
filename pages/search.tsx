import axios from "axios";
import styled from "@emotion/styled";
import { useState } from "react";
import Layout from "@/components/layout";

interface Movie {
  id: number;
  title: string;
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
  width: 640px;
  height: 40px;
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;

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

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSearchTermChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchTerm}`;
    const response = await axios.get(url);
    setMovies(response.data.results);
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
        <MovieList>
          {movies.map((movie) => (
            <MovieItem key={movie.id}>
              <Poster
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              />
              <Title>{movie.title}</Title>
            </MovieItem>
          ))}
        </MovieList>
      </Wrapper>
    </Layout>
  );
}
