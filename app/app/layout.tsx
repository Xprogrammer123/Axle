"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components-beta/Header";
import Sidebar from "@/components-beta/Sidebar";
import MobileNav from "@/components-beta/MobileNav";
import { Onborda, OnbordaProvider } from "onborda";
import { steps } from "@/lib/onboarding/steps";
import OnboardingCard from "@/components-beta/OnboardingCard";
import { OnboardingTrigger } from "@/components-beta/OnboardingTrigger";
import MobileOnboarding from "@/components-beta/MobileOnboarding";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileOnboarding, setShowMobileOnboarding] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const completed = localStorage.getItem('axle_onboarding_completed');
    if (window.innerWidth < 1024 && completed !== 'true') {
      setShowMobileOnboarding(true);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMobileOnboardingComplete = () => {
    setShowMobileOnboarding(false);
  };

  const content = (
    <div className="text-dark bg-surface dark:bg-[#0a0a0a] dark:text-dark-light flex w-screen h-screen">
      {!isMobile && <OnboardingTrigger />}
      <MobileNav />
      <Sidebar />
      <div className="flex bg-background dark:bg-[#0e0e0e] w-screen md:w-[85%] md:m-2 md:rounded-l-xl border border-white/3 border-r-0 md:mr-0 flex-col">
        <Header />
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {showMobileOnboarding && (
          <MobileOnboarding onComplete={handleMobileOnboardingComplete} />
        )}
        {content}
      </>
    );
  }

  return (
    <OnbordaProvider>
      <Onborda
        steps={steps}
        cardComponent={OnboardingCard}
        shadowRgb="0,0,0"
        shadowOpacity="0.75"
        cardTransition={{
          duration: 0.2,
          ease: "easeOut"
        }}
        showControls={true}
      >
        {content}
      </Onborda>
    </OnbordaProvider>
  );
}