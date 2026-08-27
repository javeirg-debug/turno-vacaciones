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

      <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <circle cx="9" cy="8" r="3.5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 20a6 6 0 0 1 12 0"
          />
          <circle cx="17" cy="9" r="2.5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 15a5 5 0 0 1 6 5"
          />
        </svg>

        Gestión de usuarios
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
        <span className="flex items-center justify-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <circle cx="9" cy="8" r="3.5" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 20a6 6 0 0 1 12 0"
            />
            <path
              strokeLinecap="round"
              d="M18 11v6M15 14h6"
            />
          </svg>

          Alta de usuarios
        </span>
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
        <span className="flex items-center justify-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <rect
              x="5"
              y="10"
              width="14"
              height="10"
              rx="2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10V7a4 4 0 0 1 8 0v3"
            />
          </svg>

          Usuarios inactivos
        </span>
      </Link>


      {/* NAVEGACIÓN */}

      <BottomNav />

    </main>
  );
}