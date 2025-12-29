"use client";

import React from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

const Home = () => {
  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden selection:bg-green-500/30">
      <LandingHeader />
      <HeroSection />
      <SocialProof />
      <FeatureGrid />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Home;
