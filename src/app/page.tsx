'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/service/auth.service';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/home');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  return null;
}
