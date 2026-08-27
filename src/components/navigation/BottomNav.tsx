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

  const calendarioActivo = pathname.startsWith("/calendario");
  const estadisticasActivo = pathname.startsWith("/estadisticas");
  const adminActivo = pathname.startsWith("/usuarios");

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
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10.5 12 3l9 7.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 9.5V21h14V9.5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 21v-6h6v6"
              />
            </svg>

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
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="4.5"
                width="18"
                height="17"
                rx="2"
              />
              <path
                strokeLinecap="round"
                d="M16 2.5v4M8 2.5v4M3 9.5h18"
              />
            </svg>

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
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 3.5h9l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 3.5V8h5"
              />
              <path
                strokeLinecap="round"
                d="M8 12h8M8 16h6"
              />
            </svg>

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
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 20V10"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 20V4"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 20v-7"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 20H2"
              />
            </svg>

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
             <svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.8"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="h-6 w-6"
  aria-hidden="true"
>
  <path d="M12 3.5v2" />
  <path d="M12 18.5v2" />
  <path d="M3.5 12h2" />
  <path d="M18.5 12h2" />

  <path d="m6 6 1.4 1.4" />
  <path d="m16.6 16.6 1.4 1.4" />
  <path d="m18 6-1.4 1.4" />
  <path d="m7.4 16.6L6 18" />

  <circle cx="12" cy="12" r="6" />
  <circle cx="12" cy="12" r="2.5" />
</svg>

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
                className="group flex items-center gap-4 rounded-[18px] bg-slate-100 p-5 text-slate-900 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-7 w-7"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="7" r="3.5" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 20a6 6 0 0 1 12 0"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11a3.5 3.5 0 1 0 0-7"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 14a5 5 0 0 1 3 6"
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
                className="group flex items-center gap-4 rounded-[18px] bg-slate-100 p-5 text-slate-900 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-7 w-7"
                    aria-hidden="true"
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
                      d="M3 9h18M8 9v11M13 9v11"
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
                className="group flex items-center gap-4 rounded-[18px] bg-slate-100 p-5 text-slate-900 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-7 w-7"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="3.5" />
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
              className="mt-5 w-full rounded-xl py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
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
                className="group flex items-center gap-4 rounded-[18px] bg-slate-100 p-5 text-slate-900 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-7 w-7"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="7" r="3.5" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.5 21a6.5 6.5 0 0 1 13 0"
                    />
                    <circle cx="17" cy="8" r="3" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 15a5.5 5.5 0 0 1 6.5 6"
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
                className="group flex items-center gap-4 rounded-[18px] bg-slate-100 p-5 text-slate-900 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-7 w-7"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="3.5" />
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
              className="mt-5 w-full rounded-xl py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
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
                  className="group flex items-center gap-4 rounded-[18px] bg-slate-100 p-5 pr-14 text-slate-900 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.8"
  className="h-7 w-7"
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
  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 shadow-sm transition hover:bg-slate-200 active:scale-95"
  aria-label="Información sobre gestión de usuarios"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="#94A3B8"
    />

    <path
      stroke="#64748B"
      strokeLinecap="round"
      d="M12 10.5v6"
    />

    <circle
      cx="12"
      cy="7"
      r=".8"
      fill="#64748B"
      stroke="none"
    />
  </svg>
</button>
              </div>

              {/* CONFIGURACIÓN OCUPACIÓN */}
              <Link
                href="/usuarios/ocupacion"
                onClick={() => setMostrarAdmin(false)}
                className="group flex items-center gap-4 rounded-[18px] bg-slate-100 p-5 text-slate-900 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="1.8"
  className="h-7 w-7"
  aria-hidden="true"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 3.5C7.3 3.5 3.5 7.2 3.5 12c0 4.7 3.5 8.5 8.2 8.5 1.2 0 2.1-.9 2.1-2.1 0-.7-.3-1.2-.8-1.7-.4-.4-.2-1 .4-1h2.1c3 0 5-2 5-4.8 0-4.2-3.8-7.4-8.5-7.4Z"
  />
  <circle cx="8" cy="10" r="1" />
  <circle cx="11" cy="7.5" r="1" />
  <circle cx="15" cy="7.5" r="1" />
  <circle cx="17.5" cy="10.5" r="1" />
</svg>
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
                className="group flex items-center gap-4 rounded-[18px] bg-slate-100 p-5 text-slate-900 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-200 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-7 w-7"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 17h16l-1.5-2.5V10a6.5 6.5 0 0 0-13 0v4.5L4 17Z"
                    />
                    <path
                      strokeLinecap="round"
                      d="M9.5 20h5"
                    />
                  </svg>
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
              className="mt-5 w-full rounded-xl py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6"
          onClick={() => setMostrarInfoUsuarios(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="7" r="3.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 20a6 6 0 0 1 12 0"
                  />
                  <circle cx="17" cy="8" r="3" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 15a5 5 0 0 1 6 5"
                  />
                </svg>

                Gestión de usuarios
              </h2>

              <button
                type="button"
                onClick={() => setMostrarInfoUsuarios(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Cerrar información"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    d="M6 6l12 12M18 6 6 18"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">

              <div>
                <p className="flex items-center gap-2 font-bold text-slate-800">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="3.5" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 21a8 8 0 0 1 16 0"
                    />
                  </svg>

                  Gestión de usuarios
                </p>

                <p className="mt-1">
                  Permite crear, modificar, activar y desactivar usuarios.
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 font-bold text-slate-800">
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
                </p>

                <p className="mt-1">
                  Los usuarios inactivos dejan de aparecer en los
                  permisos que consultan el resto de usuarios.
                  Se mantiene visible el permiso solicitado,
                  pero sin mostrar el nombre.
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 font-bold text-slate-800">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3 21 19H3L12 3Z"
                    />
                    <path
                      strokeLinecap="round"
                      d="M12 9v4"
                    />
                    <circle
                      cx="12"
                      cy="16.5"
                      r=".8"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>

                  Eliminación
                </p>

                <p className="mt-1">
                  Para eliminar un usuario, primero debe estar
                  en Usuarios inactivos.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMostrarInfoUsuarios(false)}
              className="mt-6 w-full rounded-xl bg-slate-800 py-3 font-bold text-white transition hover:bg-slate-700"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}