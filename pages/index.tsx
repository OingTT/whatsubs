import Layout from "@/components/layout";
import ProviderSelector from "@/components/provider-selector";
import Slider from "@/components/touch-slider";
import useUser from "@/lib/client/useUser";
import styled from "@emotion/styled";

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

  return (
    <Layout>
      <Wrapper>
        <ProviderSelector />
      </Wrapper>
    </Layout>
  );
}
