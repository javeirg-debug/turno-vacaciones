import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import BottomNav from "@/components/navigation/BottomNav";
import DeleteUserButton from "@/components/DeleteUserButton";

export default async function UsuariosInactivos() {

  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("*")
    .eq("activo", false);

  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="text-3xl font-bold text-slate-800">
        🔒 Usuarios inactivos
      </h1>

      <p className="mt-2 text-slate-500">
        Usuarios bloqueados temporalmente.
      </p>

      <div className="mt-8 space-y-4">

        {usuarios?.map((usuario) => (

          <div
            key={usuario.id}
            className="rounded-2xl bg-white p-5 shadow text-center"
          >

            <h2 className="text-xl font-bold">
              {usuario.nombre || "Sin nombre"}
            </h2>

            <p className="mt-2 text-slate-500">
              {usuario.rol === "admin"
                ? "👑 Administrador"
                : "👮 Policía"}
            </p>

            <Link
              href={`/usuarios/activar/${usuario.id}`}
              className="mt-4 inline-block rounded-xl bg-green-500 px-5 py-2 font-semibold text-white"
            >
              ✅ Activar usuario
            </Link>

            <DeleteUserButton
              id={usuario.id}
              currentUserId={user?.id || ""}
            />

          </div>

        ))}

        {(!usuarios || usuarios.length === 0) && (

          <div className="rounded-2xl bg-white p-5 text-center shadow">
            No hay usuarios inactivos.
          </div>

        )}

      </div>

      <div className="mt-8 text-center">
        <Link
          href="/usuarios/gestion"
          className="inline-block rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          ⬅️ Volver a usuarios
        </Link>
      </div>

      <BottomNav />

    </main>

  );

}