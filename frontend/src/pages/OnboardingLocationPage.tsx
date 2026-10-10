import { useNavigate } from 'react-router-dom';
import { useLocation } from '../hooks/useLocation';
import { locationService } from '../services/location';
import { onboardingService } from '../services/onboarding';

export function OnboardingLocationPage() {
  const navigate = useNavigate();
  const { location, state, error, requestLocation } = useLocation();

  const handleUseLocation = () => {
    if (location) {
      locationService.storeUserLocation(location);
      const current = onboardingService.getState();
      onboardingService.setState({
        ...(current ?? { step: 'personal', completed: false }),
        step: 'verification',
        location,
      });
      navigate('/onboarding/location-verification');
    }
  };

  const handleSkip = () => {
    onboardingService.updateStep('verification');
    navigate('/onboarding/location-verification');
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
            <div className="progress-step">4</div>
          </div>
        </div>

        <div className="onboarding-card">
          <h1>Set your location</h1>
          <p>
            FloodGuard uses your location to provide accurate flood risk assessments and alerts for
            your area. Your location data is only used for safety services.
          </p>

          <div className="location-section">
            {state === 'requesting' && (
              <div className="location-state">
                <div className="loading-spinner" />
                <p>Requesting your location...</p>
              </div>
            )}

            {state === 'granted' && location && (
              <div className="location-display">
                <p className="location-granted">
                  ✓ Location granted
                </p>
                <p className="location-coords">
                  Latitude: {location.latitude.toFixed(4)}°
                  <br />
                  Longitude: {location.longitude.toFixed(4)}°
                  <br />
                  Accuracy: {location.accuracy_meters?.toFixed(0) || 'Unknown'} meters
                </p>
              </div>
            )}

            {state === 'denied' && (
              <div className="notification-error">
                <strong>Location access denied</strong>
                <p>
                  Please enable location access in your browser settings to use FloodGuard's full
                  features.
                </p>
              </div>
            )}

            {state === 'unavailable' && (
              <div className="notification-error">
                <strong>Location unavailable</strong>
                <p>Your location could not be determined. Please try again or enter it manually.</p>
              </div>
            )}

            {state === 'timeout' && (
              <div className="notification-error">
                <strong>Location request timed out</strong>
                <p>Please try again or skip to enter your location manually later.</p>
              </div>
            )}

            {error && <p className="error-text">{error}</p>}
          </div>

          <div className="onboarding-actions">
            {state !== 'requesting' && state !== 'granted' && (
              <button type="button" className="primary-button" onClick={requestLocation}>
                Request location access
              </button>
            )}

            {state === 'granted' && (
              <button type="button" className="primary-button" onClick={handleUseLocation}>
                Use this location
              </button>
            )}

            <button type="button" className="secondary-button" onClick={handleSkip}>
              Continue without location
            </button>
          </div>

          <div className="demo-notice">
            <span aria-hidden="true">ⓘ</span>
            <div>
              <strong>Privacy note</strong>
              <p>
                Your location is processed locally and only sent to FloodGuard servers for safety
                analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
