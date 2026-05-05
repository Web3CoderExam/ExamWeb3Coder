import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validation de base
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    // Chercher l'admin en base
    const db = getDb();
    const result = await db.query(
      "SELECT id, email, password_hash FROM admins WHERE email = $1 LIMIT 1",
      [email.toLowerCase().trim()]
    );

    const admin = result.rows[0];

    // Utilisateur introuvable OU mauvais mot de passe → même message (sécurité)
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return NextResponse.json(
        { message: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    // Créer la session (cookie JWT)
    await createSession(admin.id, admin.email);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json(
      { message: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
