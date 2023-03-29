import Layout from "@/components/layout";
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

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  grid-auto-rows: min-content;
  gap: 24px;

  @media (max-width: 810px) {
    gap: 16px;
  }
`;

const Poster = styled.div`
  box-shadow: 0px 2px 16px 0px rgba(0, 0, 0, 0.25);
  background-color: #333333;
  aspect-ratio: 2/3;
  border-radius: 16px;
`;

export default function Review() {
  const user = useUser();

  return (
    <Layout>
      <Wrapper>
        <Header>
          <h1>콘텐츠를 평가해주세요.</h1>
        </Header>

        <Grid>
          {Array.from({ length: 120 }, (_, index) => (
            <Poster key={index} />
          ))}
        </Grid>
      </Wrapper>
    </Layout>
  );
}
