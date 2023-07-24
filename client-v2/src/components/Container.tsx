import { ReactNode } from 'react';
import Footer from '@/components/Footer';
import Header from './Header';

type Props = {
  children: ReactNode;
};

export default function Container({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
