import ProviderSelector from "@/components/provider-selector";
import Topbar from "@/components/topbar";
import useUser from "@/lib/client/useUser";
import { signOut } from "next-auth/react";

export default function Home() {
  const user = useUser();

  return (
    <>
      <Topbar />
      <ProviderSelector />

      {user && (
        <div>
          <h1>Login status</h1>
          Signed in as {user.email} <br />
          <textarea
            rows={8}
            cols={120}
            value={JSON.stringify(user, null, 2)}
            readOnly
          ></textarea>
          <br />
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}
    </>
  );
}
