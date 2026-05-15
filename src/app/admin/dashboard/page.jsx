'use client';

import { useState } from 'react';
import styles from './dashboard.module.css';

export default function AdminDashboard() {
  const stats = [
    { title: 'Sessions', value: '56', icon: '🎤', change: '+12%', trend: 'up' },
    { title: 'Intervenants', value: '25', icon: '👥', change: '+5%', trend: 'up' },
    { title: 'Salles', value: '8', icon: '🏠', change: '+2%', trend: 'up' },
    { title: 'Questions', value: '3', icon: '💬', change: '-1%', trend: 'down' },
  ];

  const upcomingSessions = [
    { id: 1, title: 'Dev Conference 2026', date: '12 Juin 2026', speaker: 'Jean Dupont', room: 'Salle A' },
    { id: 2, title: 'AI Summit 2026', date: '20 Août 2026', speaker: 'Marie Martin', room: 'Salle B' },
    { id: 3, title: 'Node.js Best Practices', date: '05 Sept 2026', speaker: 'Thomas Dubois', room: 'Salle C' },
    { id: 4, title: 'UX/UI Design System', date: '15 Oct 2026', speaker: 'Sophie Bernard', room: 'Salle A' },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bienvenue, <span className={styles.gradient}>Admin</span></h1>
        <p className={styles.subtitle}>Vous avez une vue d'ensemble des informations suivantes</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={stat.title} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statTitle}>{stat.title}</div>
            <div className={`${styles.statChange} ${styles[stat.trend]}`}>
              {stat.change}
            </div>
            <div className={styles.statProgress}>
              <div 
                className={styles.statProgressBar}
                style={{ width: `${Math.min(parseInt(stat.value) * 1.5, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Sessions à venir</h2>
          <button className={styles.viewAllBtn}>Voir tout →</button>
        </div>

        <div className={styles.tableWrapper}>
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
              {upcomingSessions.map((session) => (
                <tr key={session.id}>
                  <td className={styles.sessionTitle}>{session.title}</td>
                  <td>{session.date}</td>
                  <td>{session.speaker}</td>
                  <td>{session.room}</td>
                  <td>
                    <button className={styles.editBtn}>✏️ Modifier</button>
                    <button className={styles.deleteBtn}>🗑️ Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          <div className={styles.tableInfo}>
            {upcomingSessions.length} session(s) affichée(s)
          </div>
          <div className={styles.actionButtons}>
            <button className={styles.cancelBtn}>Annuler</button>
            <button className={styles.validateBtn}>Valider</button>
            <button className={styles.deleteAllBtn}>Supprimer</button>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h3 className={styles.actionsTitle}>Actions rapides</h3>
        <p className={styles.actionsSubtitle}>Gérez votre contenu en un clic</p>
        <div className={styles.actionsGrid}>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>➕</span>
            <div>
              <div className={styles.actionLabel}>Nouvel événement</div>
              <div className={styles.actionDesc}>Ajouter un événement</div>
            </div>
          </button>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>🎤</span>
            <div>
              <div className={styles.actionLabel}>Nouvelle session</div>
              <div className={styles.actionDesc}>Planifier une session</div>
            </div>
          </button>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>👥</span>
            <div>
              <div className={styles.actionLabel}>Nouvel intervenant</div>
              <div className={styles.actionDesc}>Ajouter un speaker</div>
            </div>
          </button>
          <button className={styles.actionBtn}>
            <span className={styles.actionIcon}>🏠</span>
            <div>
              <div className={styles.actionLabel}>Gérer les salles</div>
              <div className={styles.actionDesc}>Configurer les salles</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}