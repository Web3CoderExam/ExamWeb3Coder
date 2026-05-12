import { NextResponse } from 'next/server';

export function middleware(request) {
  // Permettre l'accès à toutes les routes pour tester
  return NextResponse.next();
}

export const config = {
  matcher: [],
};