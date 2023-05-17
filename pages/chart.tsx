import Layout from "@/components/layout";
import SubsSelector from "@/components/subs-selector";
import Slider from "@/components/slider";
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

  @media (max-width: 809px) {
    padding: 16px;
    gap: 16px;
  }
`;

export default function Chart() {
  return (
    <Layout>
      <Wrapper>
        <SubsSelector />
      </Wrapper>

      <Slider title="통합 차트" disabled />
    </Layout>
  );
}
