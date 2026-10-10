import { useNavigate } from 'react-router-dom';
import { locationService } from '../services/location';
import { onboardingService } from '../services/onboarding';

export function OnboardingVerificationPage() {
  const navigate = useNavigate();
  const state = onboardingService.getState();
  const location = locationService.getUserLocation() ?? state?.location ?? null;
  const contacts = state?.contacts ?? [];

  const handleComplete = () => {
    if (location) {
      locationService.storeUserLocation(location);
      locationService.storeVerifiedLocation({ ...location, verified_at: new Date().toISOString() });
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
          <p>Review your setup before continuing. You can change these details later.</p>
          <div className="verification-summary">
            {state?.personal_info?.display_name && (
              <div className="summary-item"><strong>Name:</strong> {state.personal_info.display_name}</div>
            )}
            {state?.personal_info?.email && (
              <div className="summary-item"><strong>Email:</strong> {state.personal_info.email}</div>
            )}
            {contacts.length > 0 && (
              <div className="summary-item"><strong>Emergency contacts:</strong> {contacts.length} added</div>
            )}
            {location && (
              <div className="summary-item">
                <strong>Location:</strong> Saved ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})
              </div>
            )}
            {!location && <div className="summary-item"><strong>Location:</strong> Not set — you can add it later.</div>}
          </div>

          <div className="demo-notice">
            <span aria-hidden="true">ⓘ</span>
            <div>
              <strong>Welcome to FloodGuard</strong>
              <p>Demo onboarding data is saved in this browser only. It is not synced to a server account.</p>
            </div>
          </div>

          <div className="onboarding-actions">
            <button type="button" className="primary-button" onClick={handleComplete}>Go to FloodGuard</button>
          </div>
        </div>
      </div>
    </section>
  );
}
