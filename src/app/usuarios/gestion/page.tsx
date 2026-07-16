import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import BottomNav from "@/components/navigation/BottomNav";


export default async function GestionUsuarios() {


  const supabase = await supabaseServer();


  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("*");



const administradores =
  usuarios?.filter(
    (usuario) =>
      usuario.rol === "admin" &&
      usuario.activo === true
  ) || [];


const usuariosNormales =
  usuarios?.filter(
    (usuario) =>
      usuario.rol !== "admin" &&
      usuario.activo === true
  ) || [];



  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">


      <h1 className="text-3xl font-bold text-slate-800">
        👥 Gestión de usuarios
      </h1>


      <p className="mt-2 text-slate-500">
        Crear y administrar los usuarios de la aplicación.
      </p>



      <Link

        href="/usuarios/alta"

        className="mt-6 block rounded-2xl bg-blue-600 py-3 text-center font-semibold text-white"

      >

        ➕ Alta de usuarios

      </Link>




      <div className="mt-8 space-y-4">


        <h2 className="text-xl font-bold">
          👑 Administradores
        </h2>


        {administradores.map((usuario) => (


          <div

            key={usuario.id}

            className="rounded-2xl bg-white p-5 shadow text-center"

          >

            <h3 className="text-xl font-bold">
              {usuario.nombre || "Sin nombre"}
            </h3>


            <p className="mt-2 text-slate-500">
              👑 Administrador
            </p>


            <Link

              href={`/usuarios/editar/${usuario.id}`}

              className="mt-4 inline-block rounded-xl bg-blue-500 px-5 py-2 font-semibold text-white"

            >

              ✏️ Editar

            </Link>


          </div>


        ))}




        <h2 className="mt-8 text-xl font-bold">
          👮 Usuarios
        </h2>



        {usuariosNormales.map((usuario) => (


          <div

            key={usuario.id}

            className="rounded-2xl bg-white p-5 shadow text-center"

          >

            <h3 className="text-xl font-bold">
              {usuario.nombre || "Sin nombre"}
            </h3>


            <p className="mt-2 text-slate-500">
              👮 Policía
            </p>


            <Link

              href={`/usuarios/editar/${usuario.id}`}

              className="mt-4 inline-block rounded-xl bg-blue-500 px-5 py-2 font-semibold text-white"

            >

              ✏️ Editar

            </Link>


          </div>


        ))}



      </div>




      <Link

        href="/usuarios/inactivos"

        className="mt-8 block rounded-2xl bg-slate-700 py-3 text-center font-semibold text-white"

      >

        🔒 Usuarios inactivos

      </Link>




      <BottomNav />


    </main>

  );

}