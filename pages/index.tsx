import Alert from '@/components/alert';
import Layout from '@/components/layout/layout';
import SubsSelector from '@/components/subs-selector';
import Slider from '@/components/slider';
import { Content } from '@/lib/client/interface';
import { ContentType, Review, Watch } from '@prisma/client';
import useSWR from 'swr';
import IntegrateChart from '@/components/chart/integrate-chart';
import useUser from '@/lib/client/useUser';
import { Container } from '@/lib/client/style';

interface Recommendation {
  ContentType: ContentType;
  ContentID: number;
  Rating: number;
}

function isReviewArray(data: Recommendation[] | Review[]): data is Review[] {
  return 'watch' in data[0];
}

function getContents(data?: Recommendation[] | Review[], watch?: Watch) {
  if (!data) return;

  if (isReviewArray(data)) {
    return data
      ?.filter(review => review.watch === watch)
      .map(
        (review): Content => ({
          type: review.contentType,
          id: review.contentId,
        })
      );
  }

  return data?.map(
    (recommendation): Content => ({
      type: recommendation.ContentType,
      id: recommendation.ContentID,
    })
  );
}

export default function Home() {
  const user = useUser();
  const { data: reviewData } = useSWR<Review[]>('/api/users/me/reviews');
  const { data: recommendMovieData, error } = useSWR<Recommendation[]>(
    user &&
      `${process.env.NEXT_PUBLIC_API_URL}/recommendation/movie/${user?.id}`
  );
  const { data: recommendTVData } = useSWR<Recommendation[]>(
    user && `${process.env.NEXT_PUBLIC_API_URL}/recommendation/tv/${user?.id}`
  );

  return (
    <Layout>
      <Container compact>
        <SubsSelector />
        {error && <Alert type="error">추천 시스템을 점검하고 있어요.</Alert>}
        <Alert type="info">
          평점을 남겨보세요. 탐색 → 포스터 클릭 → 체크(봤어요) 클릭 → 평점
          남기기
        </Alert>
      </Container>

      <Container fill>
        <Slider
          title="맞춤 추천 영화"
          contents={getContents(recommendMovieData)}
        />
        <Slider
          title="맞춤 추천 TV 프로그램"
          contents={getContents(recommendTVData)}
        />
        <IntegrateChart />
        <Slider
          title="시청 중인 콘텐츠"
          contents={getContents(reviewData, Watch.WATCHING)}
        />
        <Slider
          title="찜한 콘텐츠"
          contents={getContents(reviewData, Watch.WANT_TO_WATCH)}
        />
      </Container>
    </Layout>
  );
}
