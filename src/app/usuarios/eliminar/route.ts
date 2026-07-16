import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {

    const { id } = await request.json();

    console.log("ID:", id);

    // Eliminar de Auth
    const { error: authError } =
      await admin.auth.admin.deleteUser(id);

    console.log("ERROR AUTH:", authError);

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    // Eliminar de la tabla usuarios
    const { error: dbError } =
      await admin
        .from("usuarios")
        .delete()
        .eq("id", id);

    console.log("ERROR DB:", dbError);

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 400 }
      );
    }

    console.log("USUARIO ELIMINADO CORRECTAMENTE");

    return NextResponse.json({ ok: true });

  } catch (error: any) {

    console.log("ERROR GENERAL:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }
}