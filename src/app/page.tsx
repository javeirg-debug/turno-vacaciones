import { supabase } from "@/lib/supabase";
import AddUserForm from "@/components/forms/AddUserForm";

export default async function Usuarios() {

  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("*");


  return (
    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="text-3xl font-bold text-slate-800">
        👥 Trabajadores
      </h1>

      <p className="mt-2 text-slate-500">
        Lista del equipo
      </p>


      <div className="mt-8 space-y-4">

        {usuarios?.map((usuario) => (

          <div
            key={usuario.id}
            className="rounded-2xl bg-white p-5 shadow"
          >

            <h2 className="text-xl font-bold">
              {usuario.nombre_completo || "Sin nombre"}
            </h2>

            <p className="text-slate-500">
              {usuario.rol}
            </p>

          </div>

        ))}


        {(!usuarios || usuarios.length === 0) && (

          <div className="rounded-2xl bg-white p-5 shadow">

            <p>
              No hay trabajadores registrados.
            </p>

          </div>

        )}

      </div>


      <AddUserForm />

    </main>
  );
}