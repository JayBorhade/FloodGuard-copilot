import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { EmergencyContactsPage } from './components/EmergencyContactsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { StatusBadge } from './components/StatusBadge';

function LandingPage() {
  return (
    <section className="landing-page">
      <div className="landing-copy">
        <p className="eyebrow accent-eyebrow">Flood safety, simplified</p>
        <h1>Know the risk.<br /><span>Make the safest move.</span></h1>
        <p className="lead-copy">FloodGuard brings alerts, local conditions, evacuation guidance, and emergency tools together in one calm, clear place.</p>
        <div className="landing-actions">
          <NavLink className="primary-button" to="/dashboard">Open dashboard <span>→</span></NavLink>
          <NavLink className="secondary-button" to="/notifications">View notifications</NavLink>
        </div>
      </div>
      <div className="hero-orb" aria-hidden="true"><div className="orb-ring ring-one" /><div className="orb-ring ring-two" /><div className="orb-core">⌁</div></div>
    </section>
  );
}

function DashboardPage() {
  return (
    <section className="page-shell">
      <div className="page-header">
        <div><p className="eyebrow">FloodGuard overview</p><h1>Stay prepared.</h1><p className="page-subtitle">Set your location to receive verified guidance for your area.</p></div>
        <StatusBadge tone="info" label="Demo state" />
      </div>
      <div className="demo-notice"><span>ⓘ</span><div><strong>Development preview</strong><p>Risk, map, shelter, and alert data are unavailable until provider integrations are connected.</p></div></div>
      <div className="dashboard-grid">
        <article className="risk-card card"><div className="card-topline"><span className="section-label">Current risk</span><StatusBadge tone="info" label="Unknown" /></div><div className="risk-value">—</div><h2>Location not set</h2><p>Missing data is not treated as safe. Select a location to request a backend risk assessment.</p><NavLink className="primary-button compact" to="/notifications">Review updates <span>→</span></NavLink></article>
        <article className="map-preview card"><div className="map-grid" aria-hidden="true"><span className="map-cross cross-a" /><span className="map-cross cross-b" /><span className="map-road road-a" /><span className="map-road road-b" /><span className="map-pin">⌖</span></div><div className="map-overlay"><span className="section-label">Map integration</span><NavLink to="/notifications">Check status →</NavLink></div></article>
      </div>
      <div className="section-heading"><div><p className="eyebrow">Be ready</p><h2>Safety tools</h2></div></div>
      <div className="tool-grid"><NavLink className="tool-card card" to="/contacts"><span className="tool-icon">☎</span><div><h3>Emergency contacts</h3><p>Keep trusted people close.</p></div><span className="tool-arrow">→</span></NavLink><NavLink className="tool-card card" to="/notifications"><span className="tool-icon">!</span><div><h3>Notifications</h3><p>Review official and system updates.</p></div><span className="tool-arrow">→</span></NavLink></div>
    </section>
  );
}

function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return <section className="page-shell"><div className="page-header"><div><p className="eyebrow">FloodGuard</p><h1>{title}</h1></div><StatusBadge tone="info" label="Unavailable" /></div><div className="card elevated-card"><p>{description}</p><p className="muted-copy">This capability has an integration boundary, but no live provider is configured. FloodGuard will not present fabricated emergency data.</p></div></section>;
}

function App() {
  return <BrowserRouter><AppShell><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
    <Route path="/contacts" element={<EmergencyContactsPage />} />
    <Route path="/login" element={<PlaceholderPage title="Sign in" description="Firebase Authentication will provide the production sign-in flow." />} />
    <Route path="/map" element={<PlaceholderPage title="Flood map" description="MapLibre and backend-normalized map layers will be connected here." />} />
    <Route path="/admin" element={<PlaceholderPage title="Admin operations" description="Admin access requires backend-verified authorization." />} />
    <Route path="*" element={<PlaceholderPage title="Page not found" description="The requested FloodGuard route does not exist." />} />
  </Routes></AppShell></BrowserRouter>;
}

export default App;
