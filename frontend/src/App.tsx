import { useMemo, useState } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { StatusBadge } from './components/StatusBadge';

function LandingPage() {
  return (
    <section className="landing-page">
      <div className="landing-copy">
        <p className="eyebrow accent-eyebrow">Flood safety, simplified</p>
        <h1>Know the risk.<br /><span>Make the safest move.</span></h1>
        <p className="lead-copy">FloodGuard brings alerts, local conditions, evacuation guidance, and emergency tools together in one calm, clear place.</p>
        <div className="landing-actions"><NavLink className="primary-button" to="/dashboard">Explore dashboard <span>→</span></NavLink><NavLink className="secondary-button" to="/login">Sign in</NavLink></div>
        <div className="trust-row"><span>●</span> Built for moments that matter</div>
      </div>
      <div className="hero-orb" aria-hidden="true"><div className="orb-ring ring-one" /><div className="orb-ring ring-two" /><div className="orb-core">⌁</div></div>
    </section>
  );
}

function DashboardPage() {
  return (
    <section className="page-shell">
      <div className="page-header dashboard-header"><div><p className="eyebrow">Tuesday, September 22, 2026</p><h1>Good morning, stay prepared.</h1><p className="page-subtitle">Set your location to receive guidance for your area.</p></div><NavLink className="outline-button" to="/map">Open flood map <span>↗</span></NavLink></div>
      <div className="demo-notice"><span>ⓘ</span><div><strong>Development preview</strong><p>Safety data cards below are sample UI states. Connect a location to replace them with verified provider data.</p></div></div>
      <div className="dashboard-grid"><article className="risk-card card"><div className="card-topline"><span className="section-label">Current risk</span><StatusBadge tone="info" label="Awaiting location" /></div><div className="risk-value">—</div><h2>Location not set</h2><p>Choose your location to receive a FloodGuard risk assessment based on available official and environmental signals.</p><NavLink className="primary-button compact" to="/map">Set location <span>→</span></NavLink></article><article className="map-preview card"><div className="map-grid" aria-hidden="true"><span className="map-cross cross-a" /><span className="map-cross cross-b" /><span className="map-road road-a" /><span className="map-road road-b" /><span className="map-pin">⌖</span></div><div className="map-overlay"><span className="section-label">Floods near me</span><NavLink to="/map">View map →</NavLink></div></article></div>
      <div className="section-heading"><div><p className="eyebrow">Be ready</p><h2>Your safety toolkit</h2></div><NavLink to="/checklist">View all tools →</NavLink></div>
      <div className="tool-grid"><ToolCard icon="↗" title="Leave or stay" text="Get a clear recommendation based on your situation." to="/decision" /><ToolCard icon="✓" title="Emergency checklist" text="Build your go-bag and track what is ready." to="/checklist" /><ToolCard icon="☎" title="Emergency contacts" text="Keep important numbers close when it matters." to="/contacts" /></div>
    </section>
  );
}

function ToolCard({ icon, title, text, to }: { icon: string; title: string; text: string; to: string }) { return <NavLink className="tool-card card" to={to}><span className="tool-icon">{icon}</span><h3>{title}</h3><p>{text}</p><span className="tool-arrow">→</span></NavLink>; }

const checklistItems = ['Drinking water', 'First-aid supplies', 'Flashlight and batteries', 'Phone charger or power bank', 'Important documents', 'Medication and prescriptions', 'Non-perishable food', 'Warm clothes or blanket'];

function ChecklistPage() {
  const [checked, setChecked] = useState<string[]>([]);
  const progress = Math.round((checked.length / checklistItems.length) * 100);
  const toggle = (item: string) => setChecked((current) => current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]);
  return <section className="page-shell narrow-page"><div className="page-header"><div><p className="eyebrow">Emergency preparedness</p><h1>Emergency checklist</h1><p className="page-subtitle">A simple starting point for your personal go-bag. Adapt it to your household.</p></div><StatusBadge tone="info" label="Saved locally" /></div><div className="checklist-card card"><div className="progress-header"><div><strong>{checked.length} of {checklistItems.length} ready</strong><span>Keep essentials accessible.</span></div><strong className="progress-value">{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><div className="checklist-items">{checklistItems.map((item) => <label className={`check-item ${checked.includes(item) ? 'complete' : ''}`} key={item}><input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item)} /><span className="custom-check">✓</span><span>{item}</span></label>)}</div><p className="checklist-disclaimer">This checklist is general preparedness guidance, not an official emergency instruction.</p></div></section>;
}

function DecisionPage() {
  const questions = ['Are you currently in a flood warning or evacuation area?', 'Can you safely move to higher ground if conditions change?', 'Do you have children, older adults, pets, or mobility needs with you?'];
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const result = useMemo(() => answers.length === questions.length ? (answers[0] ? 'Prepare to leave' : answers[1] ? 'Stay alert' : 'Shelter in place') : null, [answers]);
  const answer = (value: boolean) => { setAnswers((current) => [...current, value]); setStep((current) => current + 1); };
  return <section className="page-shell narrow-page"><div className="page-header"><div><p className="eyebrow">Personal safety guide</p><h1>Leave or stay</h1><p className="page-subtitle">Answer three questions to organize your next step.</p></div><StatusBadge tone="warning" label="Guidance tool" /></div><div className="wizard-card card">{result ? <div className="wizard-result"><span className="result-icon">↗</span><p className="eyebrow">Your starting recommendation</p><h2>{result}</h2><p>This is a general decision aid, not an official evacuation order. Always follow verified local authority instructions and emergency alerts.</p><div className="wizard-actions"><NavLink className="primary-button" to="/map">Check local map →</NavLink><button className="secondary-button" onClick={() => { setAnswers([]); setStep(0); }}>Start again</button></div></div> : <><div className="wizard-progress"><span>Question {step + 1} of {questions.length}</span><div className="progress-track"><span style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div></div><h2>{questions[step]}</h2><div className="answer-grid"><button className="answer-button" onClick={() => answer(true)}>Yes <span>→</span></button><button className="answer-button" onClick={() => answer(false)}>No <span>→</span></button></div><p className="checklist-disclaimer">If you are in immediate danger, contact local emergency services.</p></>}</div></section>;
}

function PlaceholderPage({ title, description }: { title: string; description: string }) { return <section className="page-shell"><div className="page-header"><div><p className="eyebrow">FloodGuard tool</p><h1>{title}</h1></div><StatusBadge tone="info" label="Demo state" /></div><div className="card placeholder-card"><div className="placeholder-icon">⌁</div><h2>Integration-ready screen</h2><p>{description}</p><p className="muted-copy">This screen is intentionally marked as a demo until its normalized FastAPI service is connected. No live emergency data is being fabricated.</p></div></section>; }

function AppRoutes() { return <Routes><Route path="/" element={<LandingPage />} /><Route path="/login" element={<PlaceholderPage title="Sign in" description="Authentication will use Firebase Authentication with backend token verification." />} /><Route path="/dashboard" element={<DashboardPage />} /><Route path="/map" element={<PlaceholderPage title="Floods near me" description="MapLibre map integration will display verified alerts, risk zones, shelters, and the user location." />} /><Route path="/decision" element={<DecisionPage />} /><Route path="/shelters" element={<PlaceholderPage title="Evacuation centers" description="Shelter information will be displayed only when verified provider data is available." />} /><Route path="/checklist" element={<ChecklistPage />} /><Route path="/contacts" element={<PlaceholderPage title="Emergency contacts" description="Emergency contacts will be configured for the user’s region and personal contacts." />} /><Route path="/notifications" element={<PlaceholderPage title="Notifications" description="Notifications will distinguish official alerts, warnings, information, and system messages." />} /><Route path="/profile" element={<PlaceholderPage title="Profile" description="Manage account details and emergency preferences." />} /><Route path="/settings" element={<PlaceholderPage title="Settings" description="Manage notification, privacy, accessibility, and location preferences." />} /><Route path="/admin" element={<PlaceholderPage title="Admin console" description="Administrative monitoring will be protected by backend authorization and Firebase token verification." />} /></Routes>; }

function App() { return <BrowserRouter><AppShell><AppRoutes /></AppShell></BrowserRouter>; }
export default App;
