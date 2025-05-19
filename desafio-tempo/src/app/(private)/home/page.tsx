'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/service/auth.service';
import { fetchAllItems } from '@/lib/service/api.service';
import ItemList from '@/components/items/ItemList';

interface AuthState {
  logout: () => void;
  isAuthenticated: boolean;
}

function HomeContent({ onLogout }: { onLogout: () => void }) {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: fetchAllItems,
    gcTime: Infinity,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button 
          variant="secondary" 
          onClick={onLogout}
        >
          Cerrar sesión
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error al cargar los datos</p>
        </div>
      ) : (
        <ItemList items={items || []} />
      )}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const logout = useAuthStore((state: AuthState) => state.logout);
  const [mounted, setMounted] = useState(false);
  const [isLogoutInProgress, setIsLogoutInProgress] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLogoutInProgress(true);
    router.push('/login');
  }, [router]);

  useEffect(() => {
    if (isLogoutInProgress) {
      const frame = requestAnimationFrame(() => {
        logout();
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isLogoutInProgress, logout]);

  if (!mounted || isLogoutInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <HomeContent onLogout={handleLogout} />
    </ProtectedRoute>
  );
} 