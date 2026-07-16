import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";

export default async function DesactivarUsuario({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {

  const { id } = await params;

  const supabase = await supabaseServer();

  // Usuario que ha iniciado sesión
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si intenta desactivarse a sí mismo
  if (user && user.id === id) {
    return (
      <main className="min-h-screen bg-slate-100 p-6 flex flex-col items-center justify-center">

        <div className="rounded-2xl bg-white p-8 shadow text-center max-w-md">

          <h1 className="text-2xl font-bold text-red-600">
            ❌ Acción no permitida
          </h1>

          <p className="mt-4 text-slate-600">
            No puedes desactivar tu propio usuario.
          </p>

          <Link
            href="/usuarios/gestion"
            className="mt-6 inline-block rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white"
          >
            ⬅️ Volver a gestión de usuarios
          </Link>

        </div>

      </main>
    );
  }

  console.log("ID RECIBIDO:", id);

  const { data, error } = await supabase
    .from("usuarios")
    .update({
      activo: false,
    })
    .eq("id", id)
    .select();

  console.log("DATOS UPDATE:", data);
  console.log("ERROR UPDATE:", error);

  redirect("/usuarios/gestion");

}