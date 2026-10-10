import { useEffect, useState } from 'react';
import { fetchJson } from '../lib/api';
import '../styles/signals.css';

type WeatherResponse = {
  available: boolean;
  source: string;
  source_url: string;
  fetched_at: string;
  provider_updated_at: string | null;
  timezone: string | null;
  current: null | {
    temperature_c: number | null;
    precipitation_mm: number | null;
    rain_mm: number | null;
    showers_mm: number | null;
    wind_speed_kmh: number | null;
  };
  next_hours: Array<{ time: string; precipitation_mm: number | null; precipitation_probability_percent: number | null }>;
  disclaimer: string;
};
type AlertsResponse = {
  available: boolean;
  items: Array<{ id: string; title: string; message: string; area?: string | null; severity: string; issued_at?: string | null; source: string; source_url: string }>;
  source: string | null;
  source_url: string | null;
  fetched_at: string;
  message: string;
  is_demo: boolean;
};

function timeLabel(value: string | null | undefined): string {
  if (!value) return 'Time unavailable';
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toLocaleString() : value;
}

export function DashboardSignals() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [alerts, setAlerts] = useState<AlertsResponse | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [alertsError, setAlertsError] = useState(false);

  useEffect(() => {
    let active = true;
    const raw = localStorage.getItem('floodguard_user_location:demo-user')
      || localStorage.getItem('floodguard_user_location');
    let coordinates: { latitude: number; longitude: number } | null = null;
    try {
      const parsed = raw ? JSON.parse(raw) as { latitude?: number; longitude?: number } : null;
      if (typeof parsed?.latitude === 'number' && typeof parsed.longitude === 'number'
        && parsed.latitude >= -90 && parsed.latitude <= 90
        && parsed.longitude >= -180 && parsed.longitude <= 180) {
        coordinates = { latitude: parsed.latitude, longitude: parsed.longitude };
      }
    } catch { /* Ignore malformed local storage; the page remains in unknown state. */ }

    if (coordinates) {
      const query = `latitude=${encodeURIComponent(coordinates.latitude)}&longitude=${encodeURIComponent(coordinates.longitude)}`;
      fetchJson<WeatherResponse>(`/api/v1/weather/current?${query}`)
        .then((value) => active && setWeather(value))
        .catch(() => active && setWeatherError(true));
    } else {
      setWeatherError(true);
    }
    fetchJson<AlertsResponse>('/api/v1/alerts/official')
      .then((value) => active && setAlerts(value))
      .catch(() => active && setAlertsError(true));
    return () => { active = false; };
  }, []);

  return (
    <section className="signals-grid" aria-label="Live weather and official alerts">
      <article className="card signal-card">
        <div className="signal-card-heading"><div><p className="eyebrow">Weather context</p><h2>Local conditions</h2></div><span className={weather?.available ? 'signal-pill connected' : 'signal-pill'}>{weather?.available ? 'Live provider' : 'Unavailable'}</span></div>
        {weather?.available && weather.current ? (
          <>
            <div className="signal-weather-value">{weather.current.temperature_c ?? '—'}<span>°C</span></div>
            <div className="signal-metrics">
              <span>Precipitation <strong>{weather.current.precipitation_mm ?? '—'} mm</strong></span>
              <span>Rain <strong>{weather.current.rain_mm ?? '—'} mm</strong></span>
              <span>Wind <strong>{weather.current.wind_speed_kmh ?? '—'} km/h</strong></span>
            </div>
            <p className="signal-meta">Provider timestamp: {timeLabel(weather.provider_updated_at)} · Retrieved {timeLabel(weather.fetched_at)}</p>
            <a href={weather.source_url} target="_blank" rel="noreferrer">Source: {weather.source}</a>
          </>
        ) : <p className="signal-muted">{weatherError ? 'Set a valid saved location and check the API connection.' : 'Waiting for a provider response. Missing weather data is not a safety clearance.'}</p>}
        <p className="signal-disclaimer">{weather?.disclaimer ?? 'Weather context is not a flood warning or safety assessment.'}</p>
      </article>
      <article className="card signal-card">
        <div className="signal-card-heading"><div><p className="eyebrow">Official information</p><h2>Weather warnings</h2></div><span className={alerts?.available ? 'signal-pill connected' : 'signal-pill'}>{alerts?.available ? 'Provider response' : 'Not connected'}</span></div>
        {alertsError && <p className="signal-muted" role="alert">Alert service unavailable. Check the official IMD bulletin directly.</p>}
        {alerts?.available && alerts.items.length > 0 ? alerts.items.slice(0, 4).map((item) => (
          <article className="signal-alert-item" key={item.id}><strong>{item.title}</strong><span>{item.area || 'Area unspecified'} · {item.severity}</span><p>{item.message}</p><small>Issued: {timeLabel(item.issued_at)} · {item.source}</small></article>
        )) : <p className="signal-muted">{alerts?.message ?? 'No alert data response. This must not be interpreted as no active warnings.'}</p>}
        {alerts?.source_url && <a href={alerts.source_url} target="_blank" rel="noreferrer">Open official source</a>}
      </article>
    </section>
  );
}
