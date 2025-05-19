'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Página no encontrada</h2>
      <p className="text-gray-600 mb-8">
        Lo sentimos, la página que estás buscando no existe o no está disponible.
      </p>
      <Button onClick={() => router.push('/login')}>
        Volver al inicio
      </Button>
    </div>
  );
} 