import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const fakeLogin = async (email: string, password: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const fakeToken = `fake-token-${Math.random().toString(36).substring(2)}`;
      resolve(fakeToken);
    }, 1000);
  });
};

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const token = await fakeLogin(email, password);
          set({ token, isAuthenticated: true });
        } catch (error) {
          console.error('Error durante el login:', error);
          throw error;
        }
      },
      logout: () => {
        set({ token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
); 