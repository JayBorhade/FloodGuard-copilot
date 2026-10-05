import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingService } from '../services/onboarding';

export function OnboardingPersonalPage() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!displayName.trim()) {
      setError('Please enter your name');
      return;
    }

    onboardingService.setState({
      step: 'contacts',
      completed: false,
      personal_info: { display_name: displayName, email: email || undefined },
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
            onSubmit={(e) => {
              e.preventDefault();
              handleContinue();
            }}
          >
            <div className="form-group">
              <label htmlFor="displayName">Full name *</label>
              <input
                id="displayName"
                type="text"
                placeholder="Your name"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setError(null);
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="onboarding-actions">
              <button type="submit" className="primary-button">
                Continue
              </button>
              <button type="button" className="secondary-button" onClick={handleSkip}>
                Skip
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
