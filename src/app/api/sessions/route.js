import { NextResponse } from "next/server";
import { getAllSessions, getSessionById } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const session = await getSessionById(id);
      if (!session)
        return NextResponse.json(
          { success: false, error: "Session non trouvée" },
          { status: 404 }
        );
      return NextResponse.json({ success: true, data: session }, { status: 200 });
    }

    const sessions = await getAllSessions();
    return NextResponse.json({ success: true, data: sessions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
