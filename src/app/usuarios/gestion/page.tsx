import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import BottomNav from "@/components/navigation/BottomNav";
import GestionUsuarioCliente from "@/components/usuarios/GestionUsuariosCliente";

export default async function GestionUsuarios() {
  const supabase = await supabaseServer();

  const { data: usuarios, error } = await supabase
    .from("usuarios")
    .select("*");

  if (error) {
    console.error("Error cargando usuarios:", error);
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      {/* CABECERA */}

      <h1 className="text-3xl font-bold text-slate-800">
        👥 Gestión de usuarios
      </h1>

      <p className="mt-2 text-slate-500">
        Crear y administrar los usuarios de la aplicación.
      </p>


      {/* ALTA DE USUARIOS */}

      <Link
        href="/usuarios/alta"
        className="
          mt-6
          block
          rounded-2xl
          bg-slate-800
          py-3
          text-center
          font-semibold
          text-white
          shadow-md
          transition
          hover:bg-slate-700
          active:scale-[0.98]
        "
      >
        ➕ Alta de usuarios
      </Link>


      {/* BUSCADOR + LISTADO DE USUARIOS */}

      <GestionUsuarioCliente
        usuarios={usuarios || []}
      />


      {/* USUARIOS INACTIVOS */}

      <Link
        href="/usuarios/inactivos"
        className="
          mt-8
          block
          rounded-2xl
          bg-slate-700
          py-3
          text-center
          font-semibold
          text-white
          shadow-md
          transition
          hover:bg-slate-600
          active:scale-[0.98]
        "
      >
        🔒 Usuarios inactivos
      </Link>


      {/* NAVEGACIÓN */}

      <BottomNav />

    </main>
  );
}