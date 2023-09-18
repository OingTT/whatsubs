import { MovieDetail, TVDetail } from '@/lib/client/interface';
import styled from '@emotion/styled';
import { ContentType } from '@prisma/client';
import { Variants, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

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

const Placeholder = styled(motion.h6)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #eeeeee;
  padding: 16px;
  text-align: center;
`;

interface PosterProps {
  type: ContentType;
  id: number;
}

const placeholderVariants: Variants = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 0,
  },
};

export default function Poster({ type, id }: PosterProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { data } = useSWR<MovieDetail | TVDetail>(
    `https://api.themoviedb.org/3/${type.toLowerCase()}/${id}?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=ko-KR`
  );

  useEffect(() => {
    if (!data?.poster_path) {
      setIsLoaded(false);
    }
  }, [data]);

  return (
    <Link href={`/contents/${type.toLowerCase()}/${id}`}>
      <Wrapper>
        {data?.poster_path && (
          <Image
            src={'https://image.tmdb.org/t/p/w342' + data?.poster_path}
            fill
            alt="Poster"
            priority
            unoptimized
            onLoadingComplete={() => setIsLoaded(true)}
          />
        )}
        <Placeholder
          variants={placeholderVariants}
          initial="initial"
          animate={isLoaded ? 'animate' : 'initial'}
        >
          {data &&
            !data.poster_path &&
            ('title' in data ? data.title : data.name)}
        </Placeholder>
      </Wrapper>
    </Link>
  );
}
