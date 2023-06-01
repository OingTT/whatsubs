import Alert from "@/components/alert";
import Layout from "@/components/layout/layout";
import SubsSelector from "@/components/subs-selector";
import Slider from "@/components/slider";
import { Content } from "@/lib/client/interface";
import styled from "@emotion/styled";
import { ContentType, Review, Watch } from "@prisma/client";
import useSWR from "swr";
import IntegrateChart from "@/components/chart/integrate-chart";
import useUser from "@/lib/client/useUser";

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

interface Recommendation {
  ContentType: ContentType;
  ContentID: number;
  Rating: number;
}

export default function Home() {
  const user = useUser();
  const { data: reviewData } = useSWR<Review[]>("/api/review");
  const { data: recommendMovieData } = useSWR<Recommendation[]>(
    user &&
      `${process.env.NEXT_PUBLIC_API_URL}/recommendation/movie/${user?.id}`
  );
  const recommendMovie = recommendMovieData?.map(
    (recommendation): Content => ({
      type: recommendation.ContentType,
      id: recommendation.ContentID,
    })
  );
  const { data: recommendTVData } = useSWR<Recommendation[]>(
    user && `${process.env.NEXT_PUBLIC_API_URL}/recommendation/tv/${user?.id}`
  );
  const recommendTV = recommendTVData?.map(
    (recommendation): Content => ({
      type: recommendation.ContentType,
      id: recommendation.ContentID,
    })
  );

  const wantToWatch = reviewData
    ?.filter((review) => review.watch === Watch.WANT_TO_WATCH)
    .map(
      (review): Content => ({ type: review.contentType, id: review.contentId })
    );
  const watching = reviewData
    ?.filter((review) => review.watch === Watch.WATCHING)
    .map(
      (review): Content => ({ type: review.contentType, id: review.contentId })
    );

  return (
    <Layout>
      <Wrapper>
        <Alert>
          Whatsubs는 테스트 중! 일부 기능이 작동하지 않을 수 있어요.
        </Alert>
        <Alert>
          평점을 남겨주세요. 탐색 → 포스터 클릭 → 체크(봤어요) 클릭 → 평점
          남기기
        </Alert>
        <SubsSelector />
      </Wrapper>

      <Slider title="맞춤 추천 영화" contents={recommendMovie} />
      <Slider title="맞춤 추천 TV 프로그램" contents={recommendTV} />
      <IntegrateChart />
      <Slider title="시청 중인 콘텐츠" contents={watching} />
      <Slider title="찜한 콘텐츠" contents={wantToWatch} />
    </Layout>
  );
}
