'use client';

import { useState } from 'react';
import styles from './settings.module.css';

export default function Settings() {
  const [settings, setSettings] = useState({
    platformName: 'EventSync',
    contactEmail: 'contact@eventsync.com',
    defaultRoom: 'Salle A',
    secondaryRoom: 'Salle B',
    tertiaryRoom: 'Salle C',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY'
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sauvegarder les paramètres
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={styles.container}>
      <h1>Paramètres</h1>
      <p className={styles.subtitle}>Informations générales</p>

      {saved && (
        <div className={styles.successMessage}>
          ✅ Paramètres sauvegardés avec succès !
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2>Informations générales</h2>
          
          <div className={styles.formGroup}>
            <label>Nom de la plateforme</label>
            <input 
              type="text" 
              name="platformName"
              value={settings.platformName} 
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email de contact</label>
            <input 
              type="email" 
              name="contactEmail"
              value={settings.contactEmail} 
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Salles par défaut</h2>
          
          <div className={styles.formGroup}>
            <label>Salle A</label>
            <input 
              type="text" 
              name="defaultRoom"
              value={settings.defaultRoom} 
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Salle B</label>
            <input 
              type="text" 
              name="secondaryRoom"
              value={settings.secondaryRoom} 
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Salle C</label>
            <input 
              type="text" 
              name="tertiaryRoom"
              value={settings.tertiaryRoom} 
              onChange={handleChange}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Préférences d'affichage</h2>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Fuseau horaire</label>
              <select name="timezone" value={settings.timezone} onChange={handleChange}>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Format de date</label>
              <select name="dateFormat" value={settings.dateFormat} onChange={handleChange}>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className={styles.saveBtn}>
          💾 Sauvegarder les modifications
        </button>
      </form>
    </div>
  );
}