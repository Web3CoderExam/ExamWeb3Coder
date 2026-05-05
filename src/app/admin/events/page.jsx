'use client';

import { useState } from 'react';
import styles from './events.module.css';

export default function EventsManagement() {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([
    { id: 1, title: 'Dev Conference 2026', date: '12 - 14 Juin 2026', location: 'Centre de conférences', status: 'actif' },
    { id: 2, title: 'AI Summit 2026', date: '20 - 21 Août 2026', location: 'Salle B', status: 'actif' },
    { id: 3, title: 'Design Week 2026', date: '05 - 07 Septembre 2026', location: 'Libre', status: 'brouillon' },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    activity: '',
    securityCode: '',
    endCode: '',
    designSystemId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: events.length + 1,
      title: formData.title,
      date: `${formData.startDate} - ${formData.endDate}`,
      location: formData.location,
      status: 'actif'
    };
    setEvents([...events, newEvent]);
    setShowForm(false);
    setFormData({
      title: '', description: '', startDate: '', endDate: '', 
      location: '', activity: '', securityCode: '', endCode: '', designSystemId: ''
    });
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      setEvents(events.filter(event => event.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Événements</h1>
        <button onClick={() => setShowForm(!showForm)} className={styles.addButton}>
          + Ajouter un événement
        </button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h2>Ajouter un événement</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Titre</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Date de début</label>
                <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Date de fin</label>
                <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Lieu / Activité</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Code de sécurité</label>
                <input type="text" value={formData.securityCode} onChange={(e) => setFormData({...formData, securityCode: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Code de fin</label>
                <input type="text" value={formData.endCode} onChange={(e) => setFormData({...formData, endCode: e.target.value})} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>UID/ID Design System</label>
              <input type="text" value={formData.designSystemId} onChange={(e) => setFormData({...formData, designSystemId: e.target.value})} />
            </div>
            <div className={styles.formActions}>
              <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>Annuler</button>
              <button type="submit" className={styles.submitBtn}>Créer</button>
            </div>
          </form>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Date</th>
            <th>Lieu</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.date}</td>
              <td>{event.location}</td>
              <td><span className={`${styles.status} ${styles[event.status]}`}>{event.status}</span></td>
              <td>
                <button className={styles.editBtn}>✏️ Modifier</button>
                <button onClick={() => handleDelete(event.id)} className={styles.deleteBtn}>🗑️ Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}