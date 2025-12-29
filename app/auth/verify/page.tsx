"use client"
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/toast';

export default function VerifyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <VerifyClient />
    </Suspense>
  );
}

/* ---------------- Client Logic ---------------- */

function VerifyClient() {
  'use client';

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      router.replace('/auth');
      return;
    }

    const verify = async () => {
      try {
        await api.verifyMagicLink(token);
        showToast('success', 'Successfully signed in!');
        router.replace('/dashboard');
      } catch (error: any) {
        showToast('error', error.message || 'Invalid or expired link');
        router.replace('/auth');
      }
    };

    verify();
  }, [searchParams, router, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#36B460] mx-auto mb-4" />
        <p className="text-muted-foreground">Verifying your magic link...</p>
      </div>
    </div>
  );
}

/* ---------------- Fallback ---------------- */

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
