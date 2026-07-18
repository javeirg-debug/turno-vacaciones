import { supabase } from "@/lib/supabase";


export type FechaConflictiva = {
  fecha: string;
  personas: number;
};



export async function obtenerConflictosUsuario(
  usuarioId: string
): Promise<FechaConflictiva[]> {


  const { data, error } =
    await supabase.rpc(
      "obtener_fechas_conflictivas",
      {
        usuario_uuid: usuarioId,
      }
    );



  if (error) {

    console.error(
      "Error obteniendo conflictos:",
      error
    );

    return [];

  }



  return data || [];


}