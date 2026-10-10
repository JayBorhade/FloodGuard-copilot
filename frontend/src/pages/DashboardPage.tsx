import { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';
import { locationService } from '../services/location';
import { floodRiskService, type RiskData } from '../services/flood-risk';

function formatUpdatedAt(value: string): string {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? new Date(timestamp).toLocaleString() : 'Not available';
}

export function DashboardPage() {
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const location = locationService.getUserLocation();

  const loadRisk = useCallback(async () => {
    if (!location) {
      setRisk(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await floodRiskService.getCurrentRisk(location.latitude, location.longitude);
      setRisk(result);
      if (!result.data_available) {
        setError('Trusted live flood data is not connected. Unknown means unassessed, not safe.');
      }
    } finally {
      setLoading(false);
    }
  }, [location?.latitude, location?.longitude]);

  useEffect(() => {
    void loadRisk();
  }, [loadRisk, refreshIndex]);

  const riskTone = risk?.level ?? 'unknown';
  const riskLabel = risk?.level ? risk.level.toUpperCase() : 'UNKNOWN';

  return (
    <section className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">FloodGuard overview</p>
          <h1>Stay prepared.</h1>
          <p className="page-subtitle">
            Review the current assessment status for your saved location. An unknown reading is not a safety clearance.
          </p>
        </div>
        <StatusBadge tone={riskTone} label={loading ? 'Updating…' : riskLabel} />
      </div>

      <div className="demo-notice" role="status">
        <span aria-hidden="true">ⓘ</span>
        <div>
          <strong>Data connection status</strong>
          <p>Flood risk API is connected, but trusted live rainfall, river gauge, and official alert feeds are not yet configured.</p>
        </div>
      </div>

      {error && <div className="notification-error" role="alert">{error}</div>}

      <div className="dashboard-grid">
        <article className="risk-card card">
          <div className="card-topline">
            <span className="section-label">Current flood risk</span>
            <StatusBadge tone={riskTone} label={loading ? 'Loading' : riskLabel} />
          </div>
          <div className="risk-value">
            <strong>{loading ? 'Checking assessment…' : risk?.data_available ? `${risk.score}/100` : 'Not assessed'}</strong>
          </div>
          <p className="risk-copy">
            {risk?.summary ?? (location
              ? 'Waiting for the flood-risk service.'
              : 'Set a location to request a risk assessment. No location is saved on this device.')}
          </p>
          {risk && (
            <div className="risk-metadata">
              <p><strong>Confidence:</strong> {risk.data_available ? `${risk.confidence}%` : 'Unavailable'}</p>
              <p><strong>Source:</strong> {risk.source}</p>
              <p><strong>Last update:</strong> {formatUpdatedAt(risk.updated_at)}</p>
              <p><strong>Freshness:</strong> {!risk.data_available ? 'No live evidence' : risk.is_stale ? 'Stale or unknown' : `${risk.data_age_minutes ?? 'Unknown'} min old`}</p>
            </div>
          )}
          <div className="dashboard-actions">
            <button type="button" className="secondary-button" onClick={() => setRefreshIndex((value) => value + 1)} disabled={loading}>
              Refresh assessment
            </button>
            <NavLink className="secondary-button" to="/onboarding/location">Update location</NavLink>
          </div>
        </article>
        <article className="map-preview card">
          <div className="map-preview-copy">
            <p className="eyebrow">Map preview</p>
            <h2>Location and flood layers</h2>
            <p>Map layers and verified hazard overlays are not connected yet. No route or area is currently marked safe.</p>
            <NavLink className="primary-button" to="/map">Open flood map</NavLink>
          </div>
        </article>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Be ready</p>
          <h2>Safety tools</h2>
        </div>
      </div>
      <div className="tool-grid">
        <NavLink className="tool-card card" to="/contacts">
          <span className="tool-icon" aria-hidden="true">☎</span>
          <div><h3>Emergency contacts</h3><p>Keep trusted people close.</p></div>
        </NavLink>
        <NavLink className="tool-card card" to="/notifications">
          <span className="tool-icon" aria-hidden="true">⚑</span>
          <div><h3>Notifications</h3><p>Review available updates.</p></div>
        </NavLink>
        <NavLink className="tool-card card" to="/map">
          <span className="tool-icon" aria-hidden="true">⌖</span>
          <div><h3>Flood map</h3><p>Open the map integration status.</p></div>
        </NavLink>
      </div>
    </section>
  );
}
