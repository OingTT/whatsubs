import Alert from "@/components/alert";
import Layout from "@/components/layout/layout";
import SubsSelector from "@/components/subs-selector";
import Slider from "@/components/slider";
import { Content } from "@/lib/client/interface";
import styled from "@emotion/styled";
import { Review, Watch } from "@prisma/client";
import useSWR from "swr";
import IntegrateChart from "@/components/chart/integrate-chart";

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

export default function Home() {
  const { data: reviewData } = useSWR<Review[]>("/api/review");
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

      <IntegrateChart />
      <Slider title="맞춤 추천 콘텐츠" disabled />
      <Slider title="시청 중인 콘텐츠" contents={watching} />
      <Slider title="찜한 콘텐츠" contents={wantToWatch} />
    </Layout>
  );
}
