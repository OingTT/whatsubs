import Layout from '@/components/layout/layout';
import SubsSelector from '@/components/subs-selector';
import { useRecoilValue } from 'recoil';
import { checkedSubsState } from '@/lib/client/state';
import IntegrateChart from '@/components/chart/integrate-chart';
import SubChart from '@/components/chart/sub-chart';
import { Container } from '@/lib/client/style';

export default function Chart() {
  const subscriptions = useRecoilValue(checkedSubsState);

  return (
    <Layout>
      <Container>
        <SubsSelector />
      </Container>

      <Container fill>
        <IntegrateChart />

        {subscriptions.map(sub => (
          <SubChart key={sub.id} sub={sub} />
        ))}
      </Container>
    </Layout>
  );
}

export { getServerSideSession as getServerSideProps } from '@/lib/server/session';
