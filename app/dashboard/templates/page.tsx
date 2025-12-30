'use client';

import { useState } from 'react';
import {
  Plus,
  RocketLaunch,
  Binoculars,
  GithubLogo,
  Globe,
  UserCircle,
  ChatCircleDots,
  Lightning,
  EnvelopeSimple,
  TrendUp,
  CalendarCheck,
  ShoppingCartSimple,
  Code,
  PresentationChart,
  Notepad,
  MegaphoneSimple,
  ChartBar,
  BookOpen,
  Buildings,
  DeviceMobileCamera
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const TEMPLATES = [
  {
    id: 'product-launch',
    name: 'Product Launch',
    category: 'Marketing',
    description: 'Coordinate cross-channel announcements and PR updates.',
    icon: <RocketLaunch size={32} weight="duotone" className="text-orange-400" />,
    color: 'from-orange-500/10 to-transparent'
  },
  {
    id: 'research',
    name: 'Knowledge Base',
    category: 'Research',
    description: 'Synthesize complex topics from web content and documents.',
    icon: <Binoculars size={32} weight="duotone" className="text-blue-400" />,
    color: 'from-blue-500/10 to-transparent'
  },
  {
    id: 'github',
    name: 'Repo Maintainer',
    category: 'Engineering',
    description: 'Triage issues, review PRs, and draft release notes.',
    icon: <GithubLogo size={32} weight="duotone" className="text-white/60" />,
    color: 'from-white/10 to-transparent'
  },
  {
    id: 'social',
    name: 'Social Media Manager',
    category: 'Social',
    description: 'Manage engagement and post schedules across platforms.',
    icon: <Globe size={32} weight="duotone" className="text-emerald-400" />,
    color: 'from-emerald-500/10 to-transparent'
  },
  {
    id: 'executive',
    name: 'Executive Assistant',
    category: 'Personal',
    description: 'Calendar management, email triaging, and briefing.',
    icon: <UserCircle size={32} weight="duotone" className="text-purple-400" />,
    color: 'from-purple-500/10 to-transparent'
  },
  {
    id: 'sales-outreach',
    name: 'Sales Outreach',
    category: 'Revenue',
    description: 'Personalized outbound email sequences with follow-ups.',
    icon: <EnvelopeSimple size={32} weight="duotone" className="text-pink-400" />,
    color: 'from-pink-500/10 to-transparent'
  },
  {
    id: 'customer-success',
    name: 'Customer Success Companion',
    category: 'Customer',
    description: 'Summarize tickets and propose next-best-actions.',
    icon: <ChatCircleDots size={32} weight="duotone" className="text-sky-400" />,
    color: 'from-sky-500/10 to-transparent'
  },
  {
    id: 'growth-analyst',
    name: 'Growth Analyst',
    category: 'Analytics',
    description: 'Monitor key funnel metrics and surface anomalies.',
    icon: <TrendUp size={32} weight="duotone" className="text-lime-400" />,
    color: 'from-lime-500/10 to-transparent'
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes Synthesizer',
    category: 'Productivity',
    description: 'Turn raw transcripts into action items and briefs.',
    icon: <Notepad size={32} weight="duotone" className="text-amber-400" />,
    color: 'from-amber-500/10 to-transparent'
  },
  {
    id: 'release-manager',
    name: 'Release Manager',
    category: 'Engineering',
    description: 'Draft changelogs and coordinate code-freeze windows.',
    icon: <Code size={32} weight="duotone" className="text-cyan-400" />,
    color: 'from-cyan-500/10 to-transparent'
  },
  {
    id: 'campaign-orchestrator',
    name: 'Campaign Orchestrator',
    category: 'Marketing',
    description: 'Plan and track omni-channel launch campaigns.',
    icon: <MegaphoneSimple size={32} weight="duotone" className="text-red-400" />,
    color: 'from-red-500/10 to-transparent'
  },
  {
    id: 'churn-watcher',
    name: 'Churn Watcher',
    category: 'Analytics',
    description: 'Flag at-risk accounts based on product signals.',
    icon: <ChartBar size={32} weight="duotone" className="text-fuchsia-400" />,
    color: 'from-fuchsia-500/10 to-transparent'
  },
  {
    id: 'documentation-buddy',
    name: 'Documentation Buddy',
    category: 'Knowledge',
    description: 'Keep internal docs up to date from code and PRs.',
    icon: <BookOpen size={32} weight="duotone" className="text-emerald-300" />,
    color: 'from-emerald-400/10 to-transparent'
  },
  {
    id: 'ops-console',
    name: 'Ops Console',
    category: 'Operations',
    description: 'Daily digests of incidents, SLAs, and queue health.',
    icon: <Lightning size={32} weight="duotone" className="text-yellow-300" />,
    color: 'from-yellow-400/10 to-transparent'
  },
  {
    id: 'account-executive',
    name: 'Account Executive Copilot',
    category: 'Revenue',
    description: 'Summarize opps and recommend next actions per deal.',
    icon: <Buildings size={32} weight="duotone" className="text-indigo-300" />,
    color: 'from-indigo-400/10 to-transparent'
  },
  {
    id: 'editorial-calendar',
    name: 'Editorial Calendar',
    category: 'Content',
    description: 'Generate and maintain a 30–60 day content calendar.',
    icon: <CalendarCheck size={32} weight="duotone" className="text-teal-300" />,
    color: 'from-teal-400/10 to-transparent'
  },
  {
    id: 'ab-testing',
    name: 'A/B Experiment Monitor',
    category: 'Product',
    description: 'Track experiments and summarize winning variants.',
    icon: <PresentationChart size={32} weight="duotone" className="text-orange-300" />,
    color: 'from-orange-400/10 to-transparent'
  },
  {
    id: 'checkout-guardian',
    name: 'Checkout Guardian',
    category: 'E‑commerce',
    description: 'Watch cart events and alert on conversion drops.',
    icon: <ShoppingCartSimple size={32} weight="duotone" className="text-rose-300" />,
    color: 'from-rose-400/10 to-transparent'
  },
  {
    id: 'power-user-onboarder',
    name: 'Power User Onboarder',
    category: 'Customer',
    description: 'Guide new users through activation milestones.',
    icon: <Lightning size={32} weight="duotone" className="text-violet-300" />,
    color: 'from-violet-400/10 to-transparent'
  },
  {
    id: 'ugc-curator',
    name: 'UGC Curator',
    category: 'Social',
    description: 'Collect and rank user‑generated content across channels.',
    icon: <DeviceMobileCamera size={32} weight="duotone" className="text-sky-300" />,
    color: 'from-sky-400/10 to-transparent'
  }
];

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl pb-40 mx-auto space-y-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-5 md:items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Blueprints</h1>
          <p className="text-white/40 mt-1">Start with a pre-configured agent to save time.</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search templates..."
            className="bg-black/30 border border-black/50 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-black/70 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Custom Start */}
        <Link href="/dashboard/agents/new">
          <Card className="h-full border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all p-8 flex flex-col items-center justify-center text-center group rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Plus size={32} className="text-white/40" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Blank Slate</h3>
            <p className="text-sm text-white/30">Start from scratch for custom needs.</p>
          </Card>
        </Link>

        {/* Template Cards */}
        {filtered.map((template) => (
          <Link key={template.id} href={`/dashboard/agents/new?template=${template.id}`}>
            <Card className={`h-full bg-gradient-to-b ${template.color} border border-white/5 hover:border-white/10 hover:bg-black/10 transition-all p-8 flex flex-col justify-between rounded-3xl group`}>
              <div>
                <div className="mb-6 group-hover:-translate-y-1 transition-transform">
                  {template.icon}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-white/20 uppercase mb-2">
                  {template.category}
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{template.name}</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-medium text-white/60">Use Template</span>
                <Plus size={16} />
              </div>
            </Card>
          </Link>
        ))}

      </div>

    </div>
  );
}
