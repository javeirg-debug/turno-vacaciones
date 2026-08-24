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

  function obtenerIniciales(nombre: string) {
    const partes = nombre.trim().split(" ");

    if (partes.length >= 2) {
      return (
        partes[0][0] +
        partes[partes.length - 1][0]
      ).toUpperCase();
    }

    return nombre.substring(0, 2).toUpperCase();
  }

  function obtenerPuesto(puesto: string) {
    return puesto === "gac"
      ? "🚓 G.A.C"
      : puesto === "seguridad"
      ? "🛡️ Seguridad"
      : puesto === "sala"
      ? "🖥️ Sala"
      : "—";
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      {/* CABECERA */}

      <h1 className="text-3xl font-bold text-slate-800">
        🔒 Usuarios inactivos
      </h1>

      <p className="mt-2 text-slate-500">
        Usuarios bloqueados temporalmente.
      </p>


      {/* LISTADO */}

      <div className="mt-8 space-y-4">

        {usuarios?.map((usuario) => (

          <div
            key={usuario.id}
            className="flex min-h-[88px] overflow-hidden rounded-2xl bg-white shadow"
          >

            {/* INICIALES */}

            <div className="flex w-[76px] shrink-0 items-center justify-center">

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${
                  usuario.sexo === "mujer"
                    ? "bg-pink-100 text-pink-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {obtenerIniciales(
                  usuario.nombre || "Usuario"
                )}
              </div>

            </div>


            {/* INFORMACIÓN */}

            <div className="min-w-0 flex-1 py-3 pr-3">

              <h3 className="truncate text-lg font-bold text-slate-800">
                {usuario.nombre || "Sin nombre"}
              </h3>

              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">

                <span>
                  {usuario.rol === "admin"
                    ? "👑 Administrador"
                    : usuario.sexo === "mujer"
                    ? "👮‍♀️ Policía"
                    : "👮‍♂️ Policía"}
                </span>

                <span>
                  {obtenerPuesto(usuario.puesto)}
                </span>

              </div>

            </div>


           {/* ACCIONES */}

<div className="flex w-[100px] shrink-0 flex-col">

  {/* ACTIVAR */}

  <Link
    href={`/usuarios/activar/${usuario.id}`}
    className="flex flex-1 items-center justify-center bg-green-500 px-2 text-sm font-bold text-white transition hover:bg-green-600"
  >
    Activar
  </Link>


  {/* ELIMINAR */}

  <div className="flex flex-1 items-center justify-center bg-red-500">

    <DeleteUserButton
      id={usuario.id}
      currentUserId={user?.id || ""}
    />

  </div>

</div>

          </div>

        ))}


        {/* SIN USUARIOS */}

        {(!usuarios || usuarios.length === 0) && (

          <div className="rounded-2xl bg-white p-5 text-center text-slate-500 shadow">
            No hay usuarios inactivos.
          </div>

        )}

      </div>


      {/* VOLVER */}

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