
import bcrypt from "bcryptjs";
import pg from "pg";
import readline from "readline";
import "dotenv/config";

const { Pool } = pg;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const email =
    process.env.ADMIN_EMAIL || (await ask("Email de l'admin : "));
  const password =
    process.env.ADMIN_PASSWORD || (await ask("Mot de passe (min 8 caractères) : "));

  if (!email || !password) {
    console.error("❌ Email et mot de passe requis.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Le mot de passe doit contenir au moins 8 caractères.");
    process.exit(1);
  }

  const password_hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO admins (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
    [email.toLowerCase().trim(), password_hash]
  );

  console.log(`✅ Admin créé avec succès : ${email}`);
  rl.close();
  await pool.end();
}

main().catch((err) => {
  console.error("❌ Erreur :", err.message);
  process.exit(1);
});
