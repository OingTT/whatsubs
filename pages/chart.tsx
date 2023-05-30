import Layout from "@/components/layout";
import SubsSelector from "@/components/subs-selector";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { checkedSubsState } from "@/lib/client/state";
import IntegrateChart from "@/components/chart/integrate-chart";
import SubChart from "@/components/chart/sub-chart";

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
  const subscriptions = useRecoilValue(checkedSubsState);

  return (
    <Layout>
      <Wrapper>
        <SubsSelector />
      </Wrapper>

      <IntegrateChart />

      {subscriptions.map((sub) => (
        <SubChart key={sub.id} sub={sub} />
      ))}
    </Layout>
  );
}
