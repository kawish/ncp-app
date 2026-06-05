'use client';

import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatisticsSection } from '@/components/sections/StatisticsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { ComplaintFormSection } from '@/components/sections/ComplaintFormSection';
import { Footer } from '@/components/layout/Footer';

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
