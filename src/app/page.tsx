'use client';

import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { StatisticsSection } from '@/components/StatisticsSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ComplaintFormSection } from '@/components/ComplaintFormSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <StatisticsSection />
      <FeaturesSection />
      <ComplaintFormSection />
      <Footer />
    </>
  );
}
