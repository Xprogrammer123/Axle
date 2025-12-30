'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import Axle from '@/components/Axle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = window.localStorage.getItem('axle_onboarding_seen');
    if (!seen) {
      setShowOnboarding(true);
      window.localStorage.setItem('axle_onboarding_seen', '1');
    }
  }, []);

  return (
    <div className="h-screen w-screen flex bg-linear-to-b min-h-screen from-background to-[#090D0A]">
      <Sidebar collapsed={sidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex overflow-auto justify-center w-full">
          <div className="container w-full mx-auto h-full p-6">
            {children}
          </div>
            <Axle />
        </main>

        {/* First-time onboarding animation overlay */}
        {showOnboarding && (
          <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
            <div className="pointer-events-auto backdrop-blur-md relative max-w-2xl mx-auto rounded-3xl border-2 border-black/40 bg-gradient-to-br from-base/40 via-black to-black/90 shadow-2xl p-8 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_60%),radial-gradient(circle_at_bottom,_rgba(96,165,250,0.12),transparent_60%)] pointer-events-none" />
              <div className="relative space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Welcome to Axle
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Your agents are now{" "}
                  <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                    fully wired in
                  </span>
                  .
                </h2>
                <p className="text-sm md:text-white text-white/60">
                  Create an agent, connect your tools, and watch live executions stream into
                  the dashboard in real time. You can always open God Mode from the top bar to
                  orchestrate everything from one place.
                </p>
                <div className="flex flex-wrap flex-col gap-3 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                      1
                    </span>
                    <span>Create your first agent from the Agents tab.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 text-sky-300">
                      2
                    </span>
                    <span>Connect Slack, GitHub, or Google under Integrations.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 text-violet-300">
                      3
                    </span>
                    <span>Run the agent and watch steps render live in the dashboard.</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[11px] text-white/40">
                    Tip: press <span className="rounded-md border border-white/15 px-1">G</span> in
                    the dashboard to toggle God Mode.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowOnboarding(false)}
                    className="pointer-events-auto rounded-full bg-white text-black px-4 py-1.5 text-xs font-medium hover:bg-white/90 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
