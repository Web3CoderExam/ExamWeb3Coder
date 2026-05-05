'use client';

import { useState } from 'react';
import styles from './speakers.module.css';

export default function SpeakersManagement() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [speakers, setSpeakers] = useState([
    { id: 1, firstName: 'Johan', lastName: 'Rakoto', email: 'johan@example.com', specialty: 'Développeur', sessions: 3 },
    { id: 2, firstName: 'Sarah', lastName: 'Andriana', email: 'sarah@example.com', specialty: 'Designer', sessions: 2 },
    { id: 3, firstName: 'Radio', lastName: 'Andriana', email: 'radio@example.com', specialty: 'DevOps', sessions: 1 },
  ]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialty: '',
    securityCode: '',
    bio: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSpeaker = {
      id: speakers.length + 1,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      specialty: formData.specialty,
      sessions: 0
    };
    setSpeakers([...speakers, newSpeaker]);
    setShowForm(false);
    setFormData({ firstName: '', lastName: '', email: '', specialty: '', securityCode: '', bio: '' });
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet intervenant ?')) {
      setSpeakers(speakers.filter(speaker => speaker.id !== id));
    }
  };

  const filteredSpeakers = speakers.filter(speaker =>
    `${speaker.firstName} ${speaker.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speaker.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Intervenants</h1>
        <button onClick={() => setShowForm(!showForm)} className={styles.addButton}>
          + Ajouter un intervenant
        </button>
      </div>

      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Rechercher par nom ou spécialité..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.searchButton}>🔍 Rechercher</button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h2>Ajouter un intervenant</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Prénom *</label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Nom *</label>
                <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Email *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>

            <div className={styles.formGroup}>
              <label>Spécialité *</label>
              <input type="text" value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} required />
            </div>

            <div className={styles.formGroup}>
              <label>Bio</label>
              <textarea rows="3" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
            </div>

            <div className={styles.formGroup}>
              <label>Code de sécurité</label>
              <input type="text" value={formData.securityCode} onChange={(e) => setFormData({...formData, securityCode: e.target.value})} />
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
            <th>Nom complet</th>
            <th>Email</th>
            <th>Spécialité</th>
            <th>Sessions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSpeakers.map((speaker) => (
            <tr key={speaker.id}>
              <td><strong>{speaker.firstName} {speaker.lastName}</strong></td>
              <td>{speaker.email}</td>
              <td><span className={styles.specialty}>{speaker.specialty}</span></td>
              <td>{speaker.sessions}</td>
              <td>
                <button className={styles.editBtn}>✏️</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(speaker.id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}