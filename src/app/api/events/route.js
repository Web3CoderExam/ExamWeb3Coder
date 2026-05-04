import { NextResponse } from 'next/server';
import { getAllEvents, getEventById } from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    try {
        if (id) {
            const event = await getEventById(id);
            if (!event) return NextResponse.json({ success: false, error: "Événement non trouvé" }, { status: 404 });
            return NextResponse.json({ success: true, data: event }, { status: 200 });
        }

        const events = await getAllEvents();
        return NextResponse.json({ success: true, data: events }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
    }
}