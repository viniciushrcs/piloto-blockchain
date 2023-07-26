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
        defaultRadius: 'md',
        primaryColor: 'blue',
        colors: {
          blue: [
            '#ebf8ff',
            '#d1ebf7',
            '#b7ddec',
            '#9dcfe2',
            '#83c2d8',
            '#69b4cd',
            '#4f97c3', // default
            '#3f7ea7',
            '#2f658b',
            '#1f4c6f'
          ]
        }
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
