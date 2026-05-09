import { NextResponse } from "next/server";

import { getUserRegistrations } from "@/lib/db";

import { getSession } from "@/lib/auth";


export async function GET() {

  try {

    const session = await getSession();



    if (!session || !session.userId) {

      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    }



    const registrations = await getUserRegistrations(session.userId);


    return NextResponse.json({

      success: true,

      user_id: session.userId,

      data: registrations

    });

  } catch (error) {

    return NextResponse.json({ error: error.message }, { status: 500 });

  }

}