import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { EmergencyContactsPage } from './components/EmergencyContactsPage';
import { NotificationsPage } from './components/NotificationsPage';
import { StatusBadge } from './components/StatusBadge';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPersonalPage } from './pages/OnboardingPersonalPage';
import { OnboardingContactsPage } from './pages/OnboardingContactsPage';
import { OnboardingLocationPage } from './pages/OnboardingLocationPage';
import { OnboardingVerificationPage } from './pages/OnboardingVerificationPage';

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
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Onboarding routes */}
          <Route path="/onboarding/personal" element={<OnboardingPersonalPage />} />
          <Route path="/onboarding/contacts" element={<OnboardingContactsPage />} />
          <Route path="/onboarding/location" element={<OnboardingLocationPage />} />
          <Route path="/onboarding/location-verification" element={<OnboardingVerificationPage />} />

          {/* Protected routes */}
          <Route
            path="/home"
            element=(
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            )
          />
          <Route
            path="/notifications"
            element=(
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            )
          />
          <Route
            path="/contacts"
            element=(
              <ProtectedRoute>
                <EmergencyContactsPage />
              </ProtectedRoute>
            )
          />

          {/* Placeholder routes */}
          <Route
            path="/map"
            element=(
              <PlaceholderPage
                title="Flood Map"
                description="Full map view with flood layers and routing will be available soon."
              />
            )
          />
          <Route
            path="/admin"
            element=(
              <PlaceholderPage
                title="Admin"
                description="Administrator operations require backend authorization."
              />
            )
          />

          {/* 404 */}
          <Route
            path="*"
            element=(
              <PlaceholderPage
                title="Page not found"
                description="The requested FloodGuard route does not exist."
              />
            )
          />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
