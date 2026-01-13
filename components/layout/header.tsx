'use client';

import { useEffect, useState } from 'react';
import { Bell, ChevronDown, Menu, Search, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api, clearToken } from '@/lib/api';
import { NotificationDrawer } from '@/components/dashboard/NotificationDrawer';

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [profile, setProfile] = useState<any | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const res: any = await api.getProfile();
        setProfile(res?.user || res?.profile || res);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const openNotifications = async () => {
    setNotificationsOpen(true);
    try {
      const res = await api.syncNotifications();
      setNotifications(res.notifications || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    try {
      await api.logout();
      router.replace('/auth');
    } catch (e) {
      console.error(e);
      // Even if API call fails, clear token locally and redirect
      clearToken();
      router.replace('/auth');
    }
  };

  return (
    <header className="flex p-5 justify-end">
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onDismissAll={() => setNotifications([])}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={openNotifications}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/2 border-2 border-white/3 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open notifications"
        >
          <Bell size={18} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-base text-[10px] font-semibold text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex py-2.5 px-5 bg-white/2 border-2 border-white/3 rounded-full items-center gap-2 hover:bg-white/5 transition-colors"
            aria-label="User menu"
          >
            {/* <Image src={profile?.profileImageUrl || "/tayo.png"} alt="Avatar" width={30} height={30} /> */}
            <div className="hidden md:block text-sm font-medium">
              {profile?.name || profile?.email || 'Account'}
            </div>
            <ChevronDown size={15} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white/5 border border-white/10 rounded-xl shadow-lg backdrop-blur-md z-50">
              <div className="py-2">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
