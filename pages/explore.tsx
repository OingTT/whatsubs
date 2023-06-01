import Alert from "@/components/alert";
import Radio from "@/components/input/radio";
import Layout from "@/components/layout/layout";
import ExplorePoster from "@/components/poster/explore-poster";
import SubsSelector from "@/components/subs-selector";
import {
  Certifications,
  DiscoverMovie,
  DiscoverTV,
  ExploreForm,
  Genres,
} from "@/lib/client/interface";
import { checkedSubsState, expolreFormState } from "@/lib/client/state";
import { Grid } from "@/lib/client/style";
import styled from "@emotion/styled";
import { ContentType } from "@prisma/client";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteKeyLoader,
} from "swr/infinite";
import useSWR from "swr";
import CheckButton from "@/components/input/check-button";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

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

const Filters = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 24px 0px 24px;
  overflow: auto;
  gap: 8px;

  @media (min-width: 1200px) {
    width: 984px;
  }

  @media (max-width: 809px) {
    padding: 0px 16px 0px 16px;
  }
`;

const Options = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
`;

const swrInfiniteConfig: SWRInfiniteConfiguration = {
  parallel: true,
  revalidateFirstPage: false,
  initialSize: 2,
};

export default function Review() {
  const { data: movieGenres } = useSWR<Genres>(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );
  const { data: tvGenres } = useSWR<Genres>(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );
  const { data: movieCertifications } = useSWR<Certifications>(
    `https://api.themoviedb.org/3/certification/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );

  const krMovieCertifications = movieCertifications?.certifications.KR?.slice(
    0,
    -1
  );

  const subscriptions = useRecoilValue(checkedSubsState);
  const [state, setState] = useRecoilState(expolreFormState);

  const handleResetFilters = () => {
    setValue("filters", []);
    setValue("movieGenres", []);
    setValue("tvGenres", []);
    setValue("movieCertifications", []);
    setState({
      ...state,
      filters: [],
      movieGenres: [],
      tvGenres: [],
      movieCertifications: [],
    });
  };

  const getMovieKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex) => {
      if (subscriptions.filter((sub) => sub.providerId).length === 0)
        return null;
      return `https://api.themoviedb.org/3/discover/movie?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_watch_providers=${subscriptions
        .map((subscription) => subscription.providerId)
        .join("|")}&watch_region=KR&with_genres=${state.movieGenres.join(",")}
      &certification_country=KR&certification=${state.movieCertifications.join(
        "|"
      )}&with_watch_monetization_types=flatrate&page=${pageIndex + 1}`;
    },
    [state.movieCertifications, state.movieGenres, subscriptions]
  );

  const getTVKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex) => {
      if (subscriptions.filter((sub) => sub.providerId).length === 0)
        return null;
      return `https://api.themoviedb.org/3/discover/tv?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_watch_providers=${subscriptions
        .map((subscription) => subscription.providerId)
        .join("|")}&watch_region=KR&with_genres=${state.tvGenres.join(
        ","
      )}&with_watch_monetization_types=flatrate&page=${pageIndex + 1}`;
    },
    [state.tvGenres, subscriptions]
  );

  const getTVNetworkKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex) => {
      if (subscriptions.filter((sub) => sub.networkId).length === 0)
        return null;
      return `https://api.themoviedb.org/3/discover/tv?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_genres=${state.tvGenres.join(
        ","
      )}&with_networks=${subscriptions
        .map((subscription) => subscription.networkId)
        .join("|")}&page=${pageIndex + 1}`;
    },
    [state.tvGenres, subscriptions]
  );

  const { data: movie, setSize: setMovieSize } = useSWRInfinite<DiscoverMovie>(
    getMovieKey,
    swrInfiniteConfig
  );
  const { data: tv, setSize: setTVSize } = useSWRInfinite<DiscoverTV>(
    getTVKey,
    swrInfiniteConfig
  );
  const { data: tvNetwork, setSize: setTVNetworkSize } =
    useSWRInfinite<DiscoverTV>(getTVNetworkKey, swrInfiniteConfig);

  const { register, watch, setValue } = useForm<ExploreForm>({
    defaultValues: {
      type: state.type,
      filters: state.filters,
      movieGenres: state.movieGenres,
      tvGenres: state.tvGenres,
      movieCertifications: state.movieCertifications,
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

  return (
    <Layout title="탐색">
      <Wrapper>
        <Alert>티빙 ・ 쿠팡플레이는 현재 일부 TV 콘텐츠만 지원해요.</Alert>
        <Alert>
          평점을 남겨주세요. 포스터 클릭 → 체크(봤어요) 클릭 → 평점 남기기
        </Alert>
        <SubsSelector />
        <Radio
          register={register("type", {
            required: true,
            onChange: () => setState({ ...state, type: watch("type") }),
          })}
          ids={[ContentType.MOVIE, ContentType.TV, "TVNETWORK"]}
          labels={["영화", "TV 프로그램", "TV(티빙 ・ 쿠플)"]}
          required
        />
      </Wrapper>
      <Filters>
        <CheckButton
          register={register("filters", {
            onChange: (e) => {
              if (watch("filters").length === 2) {
                setValue("filters", [e.target.value]);
              }
              setState({ ...state, filters: watch("filters") });
            },
          })}
          id={0}
        >
          {watch("type") === ContentType.MOVIE
            ? watch("movieGenres")
                .map(
                  (genreId) =>
                    movieGenres?.genres.find(
                      (genre) => genre.id === Number(genreId)
                    )?.name
                )
                .join(" ・ ") || "장르"
            : watch("tvGenres")
                .map(
                  (genreId) =>
                    tvGenres?.genres.find(
                      (genre) => genre.id === Number(genreId)
                    )?.name
                )
                .join(" ・ ") || "장르"}
        </CheckButton>
        {watch("type") === ContentType.MOVIE && (
          <CheckButton
            register={register("filters", {
              onChange: (e) => {
                if (watch("filters").length === 2) {
                  setValue("filters", [e.target.value]);
                }
                setState({ ...state, filters: watch("filters") });
              },
            })}
            id={1}
          >
            {watch("movieCertifications")
              .map(
                (certification) =>
                  krMovieCertifications?.find(
                    (cert) => cert.certification === certification
                  )?.certification
              )
              .join(" ・ ") || "관람등급"}
          </CheckButton>
        )}
        <ArrowCounterClockwise size={32} onClick={handleResetFilters} />
      </Filters>

      <Wrapper>
        <Options>
          {watch("filters")?.includes("0") &&
            (watch("type") === ContentType.MOVIE
              ? movieGenres?.genres.map((genre) => (
                  <CheckButton
                    key={genre.id}
                    register={register("movieGenres", {
                      onChange: () =>
                        setState({
                          ...state,
                          movieGenres: watch("movieGenres"),
                        }),
                    })}
                    id={genre.id}
                  >
                    {genre.name}
                  </CheckButton>
                ))
              : tvGenres?.genres.map((tvGenre) => (
                  <CheckButton
                    key={tvGenre.id}
                    register={register("tvGenres", {
                      onChange: () =>
                        setState({ ...state, tvGenres: watch("tvGenres") }),
                    })}
                    id={tvGenre.id}
                  >
                    {tvGenre.name}
                  </CheckButton>
                )))}
          {watch("filters")?.includes("1") &&
            watch("type") === ContentType.MOVIE &&
            krMovieCertifications?.map((certification) => (
              <CheckButton
                key={certification.certification}
                register={register("movieCertifications", {
                  onChange: () =>
                    setState({
                      ...state,
                      movieCertifications: watch("movieCertifications"),
                    }),
                })}
                id={certification.certification}
              >
                {certification.certification}
              </CheckButton>
            ))}
        </Options>

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
