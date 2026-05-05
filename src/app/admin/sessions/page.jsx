'use client';

import { useState } from 'react';
import styles from './sessions.module.css';

export default function SessionsManagement() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sessions, setSessions] = useState([
    { id: 1, title: 'Introduction à React', event: 'Dev Conference 2026', date: '2026-06-12', time: '10:00 - 12:00', room: 'Salle A' },
    { id: 2, title: 'Next.js Avancé', event: 'Dev Conference 2026', date: '2026-06-13', time: '14:00 - 16:00', room: 'Salle B' },
    { id: 3, title: 'UI/UX Design', event: 'Design Week 2026', date: '2026-09-05', time: '09:00 - 11:00', room: 'Salle C' },
    { id: 4, title: 'IA et Machine Learning', event: 'AI Summit 2026', date: '2026-08-20', time: '11:00 - 13:00', room: 'Salle A' },
  ]);

  const [formData, setFormData] = useState({
    event: '',
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    room: '',
    securityCode: '',
    endCode: '',
    designSystemId: ''
  });

  const events = ['Dev Conference 2026', 'AI Summit 2026', 'Design Week 2026'];
  const rooms = ['Salle A', 'Salle B', 'Salle C'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSession = {
      id: sessions.length + 1,
      title: formData.title,
      event: formData.event,
      date: formData.startDate,
      time: `${formData.startDate.split('-')[2] || '10'}:00 - ${formData.endDate.split('-')[2] || '12'}:00`,
      room: formData.room
    };
    setSessions([...sessions, newSession]);
    setShowForm(false);
    setFormData({
      event: '', title: '', description: '', startDate: '', endDate: '', 
      room: '', securityCode: '', endCode: '', designSystemId: ''
    });
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      setSessions(sessions.filter(session => session.id !== id));
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Sessions</h1>
        <button onClick={() => setShowForm(!showForm)} className={styles.addButton}>
          + Ajouter une session
        </button>
      </div>

      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Rechercher par titre ou événement..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.searchButton}>🔍 Rechercher</button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h2>Ajouter une session</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Événement *</label>
              <select 
                value={formData.event} 
                onChange={(e) => setFormData({...formData, event: e.target.value})}
                required
              >
                <option value="">Sélectionner un événement</option>
                {events.map(event => <option key={event} value={event}>{event}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Titre *</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Date de début *</label>
                <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Date de fin *</label>
                <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Salle *</label>
              <select 
                value={formData.room} 
                onChange={(e) => setFormData({...formData, room: e.target.value})}
                required
              >
                <option value="">Sélectionner une salle</option>
                {rooms.map(room => <option key={room} value={room}>{room}</option>)}
              </select>
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
            <th>Événement</th>
            <th>Date</th>
            <th>Horaire</th>
            <th>Salle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSessions.map((session) => (
            <tr key={session.id}>
              <td><strong>{session.title}</strong></td>
              <td>{session.event}</td>
              <td>{session.date}</td>
              <td>{session.time}</td>
              <td>{session.room}</td>
              <td>
                <button className={styles.editBtn}>✏️</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(session.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}