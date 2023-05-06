import Layout from "@/components/layout";
import ProviderSelector from "@/components/provider-selector";
import Slider from "@/components/slider";
import styled from "@emotion/styled";
import { Review, Watch } from "@prisma/client";
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

export default function Home() {
  const { data: reviewData } = useSWR<Review[]>("/api/review");
  const wantToWatch = reviewData
    ?.filter((review) => review.watch === Watch.WANT_TO_WATCH)
    .map((review) => review.movieId);
  const watching = reviewData
    ?.filter((review) => review.watch === Watch.WATCHING)
    .map((review) => review.movieId);

  return (
    <Layout>
      <Wrapper>
        <ProviderSelector />
      </Wrapper>

      <Slider title="오늘의 인기 콘텐츠" disabled />
      <Slider title="맞춤 추천 콘텐츠" disabled />
      <Slider title="시청 중인 콘텐츠" ids={watching} />
      <Slider title="찜한 콘텐츠" ids={wantToWatch} />
    </Layout>
  );
}
