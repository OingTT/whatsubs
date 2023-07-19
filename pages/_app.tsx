import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then(res => res.json()),
      }}
    >
      <SessionProvider session={session}>
        <RecoilRoot>
          <Head>
            <title>Whatsubs</title>
          </Head>
          <Component {...pageProps} />
        </RecoilRoot>
      </SessionProvider>
    </SWRConfig>
  );
}
