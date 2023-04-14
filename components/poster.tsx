import { MovieDetail } from "@/lib/client/interface";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const Wrapper = styled.div`
  min-width: 168px;
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.25);
  background-color: #333333;
  aspect-ratio: 2/3;
  border-radius: 16px;
  position: relative;
  overflow: hidden;

  @media (max-width: 810px) {
    min-width: 120px;
  }
`;

interface PosterProps {
  id: number;
}

export default function Poster({ id }: PosterProps) {
  const { data } = useSWR<MovieDetail>(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );

  return (
    <Link href={`/movie/${id}`}>
      <Wrapper>
        {data && (
          <Image
            src={"https://image.tmdb.org/t/p/w500/" + data?.poster_path}
            fill
            sizes="(max-width: 810px) 120px, 168px"
            alt="Poster"
          />
        )}
      </Wrapper>
    </Link>
  );
}
