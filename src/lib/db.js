import { promises as fs } from 'fs';
import path from 'path';
import { Pool } from "pg";

const DATA_PATH = path.join(process.cwd(), 'src/data/mockData.json');

let pool;

export function getDb() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });
  }
  return pool;

}

export async function getAllEvents() {
    let dbEvents = [];
    let mockEvents = [];

    if (process.env.DATABASE_URL) {
        try {
            const client = getDb();
            const res = await client.query('SELECT * FROM events ORDER BY date ASC');
            dbEvents = res.rows;
        } catch (error) {
            console.error("⚠️ Erreur BDD (getAllEvents):", error.message);
        }
    }

    try {
        const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
        const data = JSON.parse(fileContent);
        mockEvents = data.events || data;
    } catch (error) {
        console.error("⚠️ Erreur Lecture JSON:", error.message);
    }

    return [...dbEvents, ...mockEvents];
}

export async function getEventById(id) {
    if (process.env.DATABASE_URL) {
        try {
            const client = getDb();
            const res = await client.query('SELECT * FROM events WHERE id = $1', [id]);
            if (res.rows.length > 0) return res.rows[0];
        } catch (error) {
            console.error("⚠️ Erreur BDD (getEventById):", error.message);
        }
    }

    const allEvents = await getAllEvents();
    return allEvents.find(event => String(event.id) === String(id)) || null;
}

export async function getUserRegistrations(userId) {
  try {
    const client = getDb();
    const result = await client.query(
      `SELECT r.id as registration_id, r.registration_date, e.*
       FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE r.user_id = $1`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error("⚠️ Erreur BDD (getUserRegistrations):", error.message);
    return [];
  }
}

export async function registerForEvent(userId, eventId) {
  try {
    const client = getDb();
    const result = await client.query(
      `INSERT INTO registrations (user_id, event_id)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, eventId]
    );
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error("⚠️ Erreur BDD (registerForEvent):", error.message);
    return { success: false, error: error.message };
  }
}