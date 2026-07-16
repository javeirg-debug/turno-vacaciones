import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";


const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);



export async function POST(request: Request) {

  try {

    const { id } = await request.json();


    if (!id) {

      return NextResponse.json(
        {
          error: "Falta el usuario."
        },
        {
          status: 400
        }
      );

    }



    // Cambiar contraseña en Supabase Auth

    const { error: authError } =
      await admin.auth.admin.updateUserById(
        id,
        {
          password: "123456",
        }
      );


    if (authError) {

      return NextResponse.json(
        {
          error: authError.message
        },
        {
          status: 400
        }
      );

    }



    // Obligar a cambiar la contraseña al entrar

    const { error: dbError } =
      await admin
        .from("usuarios")
        .update({
          debe_cambiar_clave: true,
        })
        .eq("id", id);



    if (dbError) {

      return NextResponse.json(
        {
          error: dbError.message
        },
        {
          status: 400
        }
      );

    }



    return NextResponse.json({
      ok: true
    });



  } catch (error: any) {


    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: 500
      }
    );


  }

}