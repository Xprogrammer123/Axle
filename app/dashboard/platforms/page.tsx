'use client';

import { useEffect, useState } from 'react';
import { Grid3x3, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge, Skeleton } from '@/components/ui/utils';
import { useToast } from '@/components/ui/toast';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

const PLATFORM_ICONS: Record<string, string> = {
  github: '/github.svg',
  slack: '/slack.svg',
  x: '/x.svg',
  google: '/gmail.svg',
  instagram: '/instagram.svg',
};

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const data = await api.getPlatforms();
      setPlatforms((data.platforms || []).filter(Boolean));
    } catch (error) {
      console.error('Failed to fetch platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (providerId: string) => {
    setSyncing(providerId);
    try {
      await api.syncPlatform(providerId);
      await fetchPlatforms();
      showToast('success', 'Platform synced successfully!');
    } catch (error: any) {
      showToast('error', error.message || 'Failed to sync platform');
    } finally {
      setSyncing(null);
    }
  };

  const handleConnect = async (providerId: string) => {
    try {
      const { url } = await api.connectIntegration(providerId);
      window.location.href = url;
    } catch (error: any) {
      showToast('error', error.message);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Platforms</h1>
        <div className="page-loader" style={{ minHeight: 140 }}>
          <div className="loader-light" />
          <div className="page-loader-text">Loading platforms…</div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Unbounded, sans-serif' }}>
          Platforms
        </h1>
        <p className="text-[#8b8b8b]">
          Manage your connected platforms and services
        </p>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {platforms.map((platform) => {
          const icon = PLATFORM_ICONS[platform.id] || '/stuff.svg';
          
          return (
            <motion.div
              key={platform.id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <Card hover className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                    <img src={icon} alt={platform.name} className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{platform.name}</h3>
                    <Badge className="mt-1">{platform.category}</Badge>
                  </div>
                </div>
                {platform.connected ? (
                  <CheckCircle className="text-[#3ecf8e]" size={20} />
                ) : (
                  <XCircle className="text-[#8b8b8b]" size={20} />
                )}
              </div>

              {platform.lastUsedAt && (
                <p className="text-sm text-[#8b8b8b] mb-4">
                  Last used: {new Date(platform.lastUsedAt).toLocaleDateString()}
                </p>
              )}

              <div className="flex gap-2">
                {platform.connected ? (
                  <Button
                    variant="outline"
                    className="flex-1"
                    size="sm"
                    onClick={() => handleSync(platform.id)}
                    loading={syncing === platform.id}
                  >
                    <RefreshCw size={16} />
                    Sync
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="flex-1"
                    size="sm"
                    onClick={() => handleConnect(platform.id)}
                  >
                    Connect
                  </Button>
                )}
              </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
