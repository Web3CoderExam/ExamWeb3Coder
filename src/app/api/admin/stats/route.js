import { NextResponse } from 'next/server';

export async function GET() {
  // Simuler des données (à remplacer par votre BDD)
  const stats = {
    sessions: 56,
    speakers: 25,
    upcomingSessions: 10,
    questions: 3
  };
  
  return NextResponse.json(stats);
}