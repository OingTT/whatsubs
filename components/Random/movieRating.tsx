import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { makeImagePath } from "./util";

const API_KEY = "d238c45f06327ae8e6b021ac09482bf8";

interface SetData {
  id: number;
  title: string;
  poster_path: string;
}

const Li = styled.li`
  width: 600px;
  height: 135px;
  list-style: none;
`;
const Poster = styled.img`
  width: 76px;
  height: 110px;
  float: left;
`;
const Box = styled.div`
  width: 508px;
  height: 106px;
  float: right;
`;

export default function MovieRating() {
  const [movies, setMovies] = useState<SetData[]>([]);
  const getRandom = () => Math.floor(Math.random() * (500 - 1) + 1);
  const getMovies = async () => {
    const { results } = await (
      await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=${getRandom()}`
      )
    ).json();
    setMovies(results);
  };
  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div>
      {movies?.map((movie) => (
        <Li key={movie.id}>
          <Poster src={makeImagePath(movie.poster_path, "w200")} />
          <Box>
            <h3>{movie.title}</h3>
          </Box>
        </Li>
      ))}
    </div>
  );
}
