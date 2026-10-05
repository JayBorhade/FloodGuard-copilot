import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingService } from '../services/onboarding';
import { EmergencyContact } from '../types/user';

export function OnboardingContactsPage() {
  const navigate = useNavigate();
  const state = onboardingService.getState();
  const [contacts, setContacts] = useState<EmergencyContact[]>(state?.contacts || []);
  const [newContact, setNewContact] = useState({ name: '', relationship: '', phone: '' });
  const [error, setError] = useState<string | null>(null);

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      setError('Please enter both name and phone number');
      return;
    }

    const contact: EmergencyContact = {
      id: `contact-${Date.now()}`,
      name: newContact.name,
      relationship: newContact.relationship || 'Contact',
      phone: newContact.phone,
      created_at: new Date().toISOString(),
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: '', relationship: '', phone: '' });
    setError(null);
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleContinue = () => {
    const current = onboardingService.getState();
    onboardingService.setState({
      ...current,
      step: 'location',
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
              <input
                id="contactName"
                type="text"
                placeholder="Contact name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactRelationship">Relationship</label>
              <input
                id="contactRelationship"
                type="text"
                placeholder="e.g., Family, Friend"
                value={newContact.relationship}
                onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Phone number</label>
              <input
                id="contactPhone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={handleAddContact}
            >
              Add contact
            </button>
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
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleRemoveContact(contact.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="onboarding-actions">
            <button type="button" className="primary-button" onClick={handleContinue}>
              Continue
            </button>
            <button type="button" className="secondary-button" onClick={handleSkip}>
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
