import { useState } from 'react';

const initialNotifications = [
  {
    id: 1,
    type: 'emergency',
    title: 'River level warning',
    text: 'Flooding risk is increasing near the Riverside district. Avoid low-lying roads and follow local authority guidance.',
    time: '2 mins ago',
    location: 'Riverside district',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Heavy rain alert',
    text: 'Moderate rainfall is expected for the next 90 minutes. Monitor the river forecast and update your emergency supplies.',
    time: '18 mins ago',
    location: 'North district',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'Shelter availability refresh',
    text: 'The shelter directory has been refreshed. Confirm your nearest evacuation center before travel.',
    time: '1 hour ago',
    location: 'City center',
    read: true,
  },
  {
    id: 4,
    type: 'system',
    title: 'Profile update complete',
    text: 'Your emergency contacts were saved locally for this demo session.',
    time: '3 hours ago',
    location: 'Account',
    read: true,
  },
];

export function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'emergency' | 'warning' | 'info' | 'system'>('all');
  const [notifications, setNotifications] = useState(initialNotifications);

  const filtered = filter === 'all' ? notifications : notifications.filter((item) => item.type === filter);

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  };

  return (
    <section className="page-shell notifications-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Stay informed</p>
          <h1>Notifications</h1>
          <p className="page-subtitle">Official updates, warnings, and system events in one place.</p>
        </div>
        <span className="status-badge info">Live feed</span>
      </div>

      <div className="notification-summary card">
        <div>
          <strong>{notifications.filter((item) => !item.read).length}</strong>
          <span>Unread</span>
        </div>
        <div>
          <strong>{notifications.filter((item) => item.type === 'emergency').length}</strong>
          <span>Emergency</span>
        </div>
        <div>
          <strong>{notifications.length}</strong>
          <span>Total</span>
        </div>
      </div>

      <div className="notifications-body card">
        <div className="notification-toolbar">
          <div className="notification-tabs">
            {['all', 'emergency', 'warning', 'info', 'system'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={filter === tab ? 'active' : ''}
                onClick={() => setFilter(tab as 'all' | 'emergency' | 'warning' | 'info' | 'system')}
              >
                {tab === 'all' ? 'All' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="notification-list">
          {filtered.map((item) => (
            <article className={`notification-item ${item.read ? 'read' : 'unread'}`} key={item.id}>
              <div className={`notification-icon ${item.type}`} aria-hidden="true">
                {item.type === 'emergency' ? '!' : item.type === 'warning' ? '⚠' : item.type === 'info' ? 'i' : '•'}
              </div>

              <div className="notification-content">
                <div className="notification-head">
                  <div>
                    <div className="notification-label-row">
                      <span className={`priority-pill ${item.type}`}>{item.type}</span>
                      {!item.read && <span className="dot-new">New</span>}
                    </div>
                    <h3>{item.title}</h3>
                  </div>
                  <span className="notification-time">{item.time}</span>
                </div>

                <p>{item.text}</p>

                <div className="notification-meta">
                  <span>{item.location}</span>
                  {!item.read && (
                    <button type="button" onClick={() => markAsRead(item.id)}>
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
