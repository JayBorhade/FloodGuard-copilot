import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { EmergencyContactsPage } from './components/EmergencyContactsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { StatusBadge } from './components/StatusBadge';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';

function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">FloodGuard</p>
          <h1>{title}</h1>
        </div>
        <StatusBadge tone="info" label="Unavailable" />
      </div>
      <div className="card">
        <p>{description}</p>
      </div>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/contacts" element={<EmergencyContactsPage />} />
          <Route
            path="/login"
            element={
              <PlaceholderPage
                title="Sign in"
                description="Firebase Authentication will provide the production sign-in flow."
              />
            }
          />
          <Route
            path="/map"
            element={
              <PlaceholderPage
                title="Flood map"
                description="MapLibre and backend-normalized map layers will be connected here."
              />
            }
          />
          <Route
            path="/admin"
            element={
              <PlaceholderPage
                title="Admin operations"
                description="Admin access requires backend-verified authorization."
              />
            }
          />
          <Route
            path="*"
            element={
              <PlaceholderPage
                title="Page not found"
                description="The requested FloodGuard route does not exist."
              />
            }
          />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
