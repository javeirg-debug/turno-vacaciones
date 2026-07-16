import { supabase } from "@/lib/supabase";

const ADMIN_ID = "89746226-97f8-4afc-a56a-44c43fe8ea69";

export async function guardarSolicitud({
  tipo,
  fechaInicio,
  fechaFin,
  observaciones,
}: {
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  observaciones: string;
}) {
  const { data, error } = await supabase
    .from("vacaciones")
    .insert({
      usuario_id: ADMIN_ID,
      tipo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      motivo: observaciones,
      estado: "pendiente",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function obtenerSolicitudes() {
  const { data, error } = await supabase
    .from("vacaciones")
    .select("*")
    .eq("usuario_id", ADMIN_ID)
    .order("fecha_inicio", { ascending: true });

  if (error) throw error;

  return data;
}

export async function eliminarSolicitud(id: string) {
  const { error } = await supabase
    .from("vacaciones")
    .delete()
    .eq("id", id);

  if (error) throw error;
}