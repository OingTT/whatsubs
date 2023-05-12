import { MovieDetail } from "@/lib/client/interface";
import styled from "@emotion/styled";
import { ContentType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const Wrapper = styled.div`
  min-width: 168px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.25);
  aspect-ratio: 2/3;
  border-radius: 16px;
  position: relative;
  overflow: hidden;

  @media (max-width: 809px) {
    min-width: 120px;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  }
`;

interface PosterProps {
  type: ContentType;
  id: number;
}

export default function Poster({ type, id }: PosterProps) {
  const { data } = useSWR<MovieDetail>(
    `https://api.themoviedb.org/3/${type.toLowerCase()}/${id}?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=ko-KR`
  );

  return (
    <Link href={`/${type.toLowerCase()}/${id}`}>
      <Wrapper>
        {data && (
          <Image
            src={"https://image.tmdb.org/t/p/w342" + data?.poster_path}
            fill
            alt="Poster"
            priority
            unoptimized
          />
        )}
      </Wrapper>
    </Link>
  );
}
