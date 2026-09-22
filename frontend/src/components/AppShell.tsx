import type { ReactNode } from 'react';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Login', to: '/login' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Admin', to: '/admin' },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">FG</div>
          <div>
            <strong>FloodGuard</strong>
            <small>Safety platform</small>
          </div>
        </div>

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
          <strong>Foundation ready</strong>
          <span>API + UI shell prepared</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Flood operations</p>
            <h2>FloodGuard Foundation</h2>
          </div>
          <button className="primary-button">Demo alert</button>
        </header>

        {children}
      </main>
    </div>
  );
}
