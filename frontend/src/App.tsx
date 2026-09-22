import type { ReactNode } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { StatusBadge } from './components/StatusBadge';

function PlaceholderPage({
  title,
  description,
  accent,
}: {
  title: string;
  description: string;
  accent: 'safe' | 'warning' | 'critical' | 'info';
}) {
  return (
    <section className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">FloodGuard foundation</p>
          <h1>{title}</h1>
        </div>
        <StatusBadge tone={accent} label={accent.toUpperCase()} />
      </div>

      <div className="card surface-card elevated-card">
        <p>{description}</p>
        <p className="muted-copy">
          This screen is intentionally a placeholder while the app foundation is prepared for
          real UI implementation in the next phase.
        </p>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <PlaceholderPage
      title="Home / Landing"
      description="Public landing and product entry point for FloodGuard."
      accent="info"
    />
  );
}

function LoginPage() {
  return (
    <PlaceholderPage
      title="Login"
      description="Authentication screen with email, password, validation, and loading states."
      accent="safe"
    />
  );
}

function DashboardPage() {
  return (
    <PlaceholderPage
      title="User Dashboard"
      description="User flood status overview with location, risk, route, shelters, reports, and alerts."
      accent="warning"
    />
  );
}

function AdminPage() {
  return (
    <PlaceholderPage
      title="Admin Dashboard"
      description="Operations dashboard for alerts, monitoring, reports, shelters, and users."
      accent="critical"
    />
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
