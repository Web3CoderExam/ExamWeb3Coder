import { NextResponse } from "next/server";
import { getAllSpeakers, getSpeakerById } from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const speaker = await getSpeakerById(id);
      if (!speaker)
        return NextResponse.json(
          { success: false, error: "Intervenant non trouvé" },
          { status: 404 }
        );
      return NextResponse.json({ success: true, data: speaker }, { status: 200 });
    }

    const speakers = await getAllSpeakers();
    return NextResponse.json({ success: true, data: speakers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
