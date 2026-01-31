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
import { api } from "@/lib/api";
import { SlideIn, FadeIn } from "@/components/ui/animations";


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileOnboarding, setShowMobileOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const loadProfile = async () => {
      try {
        const data: any = await api.getProfile();
        setUser(data.user);

        const completed = data.user?.hasCompletedOnboarding;
        if (window.innerWidth < 1024 && !completed) {
          setShowMobileOnboarding(true);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    loadProfile();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMobileOnboardingComplete = async () => {
    setShowMobileOnboarding(false);
    setUser((prev: any) => ({ ...prev, hasCompletedOnboarding: true }));
    try {
      await api.updateProfile({ hasCompletedOnboarding: true });
    } catch (e) {
      console.error("Failed to update onboarding status:", e);
    }
  };

  if (loading) {
    return (
      <div className="text-dark bg-surface dark:bg-[#0a0a0a] flex w-screen h-screen items-center justify-center">
        <div className="loader-light" />
      </div>
    );
  }

  const content = (
    <div className="text-dark bg-surface dark:bg-[#0a0a0a] dark:text-dark-light flex w-screen h-screen">
      {!isMobile && !user?.hasCompletedOnboarding && <OnboardingTrigger />}
      <MobileNav />
      <SlideIn direction="right" duration={0.6} className="h-full z-20">
        <Sidebar />
      </SlideIn>
      <div className="flex bg-background dark:bg-[#0e0e0e] w-screen md:w-[85%] md:m-2 md:rounded-l-xl border border-white/3 border-r-0 md:mr-0 flex-col overflow-hidden">
        <SlideIn direction="down" duration={0.6} delay={0.2} className="w-full">
          <Header />
        </SlideIn>
        <FadeIn duration={0.8} delay={0.4} className="h-full overflow-auto">
          {children}
        </FadeIn>
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
        steps={steps as any}
        cardComponent={OnboardingCard}
        shadowRgb="0,0,0"
        shadowOpacity="0.75"
        cardTransition={{
          duration: 0.2,
          ease: "easeOut"
        }}
      >
        {content}
      </Onborda>
    </OnbordaProvider>
  );
}