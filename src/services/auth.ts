import { supabase } from "@/lib/supabase";

// LOGIN
export async function iniciarSesion(
  email: string,
  password: string
) {

  const { data, error } =
    await supabase.auth.signInWithPassword({

      email,

      password,

    });

  if (error) {

    throw error;

  }

  // Comprobar si el usuario está activo
  const { data: usuario, error: usuarioError } =
    await supabase
      .from("usuarios")
      .select("activo")
      .eq("id", data.user.id)
      .single();

  if (usuarioError) {

    await supabase.auth.signOut();

    throw new Error("No se pudo comprobar el usuario.");

  }

  if (!usuario.activo) {

    // Cerrar sesión inmediatamente
    await supabase.auth.signOut();

    throw new Error(
      "Tu usuario está desactivado. Contacta con un administrador."
    );

  }

  return data.user;

}



// LOGOUT
export async function cerrarSesion() {

  const { error } =
    await supabase.auth.signOut();

  if (error) {

    throw error;

  }

}



// USUARIO ACTUAL
export async function datosUsuarioActual() {

  const { data: authData } =
    await supabase.auth.getUser();

  if (!authData.user) {

    return null;

  }

  console.log("AUTH USER ID:", authData.user.id);

  const { data, error } =
    await supabase
      .from("usuarios")
      .select("*")
      .eq("id", authData.user.id);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  return data?.[0] ?? null;

}