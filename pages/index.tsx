import Layout from "@/components/layout";
import ProviderSelector from "@/components/provider-selector";
import Slider from "@/components/slider";
import { MovieDiscover } from "@/lib/client/interface";
import useUser from "@/lib/client/useUser";
import styled from "@emotion/styled";
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

  @media (max-width: 810px) {
    padding: 16px;
    gap: 16px;
  }
`;

export default function Home() {
  const user = useUser();
  const { data } = useSWR<MovieDiscover>(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=ko-KR`
  );

  return (
    <Layout>
      <Wrapper>
        <ProviderSelector />
      </Wrapper>

      <Slider title="추천 콘텐츠" />
      <Slider title="인기 콘텐츠" />
      <Slider title="시청 중인 콘텐츠" />
      <Slider title="찜한 콘텐츠" />
    </Layout>
  );
}
