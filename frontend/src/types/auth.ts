export type UserRole = 'user' | 'admin' | 'demo';

export interface AuthenticatedUser {
  uid: string;
  email: string | null;
  display_name: string | null;
  role: UserRole;
  is_demo: boolean;
}

export interface AuthSessionResponse {
  authenticated: boolean;
  user: AuthenticatedUser | null;
  message?: string | null;
}

export interface AuthContext {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  error: string | null;
}
