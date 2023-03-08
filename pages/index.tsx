import ProviderSelector from "@/components/provider-selector";
import Topbar from "@/components/topbar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Topbar />
      <ProviderSelector />
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
    </>
  );
}
