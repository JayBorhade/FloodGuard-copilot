import { useState } from 'react';
import { locationService } from '../services/location';
import '../styles/emergency.css';

const NOTIFICATION_PREF_KEY = 'floodguard_browser_notifications_enabled';

export function EmergencySupportPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [notificationState, setNotificationState] = useState(() => {
    try { return localStorage.getItem(NOTIFICATION_PREF_KEY) === 'true'; } catch { return false; }
  });
  const location = locationService.getUserLocation();

  const enableNotifications = async () => {
    if (!('Notification' in window)) {
      setMessage('This browser does not support web notifications.');
      return;
    }
    try {
      const permission = Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission();
      if (permission !== 'granted') {
        setNotificationState(false);
        localStorage.setItem(NOTIFICATION_PREF_KEY, 'false');
        setMessage('Browser notifications were not enabled. You can change this in browser settings.');
        return;
      }
      setNotificationState(true);
      localStorage.setItem(NOTIFICATION_PREF_KEY, 'true');
      setMessage('Browser notification permission is enabled. This preview does not yet receive server-push alerts.');
    } catch {
      setMessage('Could not update notification permission. Check browser settings.');
    }
  };

  const shareLocation = async () => {
    if (!location) {
      setMessage('No saved location is available. Add one in onboarding before sharing coordinates.');
      return;
    }
    const text = `My saved coordinates are ${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}. Please confirm the location verbally with emergency responders.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My location', text });
        setMessage('Location share sheet opened. FloodGuard has not contacted emergency services.');
        return;
      }
      await navigator.clipboard.writeText(text);
      setMessage('Location text copied. Send it to a trusted contact or provide it directly to emergency responders.');
    } catch {
      setMessage('Location sharing was cancelled or unavailable. You can read the coordinates from the card below.');
    }
  };

  return (
    <section className="page-shell emergency-page">
      <div className="page-header"><div><p className="eyebrow">FloodGuard · urgent assistance</p><h1>Emergency support</h1><p className="page-subtitle">Quick access to official emergency services and practical next steps.</p></div><span className="status-badge critical">Use for emergencies</span></div>
      <div className="emergency-call-card card">
        <div><p className="eyebrow">Government of India · ERSS</p><h2>Need urgent help?</h2><p>Call 112 for police, fire and rescue, or health emergencies in India. If there is immediate danger, do not wait for FloodGuard.</p><a className="emergency-call-button" href="tel:112">Call 112</a><a href="https://112.gov.in/" target="_blank" rel="noreferrer">Official 112.gov.in information</a></div>
        <div className="emergency-number">112</div>
      </div>
      <div className="emergency-support-grid">
        <article className="card"><p className="eyebrow">Preparedness</p><h2>What to tell responders</h2><ul><li>Your current location and nearest landmark</li><li>How many people need assistance and whether anyone is injured</li><li>Nearby water, electrical, structural, or road hazards</li><li>A callback number and a safe meeting point if available</li></ul></article>
        <article className="card"><p className="eyebrow">Location sharing</p><h2>Your saved location</h2>{location ? <p className="emergency-coordinates">Latitude {location.latitude.toFixed(5)}<br />Longitude {location.longitude.toFixed(5)}{location.accuracy_meters ? <><br />Accuracy ±{Math.round(location.accuracy_meters)} m</> : null}</p> : <p>No saved coordinates are available. Set a location during onboarding.</p>}<button type="button" className="primary-button" onClick={shareLocation}>Share/copy coordinates</button><p className="emergency-note">This opens the device share sheet or copies text. It does not send a message or alert responders automatically.</p></article>
        <article className="card"><p className="eyebrow">Notifications</p><h2>Browser notification permission</h2><p>{notificationState ? 'Permission was enabled for this browser.' : 'Enable permission if you want this browser to be allowed to display notifications.'}</p><button type="button" className="secondary-button" onClick={enableNotifications}>{notificationState ? 'Check permission' : 'Enable browser notifications'}</button><p className="emergency-note">Server push, SMS, and guaranteed emergency alerts are not connected in this preview.</p></article>
      </div>
      {message && <div className="notification-error" role="status">{message}</div>}
      <div className="map-safety-banner"><span className="map-banner-icon">!</span><div><strong>FloodGuard does not dispatch emergency services</strong><p>Do not rely on this site as a substitute for official warnings, emergency calls, or instructions from local authorities. Never enter floodwater to reach a location.</p></div></div>
    </section>
  );
}
