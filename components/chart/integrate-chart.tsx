import { Content, DiscoverMovie, DiscoverTV } from '@/lib/client/interface';
import { checkedSubsState } from '@/lib/client/state';
import { ContentType } from '@prisma/client';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';
import Slider from '../slider';

export default function IntegrateChart() {
  const subscriptions = useRecoilValue(checkedSubsState);

  const { data: movies } = useSWR<DiscoverMovie>(
    subscriptions.filter(sub => sub.providerId).length !== 0 &&
      `https://api.themoviedb.org/3/discover/movie?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_watch_providers=${subscriptions
        .map(subscription => subscription.providerId)
        .join('|')}&watch_region=KR&with_watch_monetization_types=flatrate`
  );

  const { data: tvs } = useSWR<DiscoverTV>(
    subscriptions.filter(sub => sub.providerId).length !== 0 &&
      `https://api.themoviedb.org/3/discover/tv?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_watch_providers=${subscriptions
        .map(subscription => subscription.providerId)
        .join('|')}&watch_region=KR&with_watch_monetization_types=flatrate`
  );

  const { data: tvNetworks } = useSWR<DiscoverTV>(
    subscriptions.filter(sub => sub.networkId).length !== 0 &&
      `https://api.themoviedb.org/3/discover/tv?api_key=${
        process.env.NEXT_PUBLIC_TMDB_API_KEY
      }&language=ko-KR&with_networks=${subscriptions
        .map(subscription => subscription.networkId)
        .join('|')}`
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

  const tvNetworkContents =
    tvNetworks?.results.map(
      (tv): Content => ({
        type: ContentType.TV,
        id: tv.id,
      })
    ) || [];

  return (
    <>
      {subscriptions.filter(sub => sub.providerId).length > 1 && (
        <Slider title="통합 영화 차트" contents={movieContents} />
      )}
      {subscriptions.filter(sub => sub.providerId).length > 1 && (
        <Slider title="통합 TV 차트" contents={tvContents} />
      )}
      {subscriptions.filter(sub => sub.networkId).length > 1 && (
        <Slider title="티빙/쿠팡플레이 차트" contents={tvNetworkContents} />
      )}
    </>
  );
}
