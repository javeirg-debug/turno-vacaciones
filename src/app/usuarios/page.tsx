import Link from "next/link";
import BottomNav from "@/components/navigation/BottomNav";

export default function Administracion() {

  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="text-3xl font-bold text-slate-800">
        ⚙️ Administración
      </h1>

      <p className="mt-2 text-slate-500">
        Configuración y gestión de la aplicación.
      </p>


      <div className="mt-8 space-y-5">


        <Link
          href="/usuarios/gestion"
          className="block rounded-3xl bg-white p-6 shadow hover:bg-slate-50"
        >

          <div className="text-4xl">
            👥
          </div>


          <h2 className="mt-3 text-xl font-bold">
            Gestión de usuarios
          </h2>


          <p className="mt-2 text-slate-500">
            Crear, eliminar, activar y desactivar usuarios.
          </p>

        </Link>





        <Link
          href="/usuarios/ocupacion"
          className="block rounded-3xl bg-white p-6 shadow hover:bg-slate-50"
        >

          <div className="text-4xl">
            🎨
          </div>


          <h2 className="mt-3 text-xl font-bold">
            Configuración de ocupación
          </h2>


          <p className="mt-2 text-slate-500">
            Configurar colores y niveles del calendario.
          </p>


        </Link>





        <Link
          href="/usuarios/avisos"
          className="block rounded-3xl bg-white p-6 shadow hover:bg-slate-50"
        >

          <div className="text-4xl">
            📢
          </div>


          <h2 className="mt-3 text-xl font-bold">
            Avisos
          </h2>


          <p className="mt-2 text-slate-500">
            Crear, modificar o eliminar el aviso visible para todos los usuarios.
          </p>


        </Link>



      </div>



      <BottomNav />


    </main>

  );

}