"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen scroll-smooth bg-black text-white relative overflow-x-hidden selection:bg-green-500/30">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Axle" width={24} height={24} />
            {/* <span className="text-sm font-semibold tracking-tight">Axle</span> */}
          </div>
          <nav className="hidden items-center gap-6 text-sm text-white/60 md:flex">
            <a href="#how-it-works" className="hover:text-white">
              How it works
            </a>
            <a href="#use-cases" className="hover:text-white">
              Use cases
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {/* <Link
              href="/auth"
              className="text-xs md:text-sm text-white/60 hover:text-white"
            >
              Log in
            </Link> */}
            <Link
              href="/auth"
              className="rounded-full bg-white px-4 py-2 text-xs md:text-sm font-semibold text-black hover:bg-white/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.25),transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.25),transparent_55%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-16 md:flex-row md:items-center md:pt-20">
          <div className="space-y-6 md:w-1/2">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              AI agents for real work
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Wire up{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                Agentic automation
              </span>{" "}
              in minutes.
            </h1>
            <p className="max-w-xl text-sm text-white/60 md:text-base">
              Axle connects your product, your tools, and your data into a single automation
              layer. Design agents once, then watch every step stream into a live execution
              canvas. No brittle zaps, no black boxes.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/auth"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-white/90"
              >
                Get started free
              </Link>
              <a
                href="#how-it-works"
                className="text-sm text-white/60 hover:text-white"
              >
                See how it works →
              </a>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-xs text-white/50">
              <div>
                <div className="text-base font-semibold text-white">80+</div>
                <div>integrations and actions</div>
              </div>
              <div>
                <div className="text-base font-semibold text-white">Live</div>
                <div>execution timeline & memory</div>
              </div>
              <div>
                <div className="text-base font-semibold text-white">Minutes</div>
                <div>from idea to deployed agent</div>
              </div>
            </div>
          </div>

          {/* Right hero panel */}
          <div className="md:w-1/2">
            <div className="rounded-3xl border border-white/10 bg-black/60 p-4 shadow-[0_0_80px_rgba(34,197,94,0.35)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-white/50">
                <span>Execution: Weekly growth review</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Running
                </span>
              </div>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  "Summarise last 7 days of product usage",
                  "Pull latest GitHub and Slack incidents",
                  "Draft executive email with key graphs",
                  "Schedule review block on calendar",
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white/70">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                    <span className="text-[10px] text-emerald-300">
                      {i < 3 ? "done" : "next"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-sky-500/10 p-3 text-[11px] text-white/70">
                Axle is orchestrating GitHub, Slack, Gmail and Calendar in an iterative
                loop reasoning, executing tools, and updating memory automatically.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-b border-white/10 bg-black/80 py-14"
      >
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            How it works
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            From intent to orchestrated workflow in three steps.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                01 — Describe
              </p>
              <p className="mt-3 text-sm text-white/70">
                Create an agent in plain language. Axle turns your instructions into a
                structured brain, with tools and triggers wired automatically.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                02 — Connect
              </p>
              <p className="mt-3 text-sm text-white/70">
                Connect GitHub, Slack, Google, X and more. Agents can read, write and react
                across your stack with guardrails.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                03 — Observe
              </p>
              <p className="mt-3 text-sm text-white/70">
                Watch every execution step stream into the dashboard with full memory,
                tokens, tools used, and final outputs in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section
        id="use-cases"
        className="border-b border-white/10 bg-gradient-to-b from-black via-base/5 to-base/10 py-14"
      >
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Automations your team actually wants to keep.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm font-medium text-white/80">
                Product & Growth
              </p>
              <p className="mt-2 text-sm text-white/60">
                Ship weekly growth reviews, activation digests, and experiment reports
                without opening a spreadsheet.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm font-medium text-white/80">
                Engineering
              </p>
              <p className="mt-2 text-sm text-white/60">
                Keep PR queues moving, triage incidents, and sync release notes with docs,
                all from agent playbooks.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <p className="text-sm font-medium text-white/80">
                Operations & CX
              </p>
              <p className="mt-2 text-sm text-white/60">
                Send proactive customer updates, chase SLAs, and surface at‑risk accounts
                before they churn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section
        id="pricing"
        className="border-b border-white/10 bg-black/90 py-14"
      >
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Start free. Scale when the agents earn their keep.
          </h2>
          <p className="mt-3 text-sm text-white/60">
            Build and test agents on the free tier. Upgrade when you&apos;re ready to run
            them in production.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Free
              </p>
              <p className="mt-3 text-2xl font-semibold">$0</p>
              <p className="mt-2 text-xs text-white/50">For solo builders</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/60 bg-emerald-500/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Pro
              </p>
              <p className="mt-3 text-2xl font-semibold">$49</p>
              <p className="mt-2 text-xs text-emerald-100">For production workloads</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Team
              </p>
              <p className="mt-3 text-2xl font-semibold">Let&apos;s chat</p>
              <p className="mt-2 text-xs text-white/50">For multi‑team deployments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-6 text-xs text-white/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <span>© {new Date().getFullYear()} Axle. All rights reserved.</span>
          <span className="hidden gap-4 md:flex">
            <a href="#how-it-works" className="hover:text-white">
              How it works
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}
