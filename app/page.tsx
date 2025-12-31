"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen scroll-smooth bg-black text-white relative overflow-x-hidden selection:bg-green-500/30">
      {/* Header */}
      <header className="fixed w-full top-0 z-20 border-b border-black/40 bg-black/20 backdrop-blur-md">
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
      <section className="relative py-24 min-h-screen">
        <div className="pointer-events-none absolute inset-0 bg-[#030303]" />
        <div className="pointer-events-none absolute -top-32 -left-40 h-[520px] w-[520px] rounded-full bg-base/40 blur-[160px]" />
        <div className="pointer-events-none absolute -bottom-40 right-10 h-[520px] w-[520px] rounded-full bg-base/30 blur-[190px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-12 pt-16 md:flex-row md:items-center md:pt-20">
          <div className="space-y-4 md:w-1/2">
            <p className="text-xs font-semibold w-fit py-2 px-5 rounded-full uppercase bg-white/5 border-2 border-white/2 text-white/50">
              AI agents for real work
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-[3.6rem] leading-[1.05]">
              Build agents that
              <span className="bg-gradient-to-r from-[#36B460] to-[#09F858] bg-clip-text text-transparent"> run your ops</span>
              .
            </h1>
            <p className="max-w-xl font-medium text-sm text-white/50">
              Axle is the automation OS for modern teams. Write intent once, connect your tools,
              and watch executions stream live with full context, tools, and memory.
            </p>
            <div className="flex flex-wrap mt-6 items-center gap-3">
              <Link
                href="/auth"
                className="rounded-full bg-base px-7 py-3 text-sm font-semibold text-white hover:bg-base/90 cursor-pointer"
              >
                Start free
              </Link>
              <a
                href="#how-it-works"
                className="text-sm bg-white/5 px-7 py-3 rounded-full text-white/60 hover:text-white"
              >
                See how it works →
              </a>
            </div>
            {/* <div className="flex flex-wrap gap-9 pt-10 text-xs text-white/50">
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
            </div> */}
          </div>

          <div className="md:w-1/2">
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-base/10 via-transparent to-transparent pointer-events-none" />
              <div className="relative rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 text-xs text-white/50">
                  <div className="flex gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <div className="ml-2">Axle · Execution Stream</div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Running
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Weekly growth review</div>
                      <div className="text-xs text-white/50">Agent: Ops Analyst · Trigger: Schedule</div>
                    </div>
                    <div className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[11px] text-white/60">
                      4 tools connected
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    {[
                      { title: 'Pull usage metrics', status: 'done' },
                      { title: 'Summarize key shifts', status: 'done' },
                      { title: 'Draft executive update', status: 'running' },
                      { title: 'Schedule review', status: 'next' },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-white/10 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white/70">
                            {i + 1}
                          </span>
                          <span className="text-white/80">{step.title}</span>
                        </div>
                        <span
                          className={
                            step.status === 'done'
                              ? 'text-[10px] text-emerald-300'
                              : step.status === 'running'
                                ? 'text-[10px] text-white/70'
                                : 'text-[10px] text-white/40'
                          }
                        >
                          {step.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                      <div className="text-[10px] text-white/50">Outcome</div>
                      <div className="mt-2 h-3 w-4/5 rounded bg-white/10" />
                      <div className="mt-2 h-3 w-3/5 rounded bg-white/5" />
                    </div>
                    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                      <div className="text-[10px] text-white/50">Actions</div>
                      <div className="mt-2 flex gap-2">
                        <div className="h-6 w-6 rounded-full bg-base/20" />
                        <div className="h-6 w-6 rounded-full bg-base/10" />
                        <div className="h-6 w-6 rounded-full bg-base/10" />
                      </div>
                      <div className="mt-2 h-3 w-2/3 rounded bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-6 max-w-7xl px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">Trusted by teams shipping fast</div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
              {['Notion', 'Slack', 'GitHub', 'Google', 'Linear', 'Stripe'].map((name) => (
                <div key={name} className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2">
                  {name}
                </div>
              ))}
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
            From intent to reliable automation in three steps.
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                01 — Design
              </p>
              <p className="mt-3 text-sm text-white/70">
                Describe what you want. Axle turns your instructions into an agent that can
                reason, use tools, and keep memory.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                02 — Connect
              </p>
              <p className="mt-3 text-sm text-white/70">
                Connect GitHub, Slack, Google, webhooks and more. Agents can read, write and
                react across your stack with guardrails.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                03 — Observe
              </p>
              <p className="mt-3 text-sm text-white/70">
                Watch every execution step stream live: actions, outputs, errors, credits,
                and the final result.
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
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Benefits</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Visibility-first automation — not black boxes.
              </h2>
            </div>
            <p className="text-sm text-white/60 max-w-xl">
              Axle is built for teams that need reliability, traceability, and control.
              Every action is observable.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[{
              title: 'Live execution timeline',
              desc: 'See what the agent is doing right now: tool calls, inputs/outputs, and status.',
            }, {
              title: 'Memory + context',
              desc: 'Agents remember what matters across runs so automation gets better over time.',
            }, {
              title: 'Triggers that fit your workflow',
              desc: 'Run manually, on schedules, or from webhooks — without brittle chains.',
            }, {
              title: 'Human-in-the-loop',
              desc: 'Review sensitive steps, approvals, and rollbacks when needed.',
            }, {
              title: 'Tooling across your stack',
              desc: 'Connect platforms and integrations so agents can act where work happens.',
            }, {
              title: 'Production-grade guardrails',
              desc: 'Auditability, error visibility, and controlled automation for real teams.',
            }].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="h-10 w-10 rounded-xl bg-base/15 border border-base/20" />
                <p className="mt-4 text-sm font-medium text-white/80">{item.title}</p>
                <p className="mt-2 text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
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
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Free</p>
              <p className="mt-3 text-2xl font-semibold">$0</p>
              <p className="mt-2 text-xs text-white/50">For learning and prototypes</p>
              <div className="mt-5 space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white/40" />Unlimited agents</div>
                <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white/40" />Manual runs</div>
                <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white/40" />Basic integrations</div>
              </div>
              <div className="mt-6">
                <Link href="/auth" className="inline-flex w-full items-center justify-center rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                  Get started
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-400/60 bg-emerald-500/10 p-6 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Pro</p>
              <p className="mt-3 text-2xl font-semibold">$49</p>
              <p className="mt-2 text-xs text-emerald-100">For production workloads</p>
              <div className="mt-5 space-y-2 text-sm text-white/80">
                <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Schedules + webhooks</div>
                <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Live execution stream</div>
                <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />Approvals + retries</div>
              </div>
              <div className="mt-6">
                <Link href="/auth" className="inline-flex w-full items-center justify-center rounded-full bg-base px-4 py-2 text-sm font-semibold text-white hover:bg-base/90">
                  Start free
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Team</p>
              <p className="mt-3 text-2xl font-semibold">Let&apos;s chat</p>
              <p className="mt-2 text-xs text-white/50">For multi-team deployments</p>
              <div className="mt-5 space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white/40" />SSO + org controls</div>
                <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white/40" />Custom integrations</div>
                <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-white/40" />Dedicated support</div>
              </div>
              <div className="mt-6">
                <a href="#" className="inline-flex w-full items-center justify-center rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/50">Loved worldwide</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Teams trust Axle for critical workflows.</h2>
            </div>
            <p className="text-sm text-white/60 max-w-xl">From startup ops to engineering teams, Axle replaces brittle chains with observable automation.</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                quote: 'We replaced 12 separate zaps with one Axle agent — and we can finally see what it is doing.',
                name: 'Ops Lead',
                company: 'B2B SaaS',
              },
              {
                quote: 'The live execution stream is the difference. Debugging automation feels like debugging code again.',
                name: 'Engineering Manager',
                company: 'Dev Tools',
              },
              {
                quote: 'Schedules + webhooks + approvals gave us automation that is safe enough for customer workflows.',
                name: 'Head of Support',
                company: 'Marketplace',
              },
            ].map((t) => (
              <div key={t.quote} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex gap-1 text-base">
                  <span className="text-white/40">★</span>
                  <span className="text-white/40">★</span>
                  <span className="text-white/40">★</span>
                  <span className="text-white/40">★</span>
                  <span className="text-white/40">★</span>
                </div>
                <p className="mt-4 text-sm text-white/70">“{t.quote}”</p>
                <div className="mt-5 text-xs text-white/50">
                  <div className="font-semibold text-white/70">{t.name}</div>
                  <div>{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-gradient-to-b from-black to-black/80 py-14">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">FAQ</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Frequently asked questions</h2>
          </div>

          <div className="mt-8 space-y-3">
            {[
              {
                q: 'What makes Axle different from traditional automation tools?',
                a: 'Axle runs agentic workflows with an execution stream you can observe. You get context, memory, and tool calls — not silent chains.',
              },
              {
                q: 'Can I trigger agents from my product?',
                a: 'Yes. Use webhooks, schedules, and manual runs. You can wire events into Axle and track every execution end-to-end.',
              },
              {
                q: 'Is there a way to keep sensitive steps safe?',
                a: 'Use approvals and human-in-the-loop patterns for high-impact actions. You can also retry and inspect failures quickly.',
              },
              {
                q: 'Do I need a credit card to start?',
                a: 'No. Start free and upgrade when your agents move into production workloads.',
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-white/80 flex items-center justify-between">
                  <span>{item.q}</span>
                  <span className="text-white/50 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-white/60">{item.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <h3 className="text-xl font-semibold tracking-tight">Ready to ship automation you can trust?</h3>
            <p className="mt-2 text-sm text-white/60">Start with one agent. Expand into your entire workflow.</p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/auth" className="rounded-full bg-base px-7 py-3 text-sm font-semibold text-white hover:bg-base/90">
                Start free
              </Link>
              <a href="#pricing" className="rounded-full bg-white/5 border border-white/10 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10">
                View pricing
              </a>
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
