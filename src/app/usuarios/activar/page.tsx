import { supabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";


export default async function ActivarUsuario({
  params,
}: {
  params: {
    id: string;
  };
}) {


  const supabase = await supabaseServer();


  await supabase

    .from("usuarios")

    .update({

      activo: true,

    })

    .eq(

      "id",

      params.id

    );



  redirect("/usuarios/gestion");


}