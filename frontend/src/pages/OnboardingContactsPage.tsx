import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingService } from '../services/onboarding';
import type { EmergencyContact } from '../types/user';

export function OnboardingContactsPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<EmergencyContact[]>(() => onboardingService.getState()?.contacts ?? []);
  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '' });
  const [error, setError] = useState<string | null>(null);

  const saveContacts = (nextContacts: EmergencyContact[]) => {
    setContacts(nextContacts);
    const current = onboardingService.getState();
    onboardingService.setState({
      ...(current ?? { step: 'contacts', completed: false }),
      step: 'contacts',
      completed: false,
      contacts: nextContacts,
    });
  };

  const handleAddContact = () => {
    const name = newContact.name.trim();
    const phone = newContact.phone.trim();
    if (!name || !phone) {
      setError('Please enter both name and phone number');
      return;
    }

    const contact: EmergencyContact = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `contact-${Date.now()}`,
      name,
      relationship: newContact.relationship.trim() || 'Contact',
      phone,
      created_at: new Date().toISOString(),
    };

    saveContacts([...contacts, contact]);
    setNewContact({ name: '', relationship: '', phone: '' });
    setError(null);
  };

  const handleRemoveContact = (id: string) => {
    saveContacts(contacts.filter((contact) => contact.id !== id));
  };

  const handleContinue = () => {
    const current = onboardingService.getState();
    onboardingService.setState({
      ...(current ?? { step: 'contacts', completed: false }),
      step: 'location',
      completed: false,
      contacts,
    });
    navigate('/onboarding/location');
  };

  const handleSkip = () => {
    onboardingService.updateStep('location');
    navigate('/onboarding/location');
  };

  return (
    <section className="page-shell onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="onboarding-progress">
            <div className="progress-step completed">1</div>
            <div className="progress-line" />
            <div className="progress-step completed">2</div>
            <div className="progress-line" />
            <div className="progress-step">3</div>
            <div className="progress-line" />
            <div className="progress-step">4</div>
          </div>
        </div>

        <div className="onboarding-card">
          <h1>Add emergency contacts</h1>
          <p>These people will be easy to reach if you need help during a flood.</p>
          {error && <div className="notification-error" role="alert">{error}</div>}

          <div className="contacts-form">
            <div className="form-group">
              <label htmlFor="contactName">Name</label>
              <input id="contactName" type="text" autoComplete="name" placeholder="Contact name" value={newContact.name} onChange={(event) => setNewContact({ ...newContact, name: event.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="contactRelationship">Relationship</label>
              <input id="contactRelationship" type="text" placeholder="e.g., Family, Friend" value={newContact.relationship} onChange={(event) => setNewContact({ ...newContact, relationship: event.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="contactPhone">Phone number</label>
              <input id="contactPhone" type="tel" autoComplete="tel" placeholder="+91 00000 00000" value={newContact.phone} onChange={(event) => setNewContact({ ...newContact, phone: event.target.value })} />
            </div>
            <button type="button" className="secondary-button" onClick={handleAddContact}>Add contact</button>
          </div>

          {contacts.length > 0 && (
            <div className="contacts-list">
              <h3>Added contacts ({contacts.length})</h3>
              {contacts.map((contact) => (
                <div key={contact.id} className="contact-item">
                  <div>
                    <strong>{contact.name}</strong>
                    <p>{contact.relationship}</p>
                    <p>{contact.phone}</p>
                  </div>
                  <button type="button" className="danger-button" onClick={() => handleRemoveContact(contact.id)}>Remove</button>
                </div>
              ))}
            </div>
          )}

          <div className="onboarding-actions">
            <button type="button" className="primary-button" onClick={handleContinue}>Continue</button>
            <button type="button" className="secondary-button" onClick={handleSkip}>Skip for now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
