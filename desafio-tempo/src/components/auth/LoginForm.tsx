'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/service/auth.service';

interface AuthState {
  login: (email: string, password: string) => Promise<void>;
}

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state: AuthState) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email) {
        throw new Error('El email es requerido');
      }
      if (!password) {
        throw new Error('La contraseña es requerida');
      }

      await login(email, password);
      
      router.push('/home');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ha ocurrido un error durante el inicio de sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      <div>
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
        >
          Iniciar sesión
        </Button>
      </div>
    </form>
  );
} 