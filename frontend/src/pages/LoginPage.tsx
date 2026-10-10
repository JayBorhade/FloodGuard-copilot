import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { firebaseAuthConfigured } from '../lib/firebase';
import { onboardingService } from '../services/onboarding';

function getNextOnboardingPath(): string {
  const state = onboardingService.getState();
  if (state?.completed) return '/home';
  switch (state?.step) {
    case 'contacts': return '/onboarding/contacts';
    case 'location': return '/onboarding/location';
    case 'verification': return '/onboarding/location-verification';
    case 'complete': return '/home';
    case 'personal':
    default: return '/onboarding/personal';
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, loginDemo, loginWithEmail, createAccount, error: authError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(getNextOnboardingPath(), { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (mode === 'signup') {
        await createAccount(displayName, email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate(getNextOnboardingPath(), { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await loginDemo();
      navigate(getNextOnboardingPath(), { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Demo sign-in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-shell auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>{mode === 'signup' ? 'Create your FloodGuard account' : 'Sign in to FloodGuard'}</h1>
          <p className="auth-subtitle">Get flood safety guidance and keep important contacts close.</p>

          {(error || authError) && <div className="notification-error" role="alert">{error || authError}</div>}

          <form className="auth-form" onSubmit={handleEmailSubmit}>
            {mode === 'signup' && (
              <div className="form-group">
                <label htmlFor="authName">Full name</label>
                <input id="authName" name="name" autoComplete="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="authEmail">Email</label>
              <input id="authEmail" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="authPassword">Password</label>
              <input id="authPassword" name="password" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <button type="submit" className="primary-button auth-button" disabled={isLoading || isSubmitting || !firebaseAuthConfigured}>
              {isSubmitting ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in with email'}
            </button>
          </form>

          {!firebaseAuthConfigured && (
            <p className="auth-note">Email sign-in is disabled until Firebase Web Authentication is configured. Demo access is available for development.</p>
          )}
          {firebaseAuthConfigured && (
            <p className="auth-note">Email/password authentication uses your configured Firebase project. Enable Email/Password in the Firebase Console.</p>
          )}

          <button type="button" className="secondary-button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); }} disabled={isSubmitting}>
            {mode === 'signin' ? 'Create a new account' : 'Already have an account? Sign in'}
          </button>

          <div className="auth-divider">or</div>
          <button type="button" className="primary-button auth-button" onClick={handleDemoLogin} disabled={isLoading || isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Continue with Demo'}
          </button>

          <div className="demo-notice">
            <span aria-hidden="true">ⓘ</span>
            <div><strong>Development access</strong><p>Demo sessions are explicitly labelled and are not production accounts.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
