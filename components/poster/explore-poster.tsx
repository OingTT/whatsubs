import { Movie, TV } from '@/lib/client/interface';
import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { Variants, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import WatchSelector from '../watch-selector';
import useSWR from 'swr';
import { ContentType, Review } from '@prisma/client';
import React from 'react';

const Wrapper = styled(motion.div)`
  aspect-ratio: 2/3;
  position: relative;
  perspective: 800px;
  user-select: none;
  will-change: transform;
  word-break: keep-all;
`;

const Front = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;

  @media (max-width: 809px) {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.25);
  }
`;

const Placeholder = styled.div`
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
  line-height: 1.4;
  font-size: 16px;
  font-weight: 600;
`;

const Back = styled(Front)`
  transform: rotateY(180deg);
  background-color: var(--background-light);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  font-weight: 500;
  white-space: pre-line;
  line-height: 1.2;

  @media (max-width: 809px) {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  }
`;

const Content = styled.div`
  padding: 16px;
`;

const Title = styled.h6`
  font-weight: 500;
`;

const Subtitle = styled.div`
  font-size: 0.875rem; // 14px
  color: var(--text-secondary);
`;

const frontVariants: Variants = {
  visible: { rotateY: 0 },
  hidden: { rotateY: 180 },
};

const backVariants: Variants = {
  visible: { rotateY: 0 },
  hidden: { rotateY: -180 },
};

const wrapperVariants: Variants = {
  visible: {
    opacity: 1,
    transform: 'scale(1)',
  },
  hidden: {
    opacity: 0,
    transform: 'scale(0.5)',
  },
};

interface ExplorePosterProps {
  content: Movie | TV;
}

export default React.memo(function ExplorePoster({
  content,
}: ExplorePosterProps) {
  const { data } = useSWR<Review[]>('/api/users/me/reviews');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Flip when data is loaded
  useEffect(() => {
    setIsFlipped(
      data?.find(review => review.contentId === content.id) ? true : false
    );
  }, [content.id, data]);

  // Flip when clicked
  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  // Prevent click event from propagating to parent
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Wrapper
      variants={wrapperVariants}
      initial="hidden"
      whileInView={!content.poster_path || isLoaded ? 'visible' : 'hidden'}
      onClick={handleFlip}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
    >
      {isInView && (
        <>
          <Front
            variants={frontVariants}
            initial="visible"
            animate={isFlipped ? 'hidden' : 'visible'}
          >
            {content.poster_path ? (
              <Image
                src={'https://image.tmdb.org/t/p/w342' + content.poster_path}
                fill
                alt="Poster"
                priority
                unoptimized
                onLoadingComplete={() => setIsLoaded(true)}
              />
            ) : (
              <Placeholder>
                {content.type === ContentType.MOVIE
                  ? content.title
                  : content.name}
              </Placeholder>
            )}
          </Front>
          <Back
            variants={backVariants}
            initial="hidden"
            animate={isFlipped ? 'visible' : 'hidden'}
          >
            <Content onClick={handleClick}>
              <WatchSelector type={content.type} id={content.id} small />
            </Content>

            <Content onClick={handleClick}>
              <Link
                href={`/contents/${content.type.toLowerCase()}/${content.id}`}
              >
                {content.type === ContentType.MOVIE && (
                  <>
                    <Title>{content.title.split(': ')[0]}</Title>
                    <Subtitle>{content.title.split(': ')[1]}</Subtitle>
                  </>
                )}
                {content.type === ContentType.TV && (
                  <>
                    <Title>{content.name.split(': ')[0]}</Title>
                    <Subtitle>{content.name.split(': ')[1]}</Subtitle>
                  </>
                )}
              </Link>
            </Content>
          </Back>
        </>
      )}
    </Wrapper>
  );
});
