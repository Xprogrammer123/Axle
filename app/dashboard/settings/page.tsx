'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  UserCircle,
  Key,
  Globe,
  Trash
} from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [overview, setOverview] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [data, ov]: any = await Promise.all([
          api.getProfile(),
          api.getDashboardOverview()
        ]);
        const user = data.user || data?.profile || data;
        if (user) {
          setProfile(user);
          setName(user.name || '');
          setEmail(user.email || '');
          setTimeZone(user.timeZone || '');
        }

        setOverview(ov?.overview || ov);
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const payload: any = { name, timeZone};
      await api.updateProfile(payload);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

 
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="max-w-3xl mx-auto space-y-12 pb-38"
    >

      <div>
        <h1 className="text-3xl font-light text-white tracking-tight">Settings</h1>
        <p className="text-white/40 mt-1">Manage your identity and platform preferences.</p>
      </div>

      <div className="space-y-8">

        {/* Account Overview */}
        {overview && (
          <section>
            <div className="flex items-center gap-2 mb-4 text-white/60">
              <Key size={20} weight="duotone" />
              <h2 className="text-lg font-medium">Account</h2>
            </div>
            <Card className="p-8 bg-white/5 border border-white/5 rounded-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="text-xs uppercase tracking-widest text-white/30">Plan</div>
                  <div className="text-lg text-white/80 mt-1 capitalize">{overview.currentPlan || overview.plan || 'free'}</div>
                  <div className="text-xs text-white/30 mt-1">{overview.currentPlanExplained || ''}</div>
                </div>
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="text-xs uppercase tracking-widest text-white/30">Subscription</div>
                  <div className="text-lg text-white/80 mt-1 capitalize">{overview.subscriptionStatus || 'free'}</div>
                  <div className="text-xs text-white/30 mt-1">Agent limit: {overview.agentLimit ?? '—'}</div>
                </div>

                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="text-xs uppercase tracking-widest text-white/30">Credits</div>
                  <div className="text-lg text-white/80 mt-1">
                    {overview.creditsRemaining ?? '—'} / {overview.creditsLimit ?? '—'}
                  </div>
                  <div className="text-xs text-white/30 mt-1">{overview.creditsExplained || ''}</div>
                </div>
                <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="text-xs uppercase tracking-widest text-white/30">Performance</div>
                  <div className="text-lg text-white/80 mt-1">{overview.successRate ?? '—'}%</div>
                  <div className="text-xs text-white/30 mt-1">{overview.successRateExplained || ''}</div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Profile Section */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-white/60">
            <UserCircle size={20} weight="duotone" />
            <h2 className="text-lg font-medium">Profile</h2>
          </div>
          <Card className="p-8 bg-white/5 border border-white/5 rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/20 border-white/10"
              />
              <Input
                label="Email Address"
                value={email}
                disabled
                className="bg-black/10 border-white/5 text-white/40"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Time zone"
                placeholder="e.g. America/Los_Angeles"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="bg-black/20 border-white/10"
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleUpdateProfile}
                loading={saving}
                disabled={saving}
                className="rounded-full px-8"
              >
                Update Profile
              </Button>
            </div>
          </Card>
        </section>

        {/* Danger Zone */}
        <section className="pt-12">
          <Card className="p-8 bg-red-500/[0.02] border border-red-500/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-400/80 uppercase tracking-widest text-[10px] font-bold">
              <Trash weight="fill" />
              Danger Zone
            </div>
            <p className="text-sm text-white/30 mb-6">
              Deleting your account will purge all agents, integration tokens, and execution history. This is irreversible.
            </p>
            <Button className="border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 rounded-full px-6 text-sm">
              Delete Account
            </Button>
          </Card>
        </section>

      </div>
    </motion.div>
  );
}
