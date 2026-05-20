DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS events;

CREATE TABLE IF NOT EXISTS events (
                                      id SERIAL PRIMARY KEY,
                                      title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    location VARCHAR(200),
    category VARCHAR(100),
    image_url VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS users (
                                     id SERIAL PRIMARY KEY,
                                     name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS registrations (
                                             id SERIAL PRIMARY KEY,
                                             user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'confirmed',
    UNIQUE(user_id, event_id)
    );

INSERT INTO users (name, email, password, role)
VALUES ('Charaffaine Issa Ben Said', 'charaffaine@hei.mg', '$2b$10$Twt45bfEpFqZcgz7558rTunu3B7s3las1QZ5BQpnfKrUTLwnF6r2y', 'admin')
    ON CONFLICT (email) DO NOTHING;

INSERT INTO events (title, description, date, location, category)
VALUES (
           'Conférence AgriTech Madagascar',
           'Utilisation de l''IA pour l''aide à la décision agricole (Projet IACFOD).',
           '2026-05-15 09:00:00',
           'Antananarivo',
           'Agriculture'
       ) ON CONFLICT DO NOTHING;

INSERT INTO registrations (user_id, event_id)
SELECT u.id, e.id
FROM users u, events e
WHERE u.email = 'charaffaine@hei.mg' AND e.title = 'Conférence AgriTech Madagascar'
    ON CONFLICT DO NOTHING;