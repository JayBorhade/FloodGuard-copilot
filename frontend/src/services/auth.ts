import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { fetchJson } from '../lib/api';
import { firebaseAuth } from '../lib/firebase';
import type { AuthSessionResponse, AuthenticatedUser } from '../types/auth';

export interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  error: string | null;
}

const TOKEN_KEY = 'floodguard_auth_token';
const DEMO_TOKEN = 'demo-token';

class AuthService {
  async getSession(): Promise<AuthSessionResponse> {
    const token = this.getToken() ?? (await firebaseAuth?.currentUser?.getIdToken());
    return fetchJson<AuthSessionResponse>('/api/v1/auth/session', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async loginDemo(): Promise<AuthSessionResponse> {
    this.setToken(DEMO_TOKEN);
    try {
      const session = await this.getSession();
      if (!session.authenticated || !session.user) {
        throw new Error('The backend did not establish a demo session.');
      }
      return session;
    } catch (error) {
      this.clearToken();
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<AuthSessionResponse> {
    if (!firebaseAuth) {
      throw new Error('Firebase Authentication is not configured. Use demo access or configure the VITE_FIREBASE_* values.');
    }
    this.clearToken();
    await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
    return this.getAuthenticatedSession();
  }

  async createAccount(name: string, email: string, password: string): Promise<AuthSessionResponse> {
    if (!firebaseAuth) {
      throw new Error('Firebase Authentication is not configured. Configure the VITE_FIREBASE_* values to create an account.');
    }
    this.clearToken();
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email.trim(), password);
    if (name.trim()) {
      await updateProfile(credential.user, { displayName: name.trim() });
      await credential.user.getIdToken(true);
    }
    return this.getAuthenticatedSession();
  }

  async logout(): Promise<void> {
    this.clearToken();
    if (firebaseAuth?.currentUser) {
      await signOut(firebaseAuth);
    }
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getStorageScope(): string {
    if (this.getToken() === DEMO_TOKEN) return 'demo-user';
    return firebaseAuth?.currentUser?.uid ?? 'anonymous';
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  private async getAuthenticatedSession(): Promise<AuthSessionResponse> {
    const session = await this.getSession();
    if (!session.authenticated || !session.user) {
      throw new Error('Authentication succeeded, but the FloodGuard API did not validate the session. Check backend Firebase configuration.');
    }
    return session;
  }
}

export const authService = new AuthService();
