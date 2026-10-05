import { useEffect, useState } from 'react';
import { AuthContextType } from '../services/auth';
import { authService } from '../services/auth';

export function useAuth(): AuthContextType & { logout: () => Promise<void> } {
  const [auth, setAuth] = useState<AuthContextType>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  useEffect(() => {
    const restoreSession = async () => {
      try {
        setAuth((prev) => ({ ...prev, isLoading: true }));
        const session = await authService.getSession();
        setAuth({
          isLoading: false,
          isAuthenticated: session.authenticated,
          user: session.user || null,
          error: null,
        });
      } catch (error) {
        setAuth({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: error instanceof Error ? error.message : 'Failed to restore session',
        });
      }
    };

    restoreSession();
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
      setAuth({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
    } catch (error) {
      setAuth((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Logout failed',
      }));
    }
  };

  return { ...auth, logout };
}
