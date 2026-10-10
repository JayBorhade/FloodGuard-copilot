import { useCallback, useEffect, useState } from 'react';
import { fetchJson } from '../lib/api';
import { locationService } from '../services/location';
import '../styles/community.css';

type Report = {
  id: string; category: string; description: string; latitude: number; longitude: number;
  location_label?: string | null; status: string; verified: boolean; created_at: string; expires_at: string;
};
type ReportList = { items: Report[]; total: number; message: string; verified_data_available: boolean };
type RouteSafety = { available: boolean; route_status: string; polyline: null; message: string; hazard_reasons: string[] };

export function CommunityPage() {
  const saved = locationService.getUserLocation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState({
    category: 'flooding', description: '', latitude: saved ? String(saved.latitude) : '',
    longitude: saved ? String(saved.longitude) : '', location_label: '',
  });
  const [destination, setDestination] = useState({ latitude: '', longitude: '' });
  const [routeResult, setRouteResult] = useState<RouteSafety | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const loadReports = useCallback(async () => {
    try {
      const result = await fetchJson<ReportList>('/api/v1/community/reports');
      setReports(result.items);
    } catch {
      setNotice('Community reports could not be loaded. Try again when the API is available.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadReports(); }, [loadReports]);

  const submitReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);
    if (!form.description.trim() || !Number.isFinite(latitude) || !Number.isFinite(longitude)
      || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      setNotice('Enter a description and valid latitude/longitude coordinates.');
      return;
    }
    try {
      const result = await fetchJson<{ item: Report; message: string }>('/api/v1/community/reports', {
        method: 'POST', body: JSON.stringify({ ...form, latitude, longitude }),
      });
      setNotice(result.message);
      setForm((current) => ({ ...current, description: '' }));
      await loadReports();
    } catch {
      setNotice('Report submission failed. Check the API and try again.');
    }
  };

  const checkRoute = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const origin = locationService.getUserLocation();
    if (!origin || !destination.latitude || !destination.longitude) {
      setNotice('Set your saved origin location and enter destination coordinates.');
      return;
    }
    const lat = Number(destination.latitude);
    const lon = Number(destination.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setNotice('Destination coordinates are invalid.');
      return;
    }
    setRouteLoading(true);
    try {
      const query = new URLSearchParams({
        origin_latitude: String(origin.latitude), origin_longitude: String(origin.longitude),
        destination_latitude: String(lat), destination_longitude: String(lon),
      });
      setRouteResult(await fetchJson<RouteSafety>(`/api/v1/routes/safety?${query.toString()}`));
    } catch { setRouteResult(null); setNotice('Route safety service unavailable. Do not assume a route is safe.'); }
    finally { setRouteLoading(false); }
  };

  return (
    <section className="page-shell community-page">
      <div className="page-header"><div><p className="eyebrow">FloodGuard · community</p><h1>Community reports & route safety</h1><p className="page-subtitle">Share observations responsibly and check whether route-safety data is available.</p></div><span className="status-badge warning">Unverified community data</span></div>
      <div className="map-safety-banner"><span className="map-banner-icon">!</span><div><strong>Community reports are not official alerts</strong><p>Reports can be inaccurate or malicious. They are unverified, do not change the risk engine, and should not override official responder instructions.</p></div></div>
      {notice && <div className="notification-error" role="status">{notice}</div>}
      <div className="community-grid">
        <section className="card"><p className="eyebrow">Submit observation</p><h2>Report a local hazard</h2>
          <form className="community-form" onSubmit={submitReport}>
            <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="flooding">Flooding / standing water</option><option value="blocked_road">Blocked road</option><option value="water_level">Water level observation</option><option value="infrastructure_damage">Infrastructure damage</option><option value="other">Other</option></select></label>
            <label>Description<textarea minLength={8} maxLength={1000} rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe what you observed. Do not include private or identifying information." /></label>
            <div className="community-coordinates"><label>Latitude<input required type="number" min="-90" max="90" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} /></label><label>Longitude<input required type="number" min="-180" max="180" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} /></label></div>
            <label>Nearby landmark (optional)<input maxLength={120} value={form.location_label} onChange={(e) => setForm({ ...form, location_label: e.target.value })} placeholder="Cross street or public landmark" /></label>
            <button className="primary-button" type="submit">Submit for review</button>
          </form>
        </section>
        <section className="card"><p className="eyebrow">Route safety</p><h2>Can FloodGuard verify a route?</h2><p>Use your saved location as the origin and enter destination coordinates. Until verified road and hazard data are connected, the system deliberately refuses to recommend a route.</p>
          <form className="community-form" onSubmit={checkRoute}><div className="community-coordinates"><label>Destination latitude<input required type="number" min="-90" max="90" step="any" value={destination.latitude} onChange={(e) => setDestination({ ...destination, latitude: e.target.value })} /></label><label>Destination longitude<input required type="number" min="-180" max="180" step="any" value={destination.longitude} onChange={(e) => setDestination({ ...destination, longitude: e.target.value })} /></label></div><button type="submit" className="secondary-button" disabled={routeLoading}>{routeLoading ? 'Checking…' : 'Check route data status'}</button></form>
          {routeResult && <div className="route-result" role="status"><strong>{routeResult.available ? routeResult.route_status : 'UNKNOWN — no safe route certified'}</strong><p>{routeResult.message}</p><ul>{routeResult.hazard_reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>}
        </section>
      </div>
      <section className="card community-reports"><div className="community-reports-heading"><div><p className="eyebrow">Recent submissions</p><h2>Community observations</h2></div><button type="button" className="secondary-button" onClick={() => { setLoading(true); void loadReports(); }}>Refresh</button></div>
        {loading ? <p>Loading reports…</p> : reports.length ? reports.map((report) => <article className="community-report" key={report.id}><div><strong>{report.category.replace(/_/g, ' ')}</strong><span>{report.location_label || `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`} · {new Date(report.created_at).toLocaleString()}</span></div><p>{report.description}</p><span className="community-unverified">Pending review · Unverified · Expires {new Date(report.expires_at).toLocaleString()}</span><button type="button" className="text-button" onClick={async () => { try { await fetchJson(`/api/v1/community/reports/${report.id}/flag`, { method: 'POST' }); setNotice('Report flagged for review.'); await loadReports(); } catch { setNotice('Could not flag this report.'); } }}>Flag report</button></article>) : <p>No recent community reports. Do not interpret an empty list as a clear/safe area.</p>}
      </section>
    </section>
  );
}
