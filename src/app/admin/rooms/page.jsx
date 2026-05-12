'use client';

import { useState } from 'react';
import styles from './rooms.module.css';

export default function RoomsManagement() {
  const [showForm, setShowForm] = useState(false);
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Salle A', capacity: 50, equipment: 'Vidéo projecteur, Tableau blanc', status: 'disponible' },
    { id: 2, name: 'Salle B', capacity: 80, equipment: 'Écran tactile, Sonorisation', status: 'disponible' },
    { id: 3, name: 'Salle C', capacity: 30, equipment: 'Vidéo projecteur', status: 'occupée' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    equipment: '',
    status: 'disponible'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRoom = {
      id: rooms.length + 1,
      ...formData,
      capacity: parseInt(formData.capacity)
    };
    setRooms([...rooms, newRoom]);
    setShowForm(false);
    setFormData({ name: '', capacity: '', equipment: '', status: 'disponible' });
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      setRooms(rooms.filter(room => room.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setRooms(rooms.map(room => 
      room.id === id 
        ? { ...room, status: room.status === 'disponible' ? 'occupée' : 'disponible' }
        : room
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Salles</h1>
        <button onClick={() => setShowForm(!showForm)} className={styles.addButton}>
          + Ajouter une salle
        </button>
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h2>Ajouter une salle</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Nom de la salle *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>

            <div className={styles.formGroup}>
              <label>Capacité *</label>
              <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: e.target.value})} required />
            </div>

            <div className={styles.formGroup}>
              <label>Équipements</label>
              <input type="text" value={formData.equipment} onChange={(e) => setFormData({...formData, equipment: e.target.value})} />
            </div>

            <div className={styles.formGroup}>
              <label>Statut</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="disponible">Disponible</option>
                <option value="occupée">Occupée</option>
              </select>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>Annuler</button>
              <button type="submit" className={styles.submitBtn}>Créer</button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.roomsGrid}>
        {rooms.map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <div className={styles.roomHeader}>
              <h3>{room.name}</h3>
              <span className={`${styles.status} ${styles[room.status]}`}>
                {room.status}
              </span>
            </div>
            <div className={styles.roomInfo}>
              <p>👥 Capacité: {room.capacity} personnes</p>
              <p>🛠️ Équipements: {room.equipment || 'Aucun'}</p>
            </div>
            <div className={styles.roomActions}>
              <button onClick={() => toggleStatus(room.id)} className={styles.toggleBtn}>
                {room.status === 'disponible' ? '🔴 Marquer occupée' : '🟢 Marquer disponible'}
              </button>
              <button onClick={() => handleDelete(room.id)} className={styles.deleteBtn}>🗑️ Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}