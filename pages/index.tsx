import Layout from "@/components/layout";
import ProviderSelector from "@/components/provider-selector";
import styled from "@emotion/styled";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  gap: 24px;

  @media (max-width: 810px) {
    padding: 16px;
    gap: 16px;
  }
`;

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <Wrapper>
        <ProviderSelector />
      </Wrapper>

      <h1>Login status</h1>
      {session ? (
        <>
          Signed in as {session.user?.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          Not signed in <br />
          <Link href="/login">
            <button>Login</button>
          </Link>
        </>
      )}
    </Layout>
  );
}
