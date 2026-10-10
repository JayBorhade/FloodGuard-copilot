import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthenticatedUser } from '../types/auth';
import { authService } from '../services/auth';

export interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  error: string | null;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await authService.getSession();
      setIsAuthenticated(session.authenticated);
      setUser(session.user ?? null);
      setError(null);
    } catch (cause) {
      authService.clearToken();
      setIsAuthenticated(false);
      setUser(null);
      setError(cause instanceof Error ? cause.message : 'Failed to restore session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  const loginDemo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await authService.loginDemo();
      setIsAuthenticated(session.authenticated);
      setUser(session.user ?? null);
      if (!session.authenticated || !session.user) {
        throw new Error('Demo sign-in did not return an authenticated session.');
      }
    } catch (cause) {
      authService.clearToken();
      setIsAuthenticated(false);
      setUser(null);
      const message = cause instanceof Error ? cause.message : 'Demo sign-in failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Logout failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ isLoading, isAuthenticated, user, error, loginDemo, logout }),
    [isLoading, isAuthenticated, user, error, loginDemo, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
