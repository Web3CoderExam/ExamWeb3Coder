import { promises as fs } from 'fs';
import path from 'path';
import { getDb } from './auth';
const DATA_PATH = path.join(process.cwd(), 'src/data/mockData.json');


export async function getAllEvents() {
    if (process.env.DATABASE_URL) {
        const pool = getDb();
        const res = await pool.query('SELECT * FROM events ORDER BY date ASC');
        return res.rows;
    }

    const fileContent = await fs.readFile(DATA_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    return data.events;
}


export async function getEventById(id) {
    if (process.env.DATABASE_URL) {
        const pool = getDb();
        const res = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        return res.rows[0] || null;
    }

    const events = await getAllEvents();
    return events.find(event => event.id === Number(id)) || null;
}