import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    // Obtener el usuario autenticado
const {
  data: { user },
} = await admin.auth.getUser();

if (user && user.id === id) {
  return NextResponse.json(
    {
      error: "No puedes eliminar tu propio usuario.",
    },
    {
      status: 403,
    }
  );
}

    console.log("ID:", id);

    // 1. Borrar las vacaciones del usuario
    const { error: vacacionesError } = await admin
      .from("vacaciones")
      .delete()
      .eq("usuario_id", id);

    console.log("ERROR VACACIONES:", vacacionesError);

    if (vacacionesError) {
      return NextResponse.json(
        { error: vacacionesError.message },
        { status: 400 }
      );
    }

    // 2. Borrar el usuario de la tabla usuarios
    const { error: dbError } = await admin
      .from("usuarios")
      .delete()
      .eq("id", id);

    console.log("ERROR USUARIOS:", dbError);

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 400 }
      );
    }

    // 3. Borrar el usuario de Auth
    const { error: authError } =
      await admin.auth.admin.deleteUser(id);

    console.log("ERROR AUTH:", authError);

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
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