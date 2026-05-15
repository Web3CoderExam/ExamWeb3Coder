import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Déconnecté' });
  response.cookies.delete('admin_token');
  return response;
}