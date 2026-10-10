import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { onboardingService } from '../services/onboarding';

function getNextOnboardingPath(): string {
  const state = onboardingService.getState();
  if (state?.completed) return '/home';
  switch (state?.step) {
    case 'contacts':
      return '/onboarding/contacts';
    case 'location':
      return '/onboarding/location';
    case 'verification':
      return '/onboarding/location-verification';
    case 'complete':
      return '/home';
    case 'personal':
    default:
      return '/onboarding/personal';
  }
}

export function LoginPage() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, loginDemo, error: authError } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(getNextOnboardingPath(), { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

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
          <h1>Sign in to FloodGuard</h1>
          <p className="auth-subtitle">
            Get real-time flood alerts and safety guidance for your area.
          </p>

          {(error || authError) && <div className="notification-error" role="alert">{error || authError}</div>}

          <div className="auth-form">
            <button
              type="button"
              className="primary-button auth-button"
              onClick={handleDemoLogin}
              disabled={isLoading || isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Continue with Demo'}
            </button>
            <div className="auth-divider">or</div>
            <p className="auth-note">
              Real account sign-in is not configured in this build. Demo access is available only
              when the backend is running in development mode.
            </p>
          </div>

          <div className="demo-notice">
            <span aria-hidden="true">ⓘ</span>
            <div>
              <strong>Development environment</strong>
              <p>Demo access is clearly labelled and is not a production identity.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
