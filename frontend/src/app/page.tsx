import { Metadata } from 'next';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import CTA from '../components/landing/CTA';
import FAQ from '../components/landing/FAQ';
import GetToKnowUs from '../components/landing/GetToKnowUs';
import PlatformBenefits from '../components/landing/PlatformBenefits';
import WhoUsesFarmHub from '../components/landing/WhoUsesFarmHub';
import Testimonials from '../components/landing/Testimonials';


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
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <Hero />
        <Features />
        <GetToKnowUs />
        <PlatformBenefits />
        <HowItWorks />
        <WhoUsesFarmHub />
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="faq">
          <FAQ />
        </section>
        <CTA />
      </main>
      <Footer />
    </>
  );
}