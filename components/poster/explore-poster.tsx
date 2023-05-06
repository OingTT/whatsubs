import { Movie } from "@/lib/client/interface";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { Variants, motion } from "framer-motion";
import { useEffect, useState } from "react";
import WatchSelector from "../watch-selector";
import useSWR from "swr";
import { Review } from "@prisma/client";
import React from "react";

const Wrapper = styled(motion.div)`
  aspect-ratio: 2/3;
  position: relative;
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
`;

const Back = styled(Front)`
  transform: rotateY(180deg);
  background-color: white;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  font-weight: 500;
  color: #333333;
  white-space: pre-line;
  line-height: 1.2;
`;

const Content = styled.div`
  padding: 16px;
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
    scale: 1,
  },
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
};

interface ReviewPosterProps {
  movie: Movie;
}

export default React.memo(function ReviewPoster({ movie }: ReviewPosterProps) {
  const { data } = useSWR<Review[]>("/api/review");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Flip when data is loaded
  useEffect(() => {
    setIsFlipped(
      data?.find((review) => review.movieId === movie.id) ? true : false
    );
  }, [data, movie.id]);

  // Flip when clicked
  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  // Prevent click event from propagating to parent
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Wrapper
      variants={wrapperVariants}
      initial="hidden"
      whileInView="visible"
      onClick={handleFlip}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
    >
      {isInView && (
        <>
          <Front
            variants={frontVariants}
            initial="visible"
            animate={isFlipped ? "hidden" : "visible"}
          >
            <Image
              src={"https://image.tmdb.org/t/p/w342" + movie.poster_path}
              fill
              alt="Poster"
              priority
              unoptimized
            />
          </Front>
          <Back
            variants={backVariants}
            initial="hidden"
            animate={isFlipped ? "visible" : "hidden"}
          >
            <Content onClick={handleClick}>
              <WatchSelector id={movie.id} small />
            </Content>

            <Content onClick={handleClick}>
              <Link href={`/movie/${movie.id}`}>
                {movie.title.includes(":") ? (
                  <>
                    <div>{movie.title.split(": ")[0]}</div>
                    <div style={{ fontSize: 14, color: "#999" }}>
                      {movie.title.split(": ")[1]}
                    </div>
                  </>
                ) : (
                  movie.title
                )}
              </Link>
            </Content>
          </Back>
        </>
      )}
    </Wrapper>
  );
});
