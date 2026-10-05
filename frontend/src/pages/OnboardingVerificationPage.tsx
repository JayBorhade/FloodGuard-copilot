import { useNavigate } from 'react-router-dom';
import { locationService } from '../services/location';
import { onboardingService } from '../services/onboarding';

export function OnboardingVerificationPage() {
  const navigate = useNavigate();
  const location = locationService.getUserLocation();
  const state = onboardingService.getState();

  const handleComplete = () => {
    if (location) {
      locationService.storeVerifiedLocation(location);
    }
    onboardingService.completeOnboarding();
    navigate('/home', { replace: true });
  };

  return (
    <section className="page-shell onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="onboarding-progress">
            <div className="progress-step completed">1</div>
            <div className="progress-line" />
            <div className="progress-step completed">2</div>
            <div className="progress-line" />
            <div className="progress-step completed">3</div>
            <div className="progress-line" />
            <div className="progress-step completed">4</div>
          </div>
        </div>

        <div className="onboarding-card">
          <h1>You're all set!</h1>
          <p>Your FloodGuard account is ready.</p>

          <div className="verification-summary">
            {state?.personal_info?.display_name && (
              <div className="summary-item">
                <strong>Name:</strong> {state.personal_info.display_name}
              </div>
            )}

            {state?.contacts && state.contacts.length > 0 && (
              <div className="summary-item">
                <strong>Emergency contacts:</strong> {state.contacts.length} added
              </div>
            )}

            {location && (
              <div className="summary-item">
                <strong>Location:</strong> Set ({location.accuracy_meters?.toFixed(0)}m accuracy)
              </div>
            )}
          </div>

          <div className="demo-notice">
            <span aria-hidden="true">ⓘ</span>
            <div>
              <strong>Welcome to FloodGuard</strong>
              <p>Stay safe and informed. Enable notifications to receive alerts for your area.</p>
            </div>
          </div>

          <div className="onboarding-actions">
            <button type="button" className="primary-button" onClick={handleComplete}>
              Go to FloodGuard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
