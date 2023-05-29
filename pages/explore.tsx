import Alert from "@/components/alert";
import Radio from "@/components/input/radio";
import Layout from "@/components/layout";
import ExplorePoster from "@/components/poster/explore-poster";
import SubsSelector from "@/components/subs-selector";
import { DiscoverMovie, DiscoverTV } from "@/lib/client/interface";
import {
  certificationState,
  checkedSubsState,
  exploreTypeState,
  genreState,
  tvCertificationState,
  tvGenreState,
} from "@/lib/client/state";
import { Grid } from "@/lib/client/style";
import styled from "@emotion/styled";
import { ContentType, Genre } from "@prisma/client";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import useSWR from "swr";

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

const Columns = styled.div`
  width: 984px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 24px 0px 24px;
  overflow: auto;
  gap: 8px;
`;

const Box = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 24px 0px 24px;
  background-color: #eeeeee;
  border-radius: 8px;
  color: #333;
  white-space: pre;

  @media (max-width: 809px) {
    height: 32px;
    padding: 0px 16px 0px 16px;
    font-size: 12px;
  }
`;

const Label = styled.label`
  cursor: pointer;
`;

const Input = styled.input`
  display: none;

  &:checked ~ div {
    background-color: #000;
    color: #fff;
  }
`;

interface ExploreForm {
  type: ContentType | "TVNETWORK";
  genres: string[];
  tvGenres: string[];
  certifications: string[];
  tvCertifications: string[];
}

interface Genres {
  genres: Genre[];
}

interface tvGenres {
  genres: Array<{
    id: number;
    name: string;
  }>;
}

interface Certification {
  certifications: {
    KR?: Array<{
      certification: string;
      meaning: string;
      order: number;
    }>;
  };
}

// interface TvCertification {
//   certifications: {
//     KR?: Array<{
//       certification: string;
//       meaning: string;
//       order: number;
//     }>;
//   };
// }

export default function Review() {
  const [exploreType, setExploreType] = useRecoilState(exploreTypeState);
  const { data: genres } = useSWR<Genres>(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );
  const { data: tvGenres } = useSWR<tvGenres>(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );

  const { data: certifications } = useSWR<Certification>(
    `https://api.themoviedb.org/3/certification/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );

  // const { data: tvCertifications } = useSWR<TvCertification>(
  //   `https://api.themoviedb.org/3/certification/tv/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  // );

  const subscriptions = useRecoilValue(checkedSubsState);
  const [filter, setFilter] = useRecoilState(genreState);
  const [tvGenreFilter, setTvGenreFilter] = useRecoilState(tvGenreState);
  const [certificationFilter, setCertificationFilter] =
    useRecoilState(certificationState);
  // const [tvCertificationFilter, setTvCertificationFilter] =
  //   useRecoilState(tvCertificationState);

  const getMovieKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex) => {
      if (subscriptions.filter((sub) => sub.providerId).length === 0)
        return null;
      return `https://api.themoviedb.org/3/discover/movie?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_watch_providers=${subscriptions
        .map((subscription) => subscription.providerId)
        .join("|")}&watch_region=KR&with_genres=${filter.join("|")}
      &certification_country=KR&certification=${certificationFilter.join(
        "|"
      )}&with_watch_monetization_types=flatrate&page=${pageIndex + 1}`;
    },
    [subscriptions, filter, certificationFilter]
  );

  const getTVKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex) => {
      if (subscriptions.filter((sub) => sub.providerId).length === 0)
        return null;
      return `https://api.themoviedb.org/3/discover/tv?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_watch_providers=${subscriptions
        .map((subscription) => subscription.providerId)
        .join("|")}&watch_region=KR&with_genres=${tvGenreFilter.join(
        "|"
      )}&with_watch_monetization_types=flatrate&page=${pageIndex + 1}`;
    },
    [subscriptions, tvGenreFilter]
  );

  const getTVNetworkKey: SWRInfiniteKeyLoader = useCallback(
    (pageIndex) => {
      if (subscriptions.filter((sub) => sub.networkId).length === 0)
        return null;
      return `https://api.themoviedb.org/3/discover/tv?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_networks=${subscriptions
        .map((subscription) => subscription.networkId)
        .join("|")}&page=${pageIndex + 1}`;
    },
    [subscriptions]
  );

  const { data: movie, setSize: setMovieSize } = useSWRInfinite<DiscoverMovie>(
    getMovieKey,
    {
      parallel: true,
      revalidateFirstPage: false,
      initialSize: 2,
    }
  );
  const { data: tv, setSize: setTVSize } = useSWRInfinite<DiscoverTV>(
    getTVKey,
    {
      parallel: true,
      revalidateFirstPage: false,
      initialSize: 2,
    }
  );
  const { data: tvNetwork, setSize: setTVNetworkSize } =
    useSWRInfinite<DiscoverTV>(getTVNetworkKey, {
      parallel: true,
      revalidateFirstPage: false,
      initialSize: 2,
    });
  const { register, watch } = useForm<ExploreForm>({
    defaultValues: {
      type: exploreType,
      genres: filter,
      tvGenres: filter,
      certifications: certificationFilter,
      // tvCertifications: tvCertificationFilter,
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

  const krMovieCertifications = certifications?.certifications.KR;
  // const krTvCertifications = tvCertifications?.certifications.KR;

  console.log(filter, certificationFilter);

  return (
    <Layout title="탐색">
      <Wrapper>
        <Alert>티빙 / 쿠팡플레이는 현재 일부 TV 콘텐츠만 지원해요.</Alert>
        <Alert>
          평점을 남겨주세요. 포스터 클릭 → 체크(봤어요) 클릭 → 평점 남기기
        </Alert>
        <SubsSelector />
        <Radio
          register={register("type", {
            required: true,
            onChange: () => setExploreType(watch("type")),
          })}
          ids={[ContentType.MOVIE, ContentType.TV, "TVNETWORK"]}
          labels={["영화", "TV 프로그램", "TV(티빙/쿠플)"]}
          required
        />
      </Wrapper>
      <Wrapper>
        <h3>영화 장르</h3>
        <Columns>
          {genres?.genres.map((genre) => (
            <Label key={genre.id} htmlFor={"genre" + genre.id}>
              <Input
                type="checkbox"
                id={"genre" + genre.id}
                {...register("genres", {
                  onChange: () => setFilter(watch("genres")),
                })}
                value={genre.id}
              />
              <Box>{genre.name}</Box>
            </Label>
          ))}
        </Columns>
      </Wrapper>
      <Wrapper>
        <h3>영화 관람등급</h3>
        <Columns>
          {krMovieCertifications?.map((certification) => (
            <Label
              key={certification.certification}
              htmlFor={certification.certification}
            >
              <Input
                type="checkbox"
                id={certification.certification}
                {...register("certifications", {
                  onChange: () =>
                    setCertificationFilter(watch("certifications")),
                })}
                value={certification.certification}
              />
              <Box>{certification.certification}</Box>
            </Label>
          ))}
        </Columns>
      </Wrapper>
      <Wrapper>
        <h3>TV 장르</h3>
        <Columns>
          {tvGenres?.genres.map((tvGenre) => (
            <Label key={tvGenre.id} htmlFor={"tvGenre" + tvGenre.id}>
              <Input
                type="checkbox"
                id={"tvGenre" + tvGenre.id}
                {...register("tvGenres", {
                  onChange: () => setTvGenreFilter(watch("tvGenres")),
                })}
                value={tvGenre.id}
              />
              <Box>{tvGenre.name}</Box>
            </Label>
          ))}
        </Columns>
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
