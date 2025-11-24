import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FarmHub',
  description: 'Smart Farm Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
