import Layout from "@/components/layout";
import useUser from "@/lib/client/useUser";
import styled from "@emotion/styled";
import { signOut } from "next-auth/react";

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
  const user = useUser();

  return (
    <Layout>
      <Wrapper>
        {user && (
          <div>
            <h1>사용자 정보</h1>
            <textarea
              rows={9}
              cols={120}
              value={JSON.stringify(user, null, 2)}
              readOnly
            />
            <br />
            <button onClick={() => signOut()}>로그아웃</button>
          </div>
        )}
      </Wrapper>
    </Layout>
  );
}
