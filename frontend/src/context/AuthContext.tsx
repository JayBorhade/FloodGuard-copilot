import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { AuthenticatedUser, AuthSessionResponse } from '../types/auth';
import { authService } from '../services/auth';
import { firebaseAuth } from '../lib/firebase';

export interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  error: string | null;
  loginDemo: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  createAccount: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applySession = useCallback((session: AuthSessionResponse) => {
    setIsAuthenticated(session.authenticated);
    setUser(session.user ?? null);
    setError(null);
  }, []);

  const restoreSession = useCallback(async () => {
    setIsLoading(true);
    try {
      applySession(await authService.getSession());
    } catch (cause) {
      setIsAuthenticated(false);
      setUser(null);
      setError(cause instanceof Error ? cause.message : 'Failed to restore session');
    } finally {
      setIsLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    if (!firebaseAuth) {
      void restoreSession();
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      if (!firebaseUser && !authService.getToken()) {
        setIsAuthenticated(false);
        setUser(null);
        setError(null);
        setIsLoading(false);
        return;
      }
      void restoreSession();
    });
    return unsubscribe;
  }, [restoreSession]);

  const loginDemo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      applySession(await authService.loginDemo());
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
  }, [applySession]);

  const loginWithEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      applySession(await authService.signIn(email, password));
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Sign-in failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [applySession]);

  const createAccount = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      applySession(await authService.createAccount(name, email, password));
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Account creation failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [applySession]);

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
    () => ({ isLoading, isAuthenticated, user, error, loginDemo, loginWithEmail, createAccount, logout }),
    [isLoading, isAuthenticated, user, error, loginDemo, loginWithEmail, createAccount, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
