import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ADMIN_EMAIL = 'admin@eventsync.com';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('secret', 10);

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const isValidPassword = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET || 'secret_key_123',
      { expiresIn: '24h' }
    );

    const response = NextResponse.json({ 
      success: true,
      message: 'Connexion réussie',
      token 
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}