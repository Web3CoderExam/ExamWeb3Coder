create database event_sync_db;

-- 1. Activation de l'extension PostGIS (nécessaire pour la localisation)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Suppression des tables si elles existent (pour repartir de zéro proprement)
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 3. Création de la table des Utilisateurs
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Création de la table des Événements
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location_name VARCHAR(255),
    geom GEOMETRY(Point, 4326),
    organizer_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insertion de quelques données de test (optionnel)
INSERT INTO users (username, email, password_hash) VALUES 
('admin_hei', 'admin@hei.mg', 'hash_secure_password');

INSERT INTO events (title, description, event_date, location_name) VALUES 
('Examen GP - EventSync', 'Présentation finale du projet WEB3 à HEI Madagascar', '2026-05-02 09:00:00', 'Campus HEI');
