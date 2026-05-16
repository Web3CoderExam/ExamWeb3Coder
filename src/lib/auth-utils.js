import { getDb } from './db';
import bcrypt from 'bcryptjs';

export async function verifyUser(email, password) {
    const db = await getDb();

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}