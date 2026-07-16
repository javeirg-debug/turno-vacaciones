import { supabase } from "@/lib/supabase";

export async function cambiarEstadoUsuario(
  id: string,
  activo: boolean
) {
  const { error } = await supabase
    .from("usuarios")
    .update({
      activo,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}