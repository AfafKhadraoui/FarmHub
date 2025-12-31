import type { Metadata } from 'next';
import { Manrope, Covered_By_Your_Grace } from 'next/font/google';
import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {Providers} from './providers';

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
  icons: {
    icon: '/images/website_logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth scroll-pt-[140px]">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body className={`${manrope.variable} ${coveredByYourGrace.variable} font-sans`}>

        <Providers>
          {children}
        </Providers>

      </body>
    </html>
  );
}