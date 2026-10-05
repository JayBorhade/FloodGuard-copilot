import { API_BASE_URL, fetchJson } from '../lib/api';
import { AuthSessionResponse } from '../types/auth';

export interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any | null;
  error: string | null;
}

class AuthService {
  async getSession(): Promise<AuthSessionResponse> {
    const token = this.getToken();
    return fetchJson<AuthSessionResponse>('/api/v1/auth/session', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  setToken(token: string): void {
    localStorage.setItem('floodguard_auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('floodguard_auth_token');
  }

  clearToken(): void {
    localStorage.removeItem('floodguard_auth_token');
  }
}

export const authService = new AuthService();
