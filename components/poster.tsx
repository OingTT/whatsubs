import { Movie } from "@/lib/client/interface";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";

const Wrapper = styled.div`
  min-width: 168px;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.25);
  background-color: #333333;
  aspect-ratio: 2/3;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  z-index: -1;

  @media (max-width: 810px) {
    min-width: 120px;
  }
`;

interface PosterProps {
  data: Movie;
}

export default function Poster({ data }: PosterProps) {
  return (
    <Link href={`/movie/${data.id}`}>
      <Wrapper>
        <Image
          src={"https://image.tmdb.org/t/p/w500/" + data.poster_path}
          fill
          sizes="(max-width: 810px) 120px, 168px"
          alt="Poster"
        />
      </Wrapper>
    </Link>
  );
}
