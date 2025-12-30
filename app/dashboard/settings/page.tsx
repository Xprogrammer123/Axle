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

export default function SettingsPage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data: any = await api.getProfile();
        const user = data.user || data?.profile || data;
        if (user) {
          setProfile(user);
          setName(user.name || '');
          setEmail(user.email || '');
          setTimeZone(user.timeZone || '');
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const payload: any = { name, timeZone };
      await api.updateProfile(payload);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-38">

      <div>
        <h1 className="text-3xl font-light text-white tracking-tight">Settings</h1>
        <p className="text-white/40 mt-1">Manage your identity and platform preferences.</p>
      </div>

      <div className="space-y-8">

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
                disabled={saving}
                className="bg-base text-black hover:bg-white/90 rounded-full px-8"
              >
                {saving ? 'Saving...' : 'Update Profile'}
              </Button>
            </div>
          </Card>
        </section>

        {/* Preferences */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-white/60">
            <Globe size={20} weight="duotone" />
            <h2 className="text-lg font-medium">Platform</h2>
          </div>
          <Card className="p-8 bg-white/5 border border-white/5 rounded-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white/80">Automatic Backups</div>
                <div className="text-xs text-white/30">Save agent execution memory once a week.</div>
              </div>
              <div className="w-12 h-6 bg-emerald-500/20 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-emerald-400 rounded-full ml-auto" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white/80">Notification Emails</div>
                <div className="text-xs text-white/30">Receive summaries of failed executions.</div>
              </div>
              <div className="w-12 h-6 bg-white/10 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white/20 rounded-full" />
              </div>
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
    </div>
  );
}
