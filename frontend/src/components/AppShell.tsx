import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Overview', to: '/dashboard', icon: '⌂' },
  { label: 'Floods near me', to: '/map', icon: '⌖' },
  { label: 'Leave or stay', to: '/decision', icon: '↗' },
  { label: 'Evacuation centers', to: '/shelters', icon: '⌂' },
  { label: 'Emergency checklist', to: '/checklist', icon: '✓' },
  { label: 'Emergency contacts', to: '/contacts', icon: '☎' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand-block" aria-label="FloodGuard home">
          <div className="brand-mark">FG</div>
          <div>
            <strong>FloodGuard</strong>
            <small>Prepared. Informed. Safe.</small>
          </div>
        </NavLink>

        <div className="demo-banner" role="status">
          <span className="demo-dot" />
          <span>Demo mode · live feeds pending</span>
        </div>

        <nav className="nav-stack" aria-label="Primary navigation">
          <p className="nav-heading">Safety tools</p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/settings" className="footer-link">⚙ Settings</NavLink>
          <NavLink to="/admin" className="footer-link">Admin console</NavLink>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-mark small">FG</span>
            <strong>FloodGuard</strong>
          </div>
          <div className="location-pill" aria-label="Current location">
            <span className="location-pulse" />
            <span>Set your location</span>
          </div>
          <div className="topbar-actions">
            <NavLink className="icon-button" to="/notifications" aria-label="Notifications">♢</NavLink>
            <NavLink className="profile-pill" to="/profile" aria-label="Open profile">
              <span className="avatar">JG</span>
              <span className="profile-name">Guest user</span>
            </NavLink>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
