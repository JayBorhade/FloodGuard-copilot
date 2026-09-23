import { useEffect, useMemo, useState } from 'react';
import { fetchJson } from '../lib/api';
import type { FloodGuardNotification, NotificationListResponse, NotificationType } from '../types/notifications';

type ViewType = 'all' | NotificationType;

const demoFallback: FloodGuardNotification[] = [
  { id: 'demo-river-warning', type: 'warning', title: 'Sample river-level warning', message: 'This is a demonstration notification. Verify official local guidance before taking action.', location_label: 'Sample Riverside district', source: 'derived', is_read: false, requires_action: false, created_at: new Date().toISOString(), is_demo: true },
  { id: 'demo-system-update', type: 'system', title: 'FloodGuard demo mode is active', message: 'Live alert, weather, river, and shelter feeds are not connected in this environment.', location_label: 'Account', source: 'system', is_read: true, requires_action: false, created_at: new Date().toISOString(), is_demo: true },
];

function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Time unavailable' : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
}

export function NotificationsPage() {
  const [filter, setFilter] = useState<ViewType>('all');
  const [notifications, setNotifications] = useState<FloodGuardNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let active = true;
    fetchJson<NotificationListResponse>('/api/v1/notifications')
      .then((response) => {
        if (!active) return;
        setNotifications(response.items);
        setIsDemo(response.is_demo || response.items.some((item) => item.is_demo));
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setNotifications(demoFallback);
        setIsDemo(true);
        setError('The notification service is unavailable. Showing clearly labelled demo data.');
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => filter === 'all' ? notifications : notifications.filter((item) => item.type === filter), [filter, notifications]);
  const unreadCount = notifications.filter((item) => !item.is_read).length;
  const emergencyCount = notifications.filter((item) => item.type === 'emergency').length;

  const markAsRead = (id: string) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, is_read: true } : item));

  return (
    <section className="page-shell notifications-page">
      <div className="page-header"><div><p className="eyebrow">Stay informed</p><h1>Notifications</h1><p className="page-subtitle">Official updates, warnings, and system events in one place.</p></div><span className={`status-badge ${isDemo ? 'warning' : 'info'}`}>{isDemo ? 'Demo feed' : 'Connected feed'}</span></div>
      {isDemo && <div className="demo-notice"><span>ⓘ</span><div><strong>Demo data only</strong><p>These messages are not live emergency alerts. Verified provider notifications will appear here after backend integrations are connected.</p></div></div>}
      {error && <div className="notification-error" role="alert">{error}</div>}
      <div className="notification-summary card"><div><strong>{unreadCount}</strong><span>Unread</span></div><div><strong>{emergencyCount}</strong><span>Emergency</span></div><div><strong>{notifications.length}</strong><span>Total</span></div></div>
      <div className="notifications-body card"><div className="notification-toolbar"><div className="notification-tabs">{(['all', 'emergency', 'warning', 'information', 'system'] as ViewType[]).map((tab) => <button key={tab} type="button" className={filter === tab ? 'active' : ''} onClick={() => setFilter(tab)}>{tab === 'all' ? 'All' : tab}</button>)}</div></div>
        {loading ? <div className="notification-state"><strong>Loading notifications…</strong><span>Checking the FloodGuard service.</span></div> : filtered.length === 0 ? <div className="notification-state"><strong>No notifications in this view</strong><span>New messages will appear when a verified feed is available.</span></div> : <div className="notification-list">{filtered.map((item) => <article className={`notification-item ${item.is_read ? 'read' : 'unread'}`} key={item.id}><div className={`notification-icon ${item.type}`} aria-hidden="true">{item.type === 'emergency' ? '!' : item.type === 'warning' ? '⚠' : item.type === 'information' ? 'i' : '•'}</div><div className="notification-content"><div className="notification-head"><div><div className="notification-label-row"><span className={`priority-pill ${item.type}`}>{item.type}</span>{!item.is_read && <span className="dot-new">New</span>}</div><h3>{item.title}</h3></div><span className="notification-time">{formatTime(item.created_at)}</span></div><p>{item.message}</p><div className="notification-meta"><span>{item.location_label ?? 'Location unavailable'}</span>{!item.is_read && <button type="button" onClick={() => markAsRead(item.id)}>Mark as read</button>}</div></div></article>)}</div>}
      </div>
    </section>
  );
}
