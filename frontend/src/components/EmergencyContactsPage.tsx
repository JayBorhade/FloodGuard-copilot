import { useState } from 'react';
import { onboardingService } from '../services/onboarding';
import type { EmergencyContact } from '../types/user';

const officialContacts = [
  { name: 'Emergency Response Support System (India)', number: '112', detail: 'Pan-India emergency number for police, fire & rescue, and health emergencies', icon: '!', tone: 'critical', url: 'https://112.gov.in/' },
  { name: 'National disaster helpline', number: 'Number unavailable', detail: 'Verify the current official number for your region', icon: '⌁', tone: 'info' },
  { name: 'Local disaster authority', number: 'Contact unavailable', detail: 'State or district emergency management office', icon: '⌖', tone: 'safe' },
];

export function EmergencyContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => onboardingService.getState()?.contacts ?? []);
  const [form, setForm] = useState({ name: '', phone: '', relationship: '' });
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persistContacts = (next: EmergencyContact[]) => {
    setContacts(next);
    const current = onboardingService.getState();
    onboardingService.setState({
      ...(current ?? { step: 'personal', completed: false }),
      contacts: next,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const addContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    if (!name || !phone) {
      setError('Enter a name and phone number.');
      return;
    }
    const contact: EmergencyContact = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `contact-${Date.now()}`,
      name,
      phone,
      relationship: form.relationship.trim() || 'Personal contact',
      created_at: new Date().toISOString(),
    };
    persistContacts([...contacts, contact]);
    setForm({ name: '', phone: '', relationship: '' });
    setError(null);
    setShowForm(false);
  };

  const removeContact = (id: string) => {
    persistContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <section className="page-shell contacts-page">
      <div className="page-header">
        <div><p className="eyebrow">Keep help close</p><h1>Emergency contacts</h1><p className="page-subtitle">Important contact guidance for urgent situations and people you trust.</p></div>
        <span className="status-badge info">Local directory</span>
      </div>
      <div className="contacts-notice"><span>ⓘ</span><span>Official numbers are not verified or connected in this demo. Confirm current contact details for your location before an emergency.</span></div>
      {saved && <div className="save-toast" role="status">Contacts saved in this browser</div>}
      {error && <div className="notification-error" role="alert">{error}</div>}
      <div className="contacts-grid">
        <div>
          <div className="contacts-section-heading"><div><p className="eyebrow">Official guidance</p><h2>Who to call</h2></div></div>
          <div className="contact-list">{officialContacts.map((contact) => <article className="contact-card card" key={contact.name}><span className={`contact-icon ${contact.tone}`}>{contact.icon}</span><div className="contact-copy"><h3>{contact.name}</h3><strong>{contact.number}</strong><p>{contact.detail}</p>{'url' in contact && <a href={contact.url} target="_blank" rel="noreferrer">Official ERSS information</a>}</div><button className="contact-action" type="button" aria-label={`Call ${contact.name}`} disabled>Call</button></article>)}</div>
        </div>
        <div className="personal-contacts card">
          <div className="contacts-section-heading"><div><p className="eyebrow">Your support network</p><h2>People to reach</h2></div><button className="add-contact-button" type="button" onClick={() => setShowForm((value) => !value)}>{showForm ? 'Cancel' : '+ Add'}</button></div>
          {showForm && <form className="contact-form" onSubmit={addContact}><label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Contact name" autoComplete="name" required /></label><label>Phone number<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone number" autoComplete="tel" required /></label><label>Relationship<input value={form.relationship} onChange={(event) => setForm({ ...form, relationship: event.target.value })} placeholder="Family, neighbour, friend" /></label><button className="primary-button compact" type="submit">Save contact</button></form>}
          {contacts.length === 0 && !showForm ? <div className="contacts-empty"><span>☎</span><strong>No personal contacts yet</strong><p>Add someone you trust so their details are easy to find.</p><button className="outline-button" type="button" onClick={() => setShowForm(true)}>Add a contact</button></div> : <div className="personal-list">{contacts.map((contact) => <div className="personal-contact" key={contact.id}><span className="personal-avatar">{contact.name.charAt(0).toUpperCase()}</span><div><strong>{contact.name}</strong><span>{contact.relationship} · {contact.phone}</span></div><button type="button" aria-label={`Remove ${contact.name}`} onClick={() => removeContact(contact.id)}>×</button></div>)}</div>}
        </div>
      </div>
      <p className="contacts-disclaimer">FloodGuard does not replace local emergency services. If you are in immediate danger, follow verified local authority instructions.</p>
    </section>
  );
}
