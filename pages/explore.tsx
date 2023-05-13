import Radio from "@/components/input/radio";
import Layout from "@/components/layout";
import ExplorePoster from "@/components/poster/explore-poster";
import ProviderSelector from "@/components/provider-selector";
import { MovieDiscover, TVDiscover } from "@/lib/client/interface";
import styled from "@emotion/styled";
import { ContentType, Subscription } from "@prisma/client";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
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

  @media (max-width: 809px) {
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

  @media (max-width: 809px) {
    gap: 16px;
  }
`;

const Loader = styled.div`
  position: absolute;
  bottom: 800px;
`;

interface ExploreForm {
  type: ContentType | "TVNETWORK";
}

export default function Review() {
  const getMovieKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.results.length) return null;
    if (!subscriptions) return null;
    return `https://api.themoviedb.org/3/discover/movie?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=ko-KR&region=KR&with_watch_providers=${subscriptions
      .map((subscription) => subscription.providerId)
      .join("|")}&watch_region=KR&with_watch_monetization_types=flatrate&page=${
      pageIndex + 1
    }`;
  };

  const getTVKey: SWRInfiniteKeyLoader = (pageIndex, previousPageData) => {
    if (previousPageData && !previousPageData.results.length) return null;
    if (!subscriptions) return null;
    return `https://api.themoviedb.org/3/discover/tv?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=ko-KR&with_watch_providers=${subscriptions
      .map((subscription) => subscription.providerId)
      .join("|")}&watch_region=KR&with_watch_monetization_types=flatrate&page=${
      pageIndex + 1
    }`;
  };

  const getTVNetworkKey: SWRInfiniteKeyLoader = (
    pageIndex,
    previousPageData
  ) => {
    if (previousPageData && !previousPageData.results.length) return null;
    if (!subscriptions) return null;
    return `https://api.themoviedb.org/3/discover/tv?api_key=${
      process.env.NEXT_PUBLIC_TMDB_API_KEY
    }&language=ko-KR&with_networks=${subscriptions
      .map((subscription) => subscription.networkId)
      .join("|")}&page=${pageIndex + 1}`;
  };

  const { data: subscriptions } = useSWR<Subscription[]>("/api/subscriptions");
  const { data: movie, setSize: setMovieSize } = useSWRInfinite<MovieDiscover>(
    getMovieKey,
    {
      revalidateFirstPage: false,
    }
  );
  const { data: tv, setSize: setTVSize } = useSWRInfinite<TVDiscover>(
    getTVKey,
    {
      revalidateFirstPage: false,
    }
  );
  const { data: tvNetwork, setSize: setTVNetworkSize } =
    useSWRInfinite<TVDiscover>(getTVNetworkKey, {
      revalidateFirstPage: false,
    });
  const { register, watch } = useForm<ExploreForm>({
    defaultValues: {
      type: ContentType.MOVIE,
    },
  });

  const loader = useRef<HTMLDivElement>(null);

  // Load more when the loader is visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log("scroll");
        switch (watch("type")) {
          case ContentType.MOVIE:
            setMovieSize((prev) => prev + 1);
            break;
          case ContentType.TV:
            setTVSize((prev) => prev + 1);
            break;
          case "TVNETWORK":
            setTVNetworkSize((prev) => prev + 1);
            break;
        }
      }
    });
    const ref = loader.current;

    if (ref) observer.observe(ref);

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [setMovieSize, setTVNetworkSize, setTVSize, watch]);

  return (
    <Layout title="탐색">
      <Wrapper>
        <ProviderSelector />
        <Radio
          register={register("type", { required: true })}
          ids={[ContentType.MOVIE, ContentType.TV, "TVNETWORK"]}
          labels={["영화", "TV 프로그램", "TV(티빙/쿠플)"]}
          required
        />
      </Wrapper>
      <Wrapper>
        <Grid>
          {watch("type") === ContentType.MOVIE
            ? movie?.map((page) => {
                return page.results.map((movie) => (
                  <ExplorePoster key={movie.id} content={movie} />
                ));
              })
            : watch("type") === ContentType.TV
            ? tv?.map((page) => {
                return page.results.map((tv) => (
                  <ExplorePoster key={tv.id} content={tv} />
                ));
              })
            : tvNetwork?.map((page) => {
                return page.results.map((tv) => (
                  <ExplorePoster key={tv.id} content={tv} />
                ));
              })}
        </Grid>
        <Loader ref={loader} />
      </Wrapper>
    </Layout>
  );
}
