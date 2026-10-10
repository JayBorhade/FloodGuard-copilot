import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Flood map', to: '/map' },
  { label: 'Notifications', to: '/notifications' },
  { label: 'Emergency contacts', to: '/contacts' },
  { label: 'Emergency support', to: '/emergency' },
  { label: 'Community reports & routes', to: '/community' },
  { label: 'Admin', to: '/admin' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, user, logout } = useAuth();

  const handleAuthAction = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch {
      // AuthProvider keeps the error state; avoid an unhandled event rejection.
    }
  };

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
          {isAuthenticated && user && (
            <p className="auth-session-label">
              Signed in as {user.display_name || user.email || 'FloodGuard user'}
              {user.is_demo ? ' · Demo' : ''}
            </p>
          )}
          <button type="button" className="secondary-button" onClick={handleAuthAction} disabled={isLoading}>
            {isLoading ? 'Please wait…' : isAuthenticated ? 'Sign out' : 'Sign in'}
          </button>
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
