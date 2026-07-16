import { supabase } from "@/lib/supabase";


export async function obtenerAvisoActivo() {


  const { data, error } = await supabase

    .from("avisos")

    .select(`
      *,
      usuarios:creado_por (
        nombre
      )
    `)

    .eq("activo", true)

    .order("creado_en", {
      ascending: false,
    })

    .limit(1)

    .maybeSingle();



  if (error) {

    console.error(error);

    return null;

  }


  return data;

}