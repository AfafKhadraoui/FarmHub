import { Metadata } from 'next';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import CTA from '../components/landing/CTA';

export const metadata: Metadata = {
  title: 'FarmHub - Smart Farm Management Platform | Connect Workers & Owners',
  description: 'Revolutionary farm management platform connecting agricultural workers with farm owners. Streamline field operations, task coordination, weather integration for maximum farming efficiency.',
  keywords: 'farm management, agricultural platform, field management, task coordination, weather integration, farm workers, agricultural efficiency, farming technology',
  openGraph: {
    title: 'FarmHub - Smart Farm Management Platform | Connect Workers & Owners',
    description: 'Transform your farming operations with FarmHub - the complete platform for connecting farm owners and workers while optimizing agricultural productivity.',
  }
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </main>
  );
}
