"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function BottomNav() {
  const { usuario } = useUser();
  const pathname = usePathname();

  const [mostrarCalendarios, setMostrarCalendarios] = useState(false);
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [mostrarInfoUsuarios, setMostrarInfoUsuarios] = useState(false);

  const calendarioActivo =
    pathname.startsWith("/calendario");

  const estadisticasActivo =
    pathname.startsWith("/estadisticas");

  const adminActivo =
    pathname.startsWith("/usuarios");

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-200 bg-white px-1 py-2 shadow-lg">

        {/* INICIO */}

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


        {/* CALENDARIO */}

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




        {/* SOLICITUDES */}

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


        {/* ESTADÍSTICAS */}

        <button
          type="button"
          onClick={() => setMostrarEstadisticas(true)}
          className="flex-1"
        >
          <div
            className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
              estadisticasActivo
                ? "bg-slate-200 font-semibold text-slate-900"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="text-[10px]">Estadísticas</span>
          </div>
        </button>


        {/* ADMIN */}

        {usuario?.rol === "admin" && (
          <button
            type="button"
            onClick={() => setMostrarAdmin(true)}
            className="flex-1"
          >
            <div
              className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
                adminActivo
                  ? "bg-slate-200 font-semibold text-slate-900"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="text-xl">⚙️</span>
              <span className="text-[10px]">Admin</span>
            </div>
          </button>
        )}

      </nav>


      {/* =====================================================
          MODAL CALENDARIO
      ===================================================== */}

      {mostrarCalendarios && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setMostrarCalendarios(false)}
        >

          <div
            className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-6 text-center">

              <h2 className="text-2xl font-bold text-[#1a1a1a]">
                Calendario
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-500">
                Selecciona una opción
              </p>

            </div>


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
                  bg-slate-100
                  p-5
                  text-slate-900
                  shadow-md
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-slate-200
                  hover:shadow-lg
                  active:translate-y-0
                  active:scale-[0.98]
                "
              >

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

                <div className="min-w-0">

                  <p className="text-base font-bold text-slate-900">
                    Calendario Grupal
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Calendario de todo el equipo
                  </p>

                </div>

              </Link>


{/* EXCEL GRUPAL */}

<Link
  href="/calendario/excel"
  onClick={() => setMostrarCalendarios(false)}
  className="
    group
    flex
    items-center
    gap-4
    rounded-[18px]
    bg-slate-100
    p-5
    text-slate-900
    shadow-md
    transition-all
    duration-200
    hover:-translate-y-0.5
    hover:bg-slate-200
    hover:shadow-lg
    active:translate-y-0
    active:scale-[0.98]
  "
>

  {/* AQUÍ VA EL ICONO */}

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
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9h18"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 9v11"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 9v11"
      />
    </svg>
  </div>

  <div className="min-w-0">

    <p className="text-base font-bold text-slate-900">
      Excel Grupal
    </p>

    <p className="mt-1 text-sm text-slate-500">
      Antiguo Excel de trabajo
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
                  bg-slate-100
                  p-5
                  text-slate-900
                  shadow-md
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-slate-200
                  hover:shadow-lg
                  active:translate-y-0
                  active:scale-[0.98]
                "
              >

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

                <div className="min-w-0">

                  <p className="text-base font-bold text-slate-900">
                    Calendario Personal
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Solo tus permisos
                  </p>

                </div>

              </Link>

            </div>


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


      {/* =====================================================
          MODAL ESTADÍSTICAS
      ===================================================== */}

      {mostrarEstadisticas && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setMostrarEstadisticas(false)}
        >

          <div
            className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-6 text-center">

              <h2 className="text-2xl font-bold text-[#1a1a1a]">
                Estadísticas
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-500">
                Selecciona una opción
              </p>

            </div>


            <div className="space-y-4">

              {/* ESTADÍSTICAS GRUPALES */}

              <Link
                href="/estadisticas/grupales"
                onClick={() => setMostrarEstadisticas(false)}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-[18px]
                  bg-slate-100
                  p-5
                  text-slate-900
                  shadow-md
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-slate-200
                  hover:shadow-lg
                  active:translate-y-0
                  active:scale-[0.98]
                "
              >

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

                    <circle
                      cx="9"
                      cy="7"
                      r="4"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2 21a7 7 0 0 1 14 0"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11a4 4 0 1 0 0-8"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M22 21a6 6 0 0 0-5-5.91"
                    />

                  </svg>

                </div>

                <div className="min-w-0">

                  <p className="text-base font-bold text-slate-900">
                    Estadísticas Grupales
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Estadísticas de toda la plantilla
                  </p>

                </div>

              </Link>


              {/* ESTADÍSTICAS PERSONALES */}

              <Link
                href="/estadisticas/personal"
                onClick={() => setMostrarEstadisticas(false)}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-[18px]
                  bg-slate-100
                  p-5
                  text-slate-900
                  shadow-md
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-slate-200
                  hover:shadow-lg
                  active:translate-y-0
                  active:scale-[0.98]
                "
              >

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

                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 21a8 8 0 0 1 16 0"
                    />

                  </svg>

                </div>

                <div className="min-w-0">

                  <p className="text-base font-bold text-slate-900">
                    Estadísticas Personales
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Solo tus estadísticas
                  </p>

                </div>

              </Link>

            </div>


            <button
              type="button"
              onClick={() => setMostrarEstadisticas(false)}
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


      {/* =====================================================
          MODAL ADMINISTRACIÓN
      ===================================================== */}

      {mostrarAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setMostrarAdmin(false)}
        >

          <div
            className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-6 text-center">

              <h2 className="text-2xl font-bold text-[#1a1a1a]">
                Administración
              </h2>

              <p className="mt-1 text-sm font-normal text-slate-500">
                Selecciona una opción
              </p>

            </div>


            <div className="space-y-4">


              {/* GESTIÓN DE USUARIOS */}

              <div className="relative">

                <Link
                  href="/usuarios/gestion"
                  onClick={() => setMostrarAdmin(false)}
                  className="
                    group
                    flex
                    items-center
                    gap-4
                    rounded-[18px]
                    bg-slate-100
                    p-5
                    pr-14
                    text-slate-900
                    shadow-md
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-slate-200
                    hover:shadow-lg
                    active:translate-y-0
                    active:scale-[0.98]
                  "
                >

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

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                      />

                      <circle
                        cx="9"
                        cy="7"
                        r="4"
                      />

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


                  <div className="min-w-0">

                    <p className="text-base font-bold text-slate-900">
                      Gestión de usuarios
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Crear, eliminar, activar y desactivar usuarios.
                    </p>

                  </div>

                </Link>


                {/* INFORMACIÓN */}

                <button
                  type="button"
                  onClick={() => setMostrarInfoUsuarios(true)}
                  className="
                    absolute
                    right-3
                    top-3
                    z-10
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-100
                    text-sm
                    font-bold
                    text-blue-600
                    shadow-sm
                    transition
                    hover:bg-blue-200
                    active:scale-95
                  "
                  aria-label="Información sobre gestión de usuarios"
                >
                  ℹ️
                </button>

              </div>


              {/* CONFIGURACIÓN OCUPACIÓN */}

              <Link
                href="/usuarios/ocupacion"
                onClick={() => setMostrarAdmin(false)}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-[18px]
                  bg-slate-100
                  p-5
                  text-slate-900
                  shadow-md
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-slate-200
                  hover:shadow-lg
                  active:translate-y-0
                  active:scale-[0.98]
                "
              >

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
                  🎨
                </div>

                <div className="min-w-0">

                  <p className="text-base font-bold text-slate-900">
                    Configuración de ocupación
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Configurar colores y niveles del calendario.
                  </p>

                </div>

              </Link>


              {/* AVISOS */}

              <Link
                href="/usuarios/avisos"
                onClick={() => setMostrarAdmin(false)}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-[18px]
                  bg-slate-100
                  p-5
                  text-slate-900
                  shadow-md
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-slate-200
                  hover:shadow-lg
                  active:translate-y-0
                  active:scale-[0.98]
                "
              >

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
                  📢
                </div>

                <div className="min-w-0">

                  <p className="text-base font-bold text-slate-900">
                    Avisos
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Crear, modificar o eliminar el aviso visible para todos los usuarios.
                  </p>

                </div>

              </Link>

            </div>


            {/* CERRAR */}

            <button
              type="button"
              onClick={() => setMostrarAdmin(false)}
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


      {/* =====================================================
          INFORMACIÓN GESTIÓN DE USUARIOS
      ===================================================== */}

      {mostrarInfoUsuarios && (

        <div
          className="
            fixed
            inset-0
            z-[60]
            flex
            items-center
            justify-center
            bg-black/40
            p-6
          "
          onClick={() => setMostrarInfoUsuarios(false)}
        >

          <div
            className="
              w-full
              max-w-lg
              rounded-3xl
              bg-white
              p-6
              shadow-xl
            "
            onClick={(e) => e.stopPropagation()}
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-800
                "
              >
                👥 Gestión de usuarios
              </h2>

              <button
                type="button"
                onClick={() =>
                  setMostrarInfoUsuarios(false)
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-lg
                  text-slate-500
                  transition
                  hover:bg-slate-200
                "
                aria-label="Cerrar información"
              >
                ✕
              </button>

            </div>


            <div
              className="
                mt-5
                space-y-4
                text-sm
                leading-6
                text-slate-600
              "
            >

              <div>

                <p className="font-bold text-slate-800">
                  👤 Gestión de usuarios
                </p>

                <p className="mt-1">
                  Permite crear, modificar, activar y desactivar usuarios.
                </p>

              </div>


              <div>

                <p className="font-bold text-slate-800">
                  🔒 Usuarios inactivos
                </p>

                <p className="mt-1">
                  Los usuarios inactivos dejan de aparecer en los
                  permisos que consultan el resto de usuarios.
                  Se mantiene visible el permiso solicitado,
                  pero sin mostrar el nombre.
                </p>

              </div>


              <div>

                <p className="font-bold text-slate-800">
                  ⚠️ Eliminación
                </p>

                <p className="mt-1">
                  Para eliminar un usuario, primero debe estar
                  en Usuarios inactivos.
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                setMostrarInfoUsuarios(false)
              }
              className="
                mt-6
                w-full
                rounded-xl
                bg-slate-800
                py-3
                font-bold
                text-white
                transition
                hover:bg-slate-700
              "
            >
              Entendido
            </button>

          </div>

        </div>

      )}

    </>
  );
}