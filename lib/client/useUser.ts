import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

export default function useUser() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, isLoading } = useSWR<User>("/api/user");

  // Check login
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace("/login");
    }
  }, [router, session, status]);

  // Check signup
  useEffect(() => {
    if (status === "authenticated") {
      if (!isLoading && !data) {
        router.replace("/signup");
      }
    }
  }, [data, isLoading, router, status]);

  return data || null;
}
