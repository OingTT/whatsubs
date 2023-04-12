import Layout from "@/components/layout";
import ReviewPoster from "@/components/review-poster";
import { MovieDiscover, watchProviders } from "@/lib/client/interface";
import styled from "@emotion/styled";
import { useEffect, useRef } from "react";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";

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

  @media (max-width: 810px) {
    padding: 16px;
    gap: 16px;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-rows: min-content;
  gap: 24px;

  @media (max-width: 810px) {
    gap: 16px;
  }
`;

const Loader = styled.div`
  position: absolute;
  bottom: 800px;
`;

const getKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.results.length) return null;
  return `https://api.themoviedb.org/3/discover/movie?api_key=${
    process.env.NEXT_PUBLIC_TMDB_API_KEY
  }&language=ko-KR&region=KR&with_watch_providers=${Object.values(
    watchProviders
  )
    .map((watchProvider) => watchProvider.id)
    .join("|")}&watch_region=KR&with_watch_monetization_types=flatrate&page=${
    pageIndex + 1
  }`;
};

export default function Review() {
  const { data, setSize } = useSWRInfinite<MovieDiscover>(getKey, {
    revalidateFirstPage: false,
  });

  const loader = useRef<HTMLDivElement>(null);

  // Load more when the loader is visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log("scroll");
        setSize((size) => size + 1);
      }
    });
    const ref = loader.current;

    if (ref) observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [setSize]);

  return (
    <Layout>
      <Wrapper>
        <Header>
          <h1>콘텐츠를 평가해주세요.</h1>
        </Header>

        <Grid>
          {data?.map((page) => {
            return page.results.map((movie) => (
              <ReviewPoster key={movie.id} movie={movie} />
            ));
          })}
        </Grid>
        <Loader ref={loader} />
      </Wrapper>
    </Layout>
  );
}
