import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../hooks/useLocation';
import { locationService } from '../services/location';
import { onboardingService } from '../services/onboarding';
import type { UserLocation } from '../types/user';

export function OnboardingLocationPage() {
  const navigate = useNavigate();
  const { location, state, error, requestLocation } = useLocation();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);

  const saveLocationAndContinue = (nextLocation: UserLocation) => {
    locationService.storeUserLocation(nextLocation);
    const current = onboardingService.getState();
    onboardingService.setState({
      ...(current ?? { step: 'personal', completed: false }),
      step: 'verification',
      completed: false,
      location: nextLocation,
    });
    navigate('/onboarding/location-verification');
  };

  const handleUseLocation = () => {
    if (location) saveLocationAndContinue(location);
  };

  const handleManualLocation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (!latitude.trim() || !longitude.trim() || !Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setManualError('Enter a valid latitude from -90 to 90 and longitude from -180 to 180.');
      return;
    }
    setManualError(null);
    saveLocationAndContinue({ latitude: lat, longitude: lon, verified_at: null });
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
            <div className="progress-step completed">1</div><div className="progress-line" />
            <div className="progress-step completed">2</div><div className="progress-line" />
            <div className="progress-step completed">3</div><div className="progress-line" />
            <div className="progress-step">4</div>
          </div>
        </div>

        <div className="onboarding-card">
          <h1>Set your location</h1>
          <p>Choose device location or enter coordinates manually. Location improves relevance, but you can continue without it.</p>

          <div className="location-section">
            {state === 'requesting' && <div className="location-state"><div className="loading-spinner" /><p>Requesting your location...</p></div>}
            {state === 'granted' && location && (
              <div className="location-display">
                <p className="location-granted">✓ Location available</p>
                <p className="location-coords">
                  Latitude: {location.latitude.toFixed(4)}°<br />
                  Longitude: {location.longitude.toFixed(4)}°<br />
                  Accuracy: {location.accuracy_meters != null ? `${location.accuracy_meters.toFixed(0)} meters` : 'Manually entered'}
                </p>
              </div>
            )}
            {error && <p className="error-text" role="status">{error}</p>}
          </div>

          <div className="onboarding-actions">
            {state !== 'requesting' && (
              <button type="button" className="primary-button" onClick={requestLocation}>Use device location</button>
            )}
            {state === 'granted' && location && (
              <button type="button" className="secondary-button" onClick={handleUseLocation}>Continue with saved location</button>
            )}
            <button type="button" className="secondary-button" onClick={handleSkip}>Continue without location</button>
          </div>

          <form className="onboarding-form" onSubmit={handleManualLocation}>
            <h3>Or enter coordinates</h3>
            {manualError && <div className="notification-error" role="alert">{manualError}</div>}
            <div className="form-group">
              <label htmlFor="manualLatitude">Latitude</label>
              <input id="manualLatitude" inputMode="decimal" placeholder="e.g. 18.5204" value={latitude} onChange={(event) => setLatitude(event.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="manualLongitude">Longitude</label>
              <input id="manualLongitude" inputMode="decimal" placeholder="e.g. 73.8567" value={longitude} onChange={(event) => setLongitude(event.target.value)} required />
            </div>
            <button type="submit" className="primary-button">Save coordinates</button>
          </form>

          <div className="demo-notice">
            <span aria-hidden="true">ⓘ</span>
            <div><strong>Privacy note</strong><p>Location and onboarding details are saved in this browser for this demo. They are not synced to a server account.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
