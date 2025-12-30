'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SquaresFour,
  CpuIcon,
  PuzzlePiece,
  PlugsIcon,
  CreditCard,
  Gear,
} from '@phosphor-icons/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: SquaresFour },
  { name: 'Agents', href: '/dashboard/agents', icon: CpuIcon },
  { name: 'Templates', href: '/dashboard/templates', icon: PuzzlePiece },
  { name: 'Integrations', href: '/dashboard/integrations', icon: PlugsIcon },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: Gear },
];

export function Sidebar({ collapsed = false }) {
  const pathname = usePathname();

  return (
    <aside className="flex md:h-full h-fit fixed md:relative z-50 bottom-0 backdrop-blur-md w-full md:w-fit md:items-center justify-center md:flex-col bg-black/25 transition-all duration-300">
      {/* Logo */}
      <div className="md:block hidden p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={24} height={24} />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex md:h-full h-fit md:flex-col justify-center gap-3 md:space-y-4 py-4">
        {navigation.map(({ name, href, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={name}
              href={href}
              title={collapsed ? name : undefined}
              className={cn(
                'flex w-fit h-fit items-center gap-3 rounded-xl p-3 transition-all',
                'hover:bg-white/4',
                isActive
                  ? 'bg-base/10 text-base font-medium'
                  : 'text-white/35 hover:text-white/50'
              )}
            >
              <Icon
                size={20}
                weight={isActive ? 'fill' : 'bold'}
                className="flex-shrink-0"
              />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
