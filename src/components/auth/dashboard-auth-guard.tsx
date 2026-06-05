'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getAdminAccessToken } from '@/lib/api';

export function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = getAdminAccessToken();
    if (!token) {
      router.replace(`/${lang}/login`);
    } else {
      setChecking(false);
    }
  }, [router, lang]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-light">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
