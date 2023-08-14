import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface options {
  required?: boolean;
}

export default function useUser({ required }: options = {}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check login
  useEffect(() => {
    if (required && status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [required, router, status]);

  // Check signup
  useEffect(() => {
    if (status === 'authenticated') {
      if (!session.user.gender) {
        router.replace('/new/1');
      }
    }
  }, [router, session?.user.gender, status]);

  return session?.user;
}
