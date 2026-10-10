import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingService } from '../services/onboarding';

export function OnboardingPersonalPage() {
  const navigate = useNavigate();
  const savedState = onboardingService.getState();
  const [displayName, setDisplayName] = useState(savedState?.personal_info?.display_name ?? '');
  const [email, setEmail] = useState(savedState?.personal_info?.email ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const name = displayName.trim();
    if (!name) {
      setError('Please enter your name');
      return;
    }

    const current = onboardingService.getState();
    onboardingService.setState({
      ...(current ?? { step: 'personal', completed: false }),
      step: 'contacts',
      completed: false,
      personal_info: { ...(current?.personal_info ?? {}), display_name: name, email: email.trim() || undefined },
    });
    navigate('/onboarding/contacts');
  };

  const handleSkip = () => {
    onboardingService.updateStep('contacts');
    navigate('/onboarding/contacts');
  };

  return (
    <section className="page-shell onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="onboarding-progress">
            <div className="progress-step completed">1</div>
            <div className="progress-line" />
            <div className="progress-step">2</div>
            <div className="progress-line" />
            <div className="progress-step">3</div>
            <div className="progress-line" />
            <div className="progress-step">4</div>
          </div>
        </div>

        <div className="onboarding-card">
          <h1>Tell us about yourself</h1>
          <p>We'll use this information to personalize your flood safety experience.</p>
          {error && <div className="notification-error" role="alert">{error}</div>}

          <form
            className="onboarding-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleContinue();
            }}
          >
            <div className="form-group">
              <label htmlFor="displayName">Full name *</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                required
                placeholder="Your name"
                value={displayName}
                onChange={(event) => {
                  setDisplayName(event.target.value);
                  setError(null);
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="onboarding-actions">
              <button type="submit" className="primary-button">Continue</button>
              <button type="button" className="secondary-button" onClick={handleSkip}>Skip</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
