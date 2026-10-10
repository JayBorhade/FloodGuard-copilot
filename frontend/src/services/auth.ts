import { fetchJson } from '../lib/api';
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
    const token = this.getToken();
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

  async logout(): Promise<void> {
    this.clearToken();
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export const authService = new AuthService();
