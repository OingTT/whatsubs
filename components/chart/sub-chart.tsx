import { DiscoverMovie, DiscoverTV, Content } from "@/lib/client/interface";
import { Subscription, ContentType } from "@prisma/client";
import useSWR from "swr";
import Slider from "../slider";

interface SubChartProps {
  sub: Subscription;
}

export default function SubChart({ sub }: SubChartProps) {
  const { data: movies } = useSWR<DiscoverMovie>(
    sub.providerId
      ? `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&with_watch_providers=${sub.providerId}&watch_region=KR&with_watch_monetization_types=flatrate`
      : undefined
  );

  const { data: tvs } = useSWR<DiscoverTV>(
    sub.providerId
      ? `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&with_watch_providers=${sub.providerId}&watch_region=KR&with_watch_monetization_types=flatrate`
      : `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR&with_networks=${sub.networkId}`
  );

  const movieContents =
    movies?.results.map(
      (movie): Content => ({
        type: ContentType.MOVIE,
        id: movie.id,
      })
    ) || [];

  const tvContents =
    tvs?.results.map(
      (tv): Content => ({
        type: ContentType.TV,
        id: tv.id,
      })
    ) || [];

  return (
    <>
      {sub.providerId && (
        <Slider title={`${sub.name} 영화 차트`} contents={movieContents} />
      )}
      <Slider title={`${sub.name} TV 차트`} contents={tvContents} />
    </>
  );
}
