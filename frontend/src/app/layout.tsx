import type { Metadata } from 'next';
import { Manrope, Covered_By_Your_Grace } from 'next/font/google';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
});

const coveredByYourGrace = Covered_By_Your_Grace({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-covered',
});

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
      <body className={`${manrope.variable} ${coveredByYourGrace.variable} font-sans`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}