import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {


  try {


    const body = await request.json();


    const {
      nombre,
      email,
      rol
    } = body;



    const { data, error } =
      await supabaseAdmin.auth.admin.createUser({

        email,

        password: "123456",

        email_confirm: true,

      });



    if(error){

      throw error;

    }



    if(!data.user){

      throw new Error(
        "No se pudo crear el usuario"
      );

    }





    const { error: perfilError } =

      await supabaseAdmin

        .from("usuarios")

        .insert({

          id:data.user.id,

          nombre,

          rol,

          activo:true,

          debe_cambiar_clave:true,

        });



    if(perfilError){

      throw perfilError;

    }





    return NextResponse.json({

      ok:true

    });



  } catch(error:any){


    return NextResponse.json(

      {
        ok:false,
        error:error.message
      },

      {
        status:400
      }

    );


  }


}