'use client';

import { useState, useEffect } from 'react';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [upcomingSessions, setUpcomingSessions] = useState([
    { id: 1, title: 'Introduction à React', date: '2026-05-15', speaker: 'Jean Dupont', room: 'Salle A' },
    { id: 2, title: 'Next.js Avancé', date: '2026-05-16', speaker: 'Marie Martin', room: 'Salle B' },
    { id: 3, title: 'UI/UX Design', date: '2026-05-17', speaker: 'Sophie Bernard', room: 'Salle C' },
  ]);

  const stats = {
    sessions: 56,
    speakers: 25,
    upcomingSessions: 10,
    questions: 3
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      setUpcomingSessions(sessions => sessions.filter(s => s.id !== id));
    }
  };

  const filteredSessions = upcomingSessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Bienvenue, Admin</h1>
        <p>Votre site est maintenant disponible.</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#667eea' }}>🎤</div>
          <div className={styles.statInfo}>
            <h3>{stats.sessions}</h3>
            <p>Sessions</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#48bb78' }}>👥</div>
          <div className={styles.statInfo}>
            <h3>{stats.speakers}</h3>
            <p>Intervenants</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ed8936' }}>⏰</div>
          <div className={styles.statInfo}>
            <h3>{stats.upcomingSessions}</h3>
            <p>Sessions à venir</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e53e3e' }}>💬</div>
          <div className={styles.statInfo}>
            <h3>{stats.questions}</h3>
            <p>Questions</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Sessions à venir</h2>
        <div className={styles.searchBar}>
          <input 
            type="text" 
            placeholder="Rechercher sessions..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.searchButton}>🔍 Rechercher</button>
        </div>
        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Date</th>
              <th>Intervenant</th>
              <th>Salle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((session) => (
              <tr key={session.id}>
                <td>{session.title}</td>
                <td>{session.date}</td>
                <td>{session.speaker}</td>
                <td>{session.room}</td>
                <td>
                  <button className={styles.editBtn}>✏️</button>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(session.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className={styles.actionButtons}>
          <button className={styles.cancelBtn}>Annuler</button>
          <button className={styles.validateBtn}>Valider</button>
          <button className={styles.deleteAllBtn}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}