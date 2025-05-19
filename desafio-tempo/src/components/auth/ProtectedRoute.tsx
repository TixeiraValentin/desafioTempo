import { useAuthStore } from '@/lib/service/auth.service';
import NotFound from '@/app/not-found';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface AuthState {
  isAuthenticated: boolean;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <NotFound />;
  }

  return <>{children}</>;
} 