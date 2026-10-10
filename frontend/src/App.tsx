import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { EmergencyContactsPage } from './components/EmergencyContactsPage';
import { EmergencySupportPage } from './pages/EmergencySupportPage';
import { NotificationsPage } from './components/NotificationsPage';
import { StatusBadge } from './components/StatusBadge';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MapPage } from './pages/MapPage';
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

function AppRoutes() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Onboarding requires an explicit session; progress is persisted locally. */}
          <Route path="/onboarding/personal" element={<ProtectedRoute><OnboardingPersonalPage /></ProtectedRoute>} />
          <Route path="/onboarding/contacts" element={<ProtectedRoute><OnboardingContactsPage /></ProtectedRoute>} />
          <Route path="/onboarding/location" element={<ProtectedRoute><OnboardingLocationPage /></ProtectedRoute>} />
          <Route
            path="/onboarding/location-verification"
            element={<ProtectedRoute><OnboardingVerificationPage /></ProtectedRoute>}
          />

          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/contacts" element={<ProtectedRoute><EmergencyContactsPage /></ProtectedRoute>} />
          <Route path="/emergency" element={<ProtectedRoute><EmergencySupportPage /></ProtectedRoute>} />

          <Route path="/map" element={<MapPage />} />
          <Route
            path="/admin"
            element={<ProtectedRoute><PlaceholderPage title="Admin" description="Administrator operations require backend authorization." /></ProtectedRoute>}
          />
          <Route
            path="*"
            element={<PlaceholderPage title="Page not found" description="The requested FloodGuard route does not exist." />}
          />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
