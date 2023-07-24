import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: 'light'
      }}
    >
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{<Component {...pageProps} />}</main>
        <Footer />
      </div>
    </MantineProvider>
  );
}
