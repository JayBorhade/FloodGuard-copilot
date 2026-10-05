import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    navigate('/onboarding/personal', { replace: true });
    return null;
  }

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // In demo mode, the backend returns a demo user for unauthenticated requests
      // This simulates a user clicking "Continue as Demo"
      navigate('/onboarding/personal', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
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

          {error && <div className="notification-error" role="alert">{error}</div>}

          <div className="auth-form">
            <button
              className="primary-button auth-button"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Continue with Demo'}
            </button>

            <div className="auth-divider">or</div>

            <p className="auth-note">
              Firebase authentication will be available in production.
            </p>
          </div>

          <div className="demo-notice">
            <span aria-hidden="true">ⓘ</span>
            <div>
              <strong>Development environment</strong>
              <p>This is a development preview using demo credentials.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
