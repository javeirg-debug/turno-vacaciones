import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import BottomNav from "@/components/navigation/BottomNav";
import EditUserForm from "@/components/forms/EditUserForm";
const USUARIO_PROTEGIDO = "2350c111-c7bb-40c2-9bb1-b2cc172684fa";

export default async function EditarUsuario({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {

  const { id } = await params;

  const supabase = await supabaseServer();

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .single();


  let email = "No disponible";


  if (usuario) {

    const { data } =
      await supabaseAdmin.auth.admin.getUserById(
        usuario.id
      );

    email = data.user?.email ?? "No disponible";

  }



  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">


      <h1 className="text-3xl font-bold text-slate-800">
        ✏️ Editar usuario
      </h1>


      <p className="mt-2 text-slate-500">
        Modifica la información del usuario.
      </p>



      {usuario && (

        <>

          {/* INFORMACIÓN DE CUENTA */}

          <div className="mt-8 rounded-3xl bg-white p-6 shadow">


            <h2 className="text-xl font-bold">
              👤 Información de cuenta
            </h2>



            <div className="mt-5 space-y-4">



              <div>

                <p className="text-sm text-slate-500">
                  Nombre
                </p>

                <p className="text-lg font-semibold">
                  {usuario.nombre}
                </p>

              </div>




              <div>

                <p className="text-sm text-slate-500">
                  Correo electrónico
                </p>

                <p className="text-lg font-semibold">
                  {email}
                </p>

              </div>




              <div>

                <p className="text-sm text-slate-500">
                  Rol
                </p>

                <p className="text-lg font-semibold">

                  {usuario.rol === "admin"
                    ? "👑 Administrador"
                    : "👮 Policía"}

                </p>

              </div>




              <div>

                <p className="text-sm text-slate-500">
                  Estado
                </p>

                <p className="text-lg font-semibold">

                  {usuario.activo
                    ? "🟢 Activo"
                    : "🔴 Inactivo"}

                </p>

              </div>



            </div>


          </div>




          {/* EDITAR DATOS */}

          <div className="mt-6">

            <EditUserForm usuario={usuario} />

          </div>





          {/* ACCIONES */}

          <div className="mt-6 rounded-3xl bg-white p-6 shadow">


            <h2 className="text-xl font-bold">
              ⚙️ Acciones
            </h2>



            <div className="mt-5 space-y-4 text-center">



              <Link
                href={`/usuarios/password/${usuario.id}`}
                className="inline-block rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-white"
              >
                🔑 Restablecer contraseña
              </Link>



              <br />



{usuario.id !== USUARIO_PROTEGIDO && (

  <Link
    href={`/usuarios/desactivar/${usuario.id}`}
    className="inline-block rounded-2xl bg-red-500 px-6 py-3 font-semibold text-white"
  >
    🔒 Desactivar usuario
  </Link>

)}



            </div>


          </div>





          <div className="mt-8 text-center">


            <Link
              href="/usuarios/gestion"
              className="inline-block rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              ⬅️ Volver a gestión de usuarios
            </Link>


          </div>



        </>

      )}



      <BottomNav />


    </main>

  );

}