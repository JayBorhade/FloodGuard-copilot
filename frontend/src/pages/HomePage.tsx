import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapLibreMap } from '../components/MapLibreMap';
import { RiskCard } from '../components/RiskCard';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../hooks/useAuth';
import { useFloodRisk } from '../hooks/useFloodRisk';
import { useLocation } from '../hooks/useLocation';
import { locationService } from '../services/location';
import { onboardingService } from '../services/onboarding';
import { UserLocation } from '../types/user';

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [showMapFull, setShowMapFull] = useState(false);
  const { risk, loading: riskLoading } = useFloodRisk(userLocation);

  // Check onboarding and location on mount
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    if (authLoading) return;

    const onboarding = onboardingService.getState();
    if (!onboarding?.completed) {
      navigate('/onboarding/personal', { replace: true });
      return;
    }

    const storedLocation = locationService.getUserLocation();
    if (storedLocation) {
      setUserLocation(storedLocation);
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading) {
    return (
      <section className="page-shell">
        <div className="loading-state">
          <div className="loading-spinner" />
          <strong>Loading...</strong>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell home-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>FloodGuard Dashboard</h1>
          {user?.display_name && (
            <p className="page-subtitle">
              Hello, {user.display_name}. Staying safe in {userLocation ? 'your area' : 'unknown location'}.
            </p>
          )}
          {user?.is_demo && <p className="demo-indicator">Demo Mode</p>}
        </div>
        <StatusBadge tone="info" label={userLocation ? 'Location Set' : 'No Location'} />
      </div>

      {user?.is_demo && (
        <div className="demo-notice">
          <span aria-hidden="true">ⓘ</span>
          <div>
            <strong>Development Preview</strong>
            <p>You are viewing FloodGuard in demo mode with sample data.</p>
          </div>
        </div>
      )}

      <div className="dashboard-main-grid">
        {/* Risk Card */}
        <div className="dashboard-section">
          {riskLoading ? (
            <div className="card risk-card">
              <div className="loading-inline">Loading risk data...</div>
            </div>
          ) : userLocation ? (
            <RiskCard risk={risk} />
          ) : (
            <div className="card risk-card unavailable">
              <p>Location not available. Set your location to view flood risk.</p>
            </div>
          )}
        </div>

        {/* Map Preview */}
        {userLocation && !showMapFull && (
          <div className="dashboard-section">
            <div className="card map-preview-card">
              <div className="map-preview-container" style={{ height: '300px' }}>
                <MapLibreMap
                  latitude={userLocation.latitude}
                  longitude={userLocation.longitude}
                  zoom={12}
                />
              </div>
              <button
                className="tertiary-button"
                onClick={() => setShowMapFull(true)}
              >
                View full map
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="section-heading">
        <div>
          <p className="eyebrow">Quick Actions</p>
          <h2>Stay Prepared</h2>
        </div>
      </div>

      <div className="dashboard-actions-grid">
        <a href="/notifications" className="action-card card">
          <span className="action-icon">⚑</span>
          <h3>Notifications</h3>
          <p>View alerts and updates</p>
        </a>
        <a href="/contacts" className="action-card card">
          <span className="action-icon">☎</span>
          <h3>Emergency Contacts</h3>
          <p>Quick access to trusted people</p>
        </a>
        <a href="/map" className="action-card card">
          <span className="action-icon">⌖</span>
          <h3>Flood Map</h3>
          <p>Explore flood zones</p>
        </a>
      </div>
    </section>
  );
}
