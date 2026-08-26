"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function BottomNav() {
  const { usuario } = useUser();
  const pathname = usePathname();

  const [mostrarCalendarios, setMostrarCalendarios] = useState(false);

  const calendarioActivo = pathname.startsWith("/calendario");

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-200 bg-white px-1 py-2 shadow-lg">

        <Link href="/inicio" className="flex-1">
          <div
            className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
              pathname === "/inicio"
                ? "bg-slate-200 font-semibold text-slate-900"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-[10px]">Inicio</span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMostrarCalendarios(true)}
          className="flex-1"
        >
          <div
            className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
              calendarioActivo
                ? "bg-slate-200 font-semibold text-slate-900"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="text-xl">📅</span>
            <span className="text-[10px]">Calendario</span>
          </div>
        </button>

        <Link href="/tabla" className="flex-1">
          <div
            className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
              pathname.startsWith("/tabla")
                ? "bg-slate-200 font-semibold text-slate-900"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="text-xl">🧮</span>
            <span className="text-[10px]">Excel</span>
          </div>
        </Link>

        <Link href="/solicitudes" className="flex-1">
          <div
            className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
              pathname.startsWith("/solicitudes")
                ? "bg-slate-200 font-semibold text-slate-900"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="text-xl">📝</span>
            <span className="text-[10px]">Solicitudes</span>
          </div>
        </Link>

        <Link href="/estadisticas" className="flex-1">
          <div
            className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
              pathname.startsWith("/estadisticas")
                ? "bg-slate-200 font-semibold text-slate-900"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="text-[10px]">Estadísticas</span>
          </div>
        </Link>

        {usuario?.rol === "admin" && (
          <Link href="/usuarios" className="flex-1">
            <div
              className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
                pathname.startsWith("/usuarios")
                  ? "bg-slate-200 font-semibold text-slate-900"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="text-xl">⚙️</span>
              <span className="text-[10px]">Admin</span>
            </div>
          </Link>
        )}
      </nav>

      {mostrarCalendarios && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    onClick={() => setMostrarCalendarios(false)}
  >
    <div
      className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >

      {/* CABECERA */}

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">
          Calendario
        </h2>

        <p className="mt-1 text-sm font-normal text-slate-500">
          Selecciona una opción
        </p>
      </div>


      {/* OPCIONES */}

      <div className="space-y-4">

        {/* CALENDARIO GRUPAL */}

        <Link
          href="/calendario"
          onClick={() => setMostrarCalendarios(false)}
          className="
            group
            flex
            items-center
            gap-4
            rounded-[18px]
            bg-gradient-to-r
            from-blue-500
            to-indigo-500
            p-5
            text-white
            shadow-lg
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:shadow-xl
            active:translate-y-0
            active:scale-[0.98]
          "
        >

          {/* ICONO GRUPO */}

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-white/15
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-7 w-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
              />
              <circle cx="9" cy="7" r="4" />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 21v-2a4 4 0 0 0-3-3.87"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 3.13a4 4 0 0 1 0 7.75"
              />
            </svg>
          </div>


          {/* TEXTO */}

          <div className="min-w-0">
            <p className="text-base font-bold">
              Calendario Grupal
            </p>

            <p className="mt-1 text-sm text-white/75">
              Calendario de todo el equipo
            </p>
          </div>

        </Link>


        {/* CALENDARIO PERSONAL */}

        <Link
          href="/calendario/mio"
          onClick={() => setMostrarCalendarios(false)}
          className="
            group
            flex
            items-center
            gap-4
            rounded-[18px]
            bg-[#f5f3ff]
            p-5
            text-slate-900
            shadow-md
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:bg-[#ede9fe]
            hover:shadow-lg
            active:translate-y-0
            active:scale-[0.98]
          "
        >

          {/* ICONO PERSONA */}

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-white
              shadow-sm
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-7 w-7"
            >
              <circle cx="12" cy="8" r="4" />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 21a8 8 0 0 1 16 0"
              />
            </svg>
          </div>


          {/* TEXTO */}

          <div className="min-w-0">
            <p className="text-base font-bold">
              Calendario Personal
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Solo tus permisos
            </p>
          </div>

        </Link>

      </div>


      {/* CERRAR */}

      <button
        type="button"
        onClick={() => setMostrarCalendarios(false)}
        className="
          mt-5
          w-full
          rounded-xl
          py-2
          text-sm
          font-medium
          text-slate-400
          transition
          hover:bg-slate-50
          hover:text-slate-600
        "
      >
        Cancelar
      </button>

    </div>
  </div>
)}
    </>
  );
}