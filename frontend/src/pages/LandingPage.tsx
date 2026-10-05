import { NavLink } from 'react-router-dom';

export function LandingPage() {
  return (
    <section className="landing-page">
      <div className="landing-copy">
        <p className="eyebrow accent-eyebrow">Flood safety, simplified</p>
        <h1>
          Know the risk.
          <br />
          <span>Make the safest move.</span>
        </h1>
        <p className="lead-copy">
          FloodGuard brings alerts, local conditions, evacuation guidance, and
          emergency tools together in one calm, clear place.
        </p>
        <div className="landing-actions">
          <NavLink className="primary-button" to="/dashboard">
            Open dashboard <span aria-hidden="true">→</span>
          </NavLink>
          <NavLink className="secondary-button" to="/notifications">
            View notifications
          </NavLink>
        </div>
      </div>
      <div className="hero-orb" aria-hidden="true">
        <div className="orb-ring ring-one" />
        <div className="orb-ring ring-two" />
        <div className="orb-core">⌁</div>
      </div>
    </section>
  );
}
