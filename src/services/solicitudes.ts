import { supabase } from "@/lib/supabase";


// CREAR SOLICITUD
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario no autenticado");
  }
  const { data: existente, error: errorExistente } = await supabase
    .from("vacaciones")
    .select("id")
    .eq("usuario_id", user.id)
    .lte("fecha_inicio", fechaFin)
    .gte("fecha_fin", fechaInicio)
    .limit(1);

  if (errorExistente) {
    throw errorExistente;
  }

  if (existente && existente.length > 0) {
    throw new Error(
      "Ya tienes una solicitud registrada en esas fechas."
    );
  }
  const { data, error } = await supabase
    .from("vacaciones")
    .insert({
      usuario_id: user.id,
      tipo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      motivo: observaciones,
      estado: "registrada",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}



// VER MIS SOLICITUDES
export async function obtenerSolicitudes() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const { data, error } = await supabase
    .from("vacaciones")
    .select("*")
    .eq("usuario_id", user.id)
    .order("fecha_inicio", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}



// VER TODAS LAS SOLICITUDES (CALENDARIO)
export async function obtenerTodasLasSolicitudes() {

  const { data, error } = await supabase
    .from("vacaciones_con_usuario")
    .select("*")
    .order("fecha_inicio", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}



// OBTENER SOLICITUDES DE UN DÍA
export async function obtenerSolicitudesDia(fecha: string) {

  const { data, error } = await supabase
    .from("vacaciones_con_usuario")
    .select("*")
    .lte("fecha_inicio", fecha)
    .gte("fecha_fin", fecha)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data;
}



// ELIMINAR SOLICITUD
export async function eliminarSolicitud(id: string) {

  console.log("BORRANDO ID:", id);

  const { data, error } = await supabase
    .from("vacaciones")
    .delete()
    .eq("id", id)
    .select();

  console.log("BORRADO:", data);
  console.log("ERROR:", error);

  if (error) {
    throw error;
  }

}


// ACTUALIZAR SOLICITUD
export async function actualizarSolicitud({

  id,
  tipo,
  fechaInicio,
  fechaFin,
  observaciones,

}: {

  id: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  observaciones: string;

}) {

  const { data, error } = await supabase
    .from("vacaciones")
    .update({
      tipo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      motivo: observaciones,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;

}
// HISTORIAL DE SOLICITUDES

export async function obtenerHistorialSolicitudes() {

  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {

    throw new Error("Usuario no autenticado");

  }


  const { data, error } = await supabase

    .from("vacaciones")

    .select("*")

    .eq("usuario_id", user.id)

    .order("fecha_inicio", {
      ascending: false,
    });



  if (error) {

    throw error;

  }


  return data;

}