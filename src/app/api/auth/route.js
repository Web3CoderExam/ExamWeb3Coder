import { NextResponse } from 'next/server';
<<<<<<< HEAD
import { deleteSession } from '@/lib/auth';

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie'
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
=======
import { verifyUser } from '@/lib/auth-utils';
import { createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const user = await verifyUser(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    await createSession(user.id, user.email);

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role }
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur Auth:", error);
>>>>>>> feature/ui-structure
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}