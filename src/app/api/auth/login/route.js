import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    const db = getDb();
    const result = await db.query(
      "SELECT id, email, password FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase().trim()]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Identifiants incorrects." },
        { status: 401 }
      );
    }

    await createSession(user.id, user.email);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return NextResponse.json(
      { message: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}