import Alert from "@/components/alert";
import Radio from "@/components/input/radio";
import Layout from "@/components/layout";
import ExplorePoster from "@/components/poster/explore-poster";
import ProviderSelector from "@/components/provider-selector";
import { MovieDiscover, TVDiscover } from "@/lib/client/interface";
import styled from "@emotion/styled";
import { ContentType, Subscription } from "@prisma/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  gap: 24px;

  @media (min-width: 1200px) {
    width: 984px;
  }

  @media (max-width: 809px) {
    padding: 16px;
    gap: 16px;
  }
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

interface ExploreForm {
  type: ContentType | "TVNETWORK";
}

export default function Review() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const getMovieKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex) => {
      if (subscriptions.map((sub) => sub.providerId).length === 0) return null;
      return `https://api.themoviedb.org/3/discover/movie?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_watch_providers=${subscriptions
        .map((subscription) => subscription.providerId)
        .join(
          "|"
        )}&watch_region=KR&with_watch_monetization_types=flatrate&page=${
        pageIndex + 1
      }`;
    },
    [subscriptions]
  );

  const getTVKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex) => {
      if (subscriptions.map((sub) => sub.providerId).length === 0) return null;
      return `https://api.themoviedb.org/3/discover/tv?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_watch_providers=${subscriptions
        .map((subscription) => subscription.providerId)
        .join(
          "|"
        )}&watch_region=KR&with_watch_monetization_types=flatrate&page=${
        pageIndex + 1
      }`;
    },
    [subscriptions]
  );

  const getTVNetworkKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex) => {
      if (subscriptions.map((sub) => sub.networkId).length === 0) return null;
      return `https://api.themoviedb.org/3/discover/tv?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_networks=${subscriptions
        .map((subscription) => subscription.networkId)
        .join("|")}&page=${pageIndex + 1}`;
    },
    [subscriptions]
  );

  const { data: movie, setSize: setMovieSize } = useSWRInfinite<MovieDiscover>(
    getMovieKey,
    {
      parallel: true,
      revalidateFirstPage: false,
      initialSize: 2,
    }
  );
  const { data: tv, setSize: setTVSize } = useSWRInfinite<TVDiscover>(
    getTVKey,
    {
      parallel: true,
      revalidateFirstPage: false,
      initialSize: 2,
    }
  );
  const { data: tvNetwork, setSize: setTVNetworkSize } =
    useSWRInfinite<TVDiscover>(getTVNetworkKey, {
      parallel: true,
      revalidateFirstPage: false,
      initialSize: 2,
    });
  const { register, watch } = useForm<ExploreForm>({
    defaultValues: {
      type: ContentType.MOVIE,
    },
  });

  const loader = useRef<HTMLDivElement>(null);

  // Load more when the loader is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
      },
      { rootMargin: "800px" }
    );

    const ref = loader.current;

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [setMovieSize, setTVNetworkSize, setTVSize, watch]);

  const handleChange = useCallback((subscriptions: Subscription[]) => {
    setSubscriptions(subscriptions);
  }, []);

  return (
    <Layout title="탐색">
      <Wrapper>
        <Alert>티빙 / 쿠팡플레이는 현재 일부 TV 콘텐츠만 지원해요.</Alert>
        <ProviderSelector onChange={handleChange} />
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
                return page.results.map((movie) => {
                  movie.type = ContentType.MOVIE;
                  return <ExplorePoster key={movie.id} content={movie} />;
                });
              })
            : watch("type") === ContentType.TV
            ? tv?.map((page) => {
                return page.results.map((tv) => {
                  tv.type = ContentType.TV;
                  return <ExplorePoster key={tv.id} content={tv} />;
                });
              })
            : tvNetwork?.map((page) => {
                return page.results.map((tv) => {
                  tv.type = ContentType.TV;
                  return <ExplorePoster key={tv.id} content={tv} />;
                });
              })}
        </Grid>
        <div ref={loader} />
      </Wrapper>
    </Layout>
  );
}
