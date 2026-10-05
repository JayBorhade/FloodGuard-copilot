import { NavLink } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';

export function DashboardPage() {
  return (
    <section className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">FloodGuard overview</p>
          <h1>Stay prepared.</h1>
          <p className="page-subtitle">
            Set your location to receive verified guidance for your area.
          </p>
        </div>
        <StatusBadge tone="info" label="Demo state" />
      </div>
      <div className="demo-notice">
        <span aria-hidden="true">ⓘ</span>
        <div>
          <strong>Development preview</strong>
          <p>
            Risk, map, shelter, and alert data are unavailable until provider
            integrations are connected.
          </p>
        </div>
      </div>
      <div className="dashboard-grid">
        <article className="risk-card card">
          <div className="card-topline">
            <span className="section-label">Current risk</span>
            <StatusBadge tone="unknown" label="Unknown" />
          </div>
          <div className="risk-value">
            <strong>Not yet assessed</strong>
          </div>
          <p className="risk-copy">
            This is a demo environment. Live flood conditions remain unavailable.
          </p>
        </article>
        <article className="map-preview card">
          <div className="map-grid" aria-hidden="true">
            <span className="map-cross cross-a" />
            <span className="map-cross cross-b" />
            <span className="map-cross cross-c" />
            <span className="map-cross cross-d" />
            <span className="map-cross cross-e" />
            <span className="map-cross cross-f" />
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
          <span className="tool-icon" aria-hidden="true">
            ☎
          </span>
          <div>
            <h3>Emergency contacts</h3>
            <p>Keep trusted people close.</p>
          </div>
        </NavLink>
        <NavLink className="tool-card card" to="/notifications">
          <span className="tool-icon" aria-hidden="true">
            ⚑
          </span>
          <div>
            <h3>Notifications</h3>
            <p>Track conditions and updates.</p>
          </div>
        </NavLink>
        <NavLink className="tool-card card" to="/map">
          <span className="tool-icon" aria-hidden="true">
            ⌖
          </span>
          <div>
            <h3>Map</h3>
            <p>Review flood zones and routing.</p>
          </div>
        </NavLink>
      </div>
    </section>
  );
}
