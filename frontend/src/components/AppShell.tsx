import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Notifications', to: '/notifications' },
  { label: 'Emergency contacts', to: '/contacts' },
  { label: 'Admin', to: '/admin' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand-block" to="/" aria-label="FloodGuard home">
          <div className="brand-mark">FG</div>
          <div>
            <strong>FloodGuard</strong>
            <small>Safety platform</small>
          </div>
        </NavLink>

        <nav className="nav-stack" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-card">
          <p className="eyebrow">System status</p>
          <strong>Development preview</strong>
          <span>External feeds are not connected.</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Flood operations</p>
            <h2>FloodGuard</h2>
          </div>
          <NavLink className="primary-button" to="/notifications">View updates</NavLink>
        </header>
        {children}
      </main>
    </div>
  );
}
