import { useState } from 'react';

const officialContacts = [
  { name: 'Local emergency services', number: 'Use your local emergency number', detail: 'For immediate danger or urgent rescue assistance', icon: '!', tone: 'critical' },
  { name: 'National disaster helpline', number: 'Number unavailable', detail: 'Verify the current official number for your region', icon: '⌁', tone: 'info' },
  { name: 'Local disaster authority', number: 'Contact unavailable', detail: 'State or district emergency management office', icon: '⌖', tone: 'safe' },
];

export function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<{ name: string; number: string; relation: string }[]>([]);
  const [form, setForm] = useState({ name: '', number: '', relation: '' });
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const addContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.number.trim()) return;
    setContacts((current) => [...current, { ...form, name: form.name.trim(), number: form.number.trim() }]);
    setForm({ name: '', number: '', relation: '' });
    setShowForm(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section className="page-shell contacts-page">
      <div className="page-header">
        <div><p className="eyebrow">Keep help close</p><h1>Emergency contacts</h1><p className="page-subtitle">Important contact guidance for urgent situations and people you trust.</p></div>
        <span className="status-badge info">Demo directory</span>
      </div>
      <div className="contacts-notice"><span>ⓘ</span><span>Numbers and services are not live in demo mode. Confirm official contact details for your location before an emergency.</span></div>
      {saved && <div className="save-toast" role="status">Contact saved to this session</div>}
      <div className="contacts-grid">
        <div>
          <div className="contacts-section-heading"><div><p className="eyebrow">Official guidance</p><h2>Who to call</h2></div></div>
          <div className="contact-list">{officialContacts.map((contact) => <article className="contact-card card" key={contact.name}><span className={`contact-icon ${contact.tone}`}>{contact.icon}</span><div className="contact-copy"><h3>{contact.name}</h3><strong>{contact.number}</strong><p>{contact.detail}</p></div><button className="contact-action" type="button" aria-label={`Call ${contact.name}`} disabled>Call</button></article>)}</div>
        </div>
        <div className="personal-contacts card"><div className="contacts-section-heading"><div><p className="eyebrow">Your support network</p><h2>People to reach</h2></div><button className="add-contact-button" type="button" onClick={() => setShowForm((value) => !value)}>{showForm ? 'Cancel' : '+ Add'}</button></div>{showForm && <form className="contact-form" onSubmit={addContact}><label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Priya Sharma" required /></label><label>Phone number<input value={form.number} onChange={(event) => setForm({ ...form, number: event.target.value })} placeholder="Phone number" required /></label><label>Relationship<input value={form.relation} onChange={(event) => setForm({ ...form, relation: event.target.value })} placeholder="Family, neighbour, friend" /></label><button className="primary-button compact" type="submit">Save contact</button></form>}{contacts.length === 0 && !showForm ? <div className="contacts-empty"><span>☎</span><strong>No personal contacts yet</strong><p>Add someone you trust so their details are easy to find.</p><button className="outline-button" type="button" onClick={() => setShowForm(true)}>Add a contact</button></div> : <div className="personal-list">{contacts.map((contact) => <div className="personal-contact" key={`${contact.name}-${contact.number}`}><span className="personal-avatar">{contact.name.charAt(0).toUpperCase()}</span><div><strong>{contact.name}</strong><span>{contact.relation || 'Personal contact'} · {contact.number}</span></div><button type="button" aria-label={`Remove ${contact.name}`} onClick={() => setContacts((current) => current.filter((item) => item !== contact))}>×</button></div>)}</div>}</div>
      </div>
      <p className="contacts-disclaimer">FloodGuard does not replace local emergency services. If you are in immediate danger, follow verified local authority instructions.</p>
    </section>
  );
}
