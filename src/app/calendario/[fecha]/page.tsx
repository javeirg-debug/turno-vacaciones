"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import {
  obtenerSolicitudesDia,
  eliminarSolicitud,
} from "@/services/solicitudes";
import { supabase } from "@/lib/supabase";
import { iconosPermisos } from "@/components/icons/Icons";

type IconProps = {
  className?: string;
};

/* =========================
   ICONOS DE TURNOS
========================= */

function IconSunrise({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill="#FACC15"
      />

      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSun({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 15a5 5 0 0 1 10 0"
        fill="#F97316"
      />

      <path
        d="M12 3v4M5.64 5.64l2.83 2.83M18.36 5.64l-2.83 2.83"
        stroke="#F97316"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M3 17h18"
        stroke="#64748B"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M6 20h12"
        stroke="#64748B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMoon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 15.5A8.5 8.5 0 0 1 8.5 4.2
           A8.5 8.5 0 1 0 20 15.5Z"
        fill="#1E3A8A"
        stroke="#172554"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <circle
        cx="7"
        cy="8"
        r="0.8"
        fill="#93C5FD"
      />
    </svg>
  );
}

function IconFree({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="white"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
    </svg>
  );
}


/* =========================
   CÁLCULO DE TURNOS
========================= */

const inicioTurno = new Date(2026, 6, 16);

function obtenerTurno(fechaTexto: string) {
  const fecha = new Date(fechaTexto);

  const diferencia = Math.floor(
    (fecha.getTime() - inicioTurno.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const ciclo = ((diferencia % 12) + 12) % 12;

  const turnos = [
    { texto: "Mañana", icono: "sunrise" },
    { texto: "Mañana", icono: "sunrise" },

    { texto: "Tarde", icono: "sun" },
    { texto: "Tarde", icono: "sun" },

    { texto: "Noche", icono: "moon" },
    { texto: "Noche", icono: "moon" },

    { texto: "Libre", icono: "free" },
    { texto: "Libre", icono: "free" },
    { texto: "Libre", icono: "free" },
    { texto: "Libre", icono: "free" },
    { texto: "Libre", icono: "free" },
    { texto: "Libre", icono: "free" },
  ];

  return turnos[ciclo];
}

type Solicitud = {
  id: string;
  usuario_id: string;
  nombre: string;
  sexo: string;
  avatar_url: string | null;
  categoria: string | null;
  puesto: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
  estado: string;
  activo: boolean
  created_at: string;
};

function formatearFecha(fecha: string) {
  return new Date(fecha + "Z").toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatearFechaGrande(fecha: string) {
  return new Date(fecha + "T00:00:00").toLocaleDateString(
    "es-ES",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

/* =========================
   CONFIGURACIÓN VISUAL
========================= */

function obtenerVisual(tipo: string) {
  const icono =
    iconosPermisos[
      tipo as keyof typeof iconosPermisos
    ];

  switch (tipo) {
    case "Vacaciones":
      return {
        icono,
        abreviatura: "VAC",
        color: "bg-teal-500",
      };

    case "Asunto propio":
      return {
        icono,
        abreviatura: "AP",
        color: "bg-sky-500",
      };

    case "Compensación horaria":
      return {
        icono,
        abreviatura: "CH",
        color: "bg-slate-600",
      };

    case "Indisposición":
      return {
        icono,
        abreviatura: "IND",
        color: "bg-red-500",
      };

    case "Navidad":
      return {
        icono,
        abreviatura: "NAV",
        color: "bg-indigo-500",
      };

    case "Semana Santa":
      return {
        icono,
        abreviatura: "SS",
        color: "bg-violet-500",
      };

    case "Paternidad":
      return {
        icono,
        abreviatura: "PAT",
        color: "bg-blue-500",
      };

    case "Maternidad":
      return {
        icono,
        abreviatura: "MAT",
        color: "bg-pink-500",
      };

    case "Lactancia":
      return {
        icono,
        abreviatura: "LAC",
        color: "bg-amber-500",
      };

    case "Otros permisos":
      return {
        icono,
        abreviatura: "OT",
        color: "bg-fuchsia-500",
      };

    case "Permiso urgente":
      return {
        icono,
        abreviatura: "URG",
        color: "bg-orange-500",
      };

    default:
      return {
        icono: iconosPermisos["Otros permisos"],
        abreviatura: "OT",
        color: "bg-slate-500",
      };
  }
}

function obtenerCategoria(categoria: string | null) {
  if (categoria === "oficial") {
    return (
      <div className="flex items-center gap-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 text-amber-500"
          aria-hidden="true"
        >
          <path d="m12 3 2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7L12 3Z" />
        </svg>

        <span>Oficial de Policía</span>
      </div>
    );
  }

  if (categoria === "policia") {
    return (
      <div className="flex items-center gap-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Z" />
          <path d="M9 11h6" />
          <path d="M12 8v6" />
        </svg>

        <span>Policía</span>
      </div>
    );
  }

  return <span>--</span>;
}


/* =========================
   PÁGINA
========================= */

export default function DiaCalendario() {
  const params = useParams();
  const router = useRouter();

  const fecha = params.fecha as string;

  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [miUsuarioId, setMiUsuarioId] =
    useState("");

    const [fotoAmpliada, setFotoAmpliada] =
  useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setMiUsuarioId(user.id);
        }

        const datos =
          await obtenerSolicitudesDia(fecha);

        setSolicitudes(datos || []);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [fecha]);

  async function borrar(id: string) {
    if (!confirm("¿Eliminar esta solicitud?")) {
      return;
    }

    try {
      await eliminarSolicitud(id);

      setSolicitudes((prev) =>
        prev.filter(
          (solicitud) =>
            solicitud.id !== id
        )
      );
    } catch {
      alert(
        "No se pudo eliminar la solicitud."
      );
    }
  }

  const turnoHoy = obtenerTurno(fecha);

  return (
    <main
      className="
        min-h-screen
        bg-slate-100
        px-4
        pb-28
        pt-5
      "
    >

      {/* =========================
          CABECERA
      ========================= */}

      <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-7 w-7 shrink-0"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z"
          />
        </svg>

        Calendario
      </h1>

      <p className="mt-2 text-slate-500">
        Consulta los turnos y permisos del personal.
      </p>

      {/* =========================
          TARJETA TURNO
      ========================= */}

      <div
  className="
    mt-1
    overflow-hidden
    rounded-3xl
    bg-white
    shadow-md
  "
>

        {/* FECHA */}

        <div
          className="
            bg-slate-200
            px-5
            py-3
            text-center
          "
        >
          <p
            className="
              text-lg
              font-bold
              capitalize
              text-slate-700
            "
          >
            {formatearFechaGrande(fecha)}
          </p>
        </div>

        {/* LÍNEA DIVISORIA */}

        <div className="border-t border-slate-200" />

 {/* INFORMACIÓN TURNO */}

        <div
          className="
            flex
            items-center
            justify-center
            px-5
            py-5
            text-center
          "
        >

          <div className="flex items-center justify-center gap-3">

            <p
              className="
                text-2xl
                font-bold
                text-slate-800
              "
            >
              {turnoHoy.texto === "Libre"
                ? "Día Libre"
                : `Turno de ${turnoHoy.texto}`}
            </p>

            {turnoHoy.icono === "sunrise" && (
              <IconSunrise className="h-9 w-9 shrink-0" />
            )}

            {turnoHoy.icono === "sun" && (
              <IconSun className="h-9 w-9 shrink-0" />
            )}

            {turnoHoy.icono === "moon" && (
              <IconMoon className="h-9 w-9 shrink-0" />
            )}

            {turnoHoy.icono === "free" && (
              <IconFree className="h-9 w-9 shrink-0" />
            )}

          </div>

        </div>

      </div>

      {/* =========================
          PERSONAL DE PERMISO
      ========================= */}

      <div
        className="
          mt-7
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-md
        "
      >

        {/* CABECERA PERSONAL */}

        <div
          className="
            relative
            flex
            items-center
            justify-between
            bg-slate-200
            px-4
            py-3
          "
        >

          <h2
            className="
              absolute
              left-1/2
              -translate-x-1/2
              text-lg
              font-bold
              text-slate-800
            "
          >
            Personal de permiso
          </h2>

          {!cargando &&
            solicitudes.length > 0 && (

              <div
                className="
                  ml-auto
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-500
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                "
              >
                {solicitudes.length}
              </div>

            )}

        </div>


        {/* LÍNEA DIVISORIA COMPLETA */}

        <div className="border-t-2 border-slate-200" />


        {/* CONTENIDO */}

        <div className="px-3 py-3">

          {cargando && (

            <div
              className="
                px-1
                py-4
                text-sm
                text-slate-500
              "
            >
              Cargando personal...
            </div>

          )}


          {!cargando &&
            solicitudes.length === 0 && (

              <div
                className="
                  px-2
                  py-7
                  text-center
                "
              >

                <div className="flex justify-center text-slate-400">
  {/* ICONO SIN SOLICITUDES */}
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-7 w-7"
    aria-hidden="true"
  >
    <path
      d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H15L13 20H11L9 17H5.5C4.67 17 4 16.33 4 15.5V5.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M8 9H16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M8 12H13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
</div>

                <p
                  className="
                    mt-2
                    text-sm
                    font-semibold
                    text-slate-600
                  "
                >
                  No hay solicitudes
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-400
                  "
                >
                  Nadie tiene un permiso registrado
                  para este día.
                </p>

              </div>

            )}


          {/* TARJETAS */}

          {!cargando &&
            solicitudes.length > 0 && (

              <div className="space-y-4">

                {solicitudes.map(
                  (solicitud) => {

                    const visual =
                      obtenerVisual(
                        solicitud.tipo
                      );

                    /* IMPORTANTE:
                       El icono es un COMPONENTE,
                       por eso hay que guardarlo
                       en una variable que empiece
                       por mayúscula.
                    */

                    const IconoPermiso =
                      visual.icono;

                    return (

                      <div
                        key={solicitud.id}
                        className="
                          overflow-hidden
                          rounded-3xl
                          border
                          border-slate-200
                          bg-white
                          shadow-md
                        "
                      >

                        {/* =====================
                            PARTE SUPERIOR
                        ====================== */}

                        <div
                          className={`
                            px-4
                            py-4
                            ${
                              solicitud.sexo ===
                              "mujer"
                                ? "bg-pink-50"
                                : "bg-blue-50"
                            }
                          `}
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-3
                            "
                          >

{/* AVATAR + NOMBRE */}

<div className="flex min-w-0 flex-1 items-center gap-2.5">

  {solicitud.activo ? (
    <>
      {/* USUARIO ACTIVO */}

      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-1 ring-slate-300">

        {solicitud.avatar_url ? (
          <button
            type="button"
            onClick={() =>
              setFotoAmpliada(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${solicitud.avatar_url}`
              )
            }
            className="h-full w-full cursor-pointer"
            aria-label={`Ampliar foto de ${solicitud.nombre}`}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${solicitud.avatar_url}`}
              alt={`Foto de ${solicitud.nombre}`}
              className="h-full w-full object-cover transition hover:scale-105"
            />
          </button>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-slate-400"
              aria-hidden="true"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </div>
        )}

      </div>

      <p
        className="
          min-w-0
          truncate
          text-base
          font-bold
          text-slate-800
        "
      >
        {solicitud.nombre}
      </p>
    </>
  ) : (
    <>
      {/* USUARIO INACTIVO */}

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-slate-300
          text-slate-600
          ring-1
          ring-slate-400
        "
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <rect
            x="5"
            y="10"
            width="14"
            height="10"
            rx="2"
          />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </div>

      <p
        className="
          min-w-0
          truncate
          text-base
          font-bold
          text-slate-500
        "
      >
        Usuario inactivo
      </p>
    </>
  )}

</div>
                            {/* CATEGORÍA + PUESTO */}

                            <div
                              className="
                                shrink-0
                                text-right
                              "
                            >

                              <p
                                className="
                                  text-xs
                                  font-semibold
                                  text-slate-500
                                "
                              >
                                {obtenerCategoria(solicitud.categoria)}

                              </p>

<div
  className="
    mt-1
    flex
    items-center
    justify-end
    gap-1.5
    text-xs
    font-semibold
    text-slate-500
  "
>
  {solicitud.puesto === "gac" && (
    <>
      {/* ICONO COCHE - G.A.C */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M5 17h14l-1-7H6Z" />
        <path d="M7 10 9 5h6l2 5" />
        <circle cx="8" cy="17" r="1.5" />
        <circle cx="16" cy="17" r="1.5" />
      </svg>

      <span>G.A.C</span>
    </>
  )}

  {solicitud.puesto === "seguridad" && (
    <>
      {/* ICONO ESCUDO - SEGURIDAD */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Z" />
      </svg>

      <span>Seguridad</span>
    </>
  )}

  {solicitud.puesto === "sala" && (
    <>
      {/* ICONO MONITOR - SALA */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>

      <span>Sala</span>
    </>
  )}

  {!["gac", "seguridad", "sala"].includes(
    solicitud.puesto
  ) && (
    <span>—</span>
  )}
</div>

                            </div>

                          </div>

                        </div>


                        {/* =====================
                            PARTE INFERIOR
                        ====================== */}

                        <div
                          className="
                            relative
                            px-4
                            py-4
                          "
                        >

                          <div
                            className="
                              ml-[68px]
                              mr-[52px]
                            "
                          >

                            {/* TIPO DE PERMISO */}

                            <p
                              className="
                                flex
                                items-center
                                gap-2
                                text-base
                                font-bold
                                leading-tight
                                text-slate-800
                              "
                            >

                              <IconoPermiso
                                className="
                                  h-5
                                  w-5
                                  shrink-0
                                  text-slate-700
                                "
                              />

                              {solicitud.tipo}

                            </p>


                            {/* FECHA */}

                          
<p
  className="
    mt-3
    flex
    items-center
    gap-1.5
    text-sm
    font-bold
    text-slate-700
  "
>
<svg
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 shrink-0"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="16"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M3 10H21"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 3V7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 3V7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8 15H8.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12 15H12.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 15H16.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

  {new Date(
    solicitud.fecha_inicio
  ).toLocaleDateString(
    "es-ES",
    {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }
  )}

  {solicitud.fecha_inicio !==
    solicitud.fecha_fin && (
    <>
      {" → "}

      {new Date(
        solicitud.fecha_fin
      ).toLocaleDateString(
        "es-ES",
        {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }
      )}
    </>
  )}
</p>

                            {/* OBSERVACIÓN */}

                            {solicitud.motivo && (

                              <p
                                className="
                                  mt-2
                                  text-xs
                                  italic
                                  leading-5
                                  text-slate-500
                                "
                              >
                                Observaciones:{" "}
                                {solicitud.motivo}
                              </p>

                            )}


                            {/* REGISTRO */}

                            <p
                              className="
                                mt-3
                                text-xs
                                text-slate-400
                              "
                            >
                              <span className="inline-flex items-center gap-1.5">
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 shrink-0"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="8.5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 7.5V12L15 14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

  {formatearFecha(solicitud.created_at)}
</span>
                            </p>

                          </div>


                          {/* CÍRCULO */}

                          <div
                            className={`
                              absolute
                              left-4
                              top-1/2
                              flex
                              h-14
                              w-14
                              -translate-y-1/2
                              items-center
                              justify-center
                              rounded-full
                              ${visual.color}
                              text-[11px]
                              font-extrabold
                              text-white
                              shadow-sm
                            `}
                          >
                            {visual.abreviatura}
                          </div>


{/* PAPELERA */}

{solicitud.usuario_id === miUsuarioId && (
  <button
    type="button"
    onClick={() => borrar(solicitud.id)}
    className="
      absolute
      bottom-4
      right-4
      flex
      h-10
      w-10
      shrink-0
      items-center
      justify-center
      rounded-full
      bg-red-100
      text-red-600
      transition
      hover:bg-red-200
      active:scale-95
    "
    aria-label="Eliminar solicitud"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6h18"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 6V4h8v2"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 6l-1 14H6L5 6"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 11v5m4-5v5"
      />
    </svg>
  </button>
)}

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

        </div>

      </div>


      {/* =========================
          SOLICITAR PERMISO
      ========================= */}

<button
  type="button"
  onClick={() =>
    router.push(`/solicitudes/nueva?fecha=${fecha}`)
  }
  className="
    mt-7
    flex
    w-full
    items-center
    justify-center
    gap-2
    rounded-2xl
    bg-slate-800
    py-3.5
    font-bold
    text-white
    shadow-md
    transition
    hover:bg-slate-700
    active:scale-[0.98]
  "
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path
      d="M6 4H14L18 8V20H6V4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M14 4V8H18"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M9 16L15.5 9.5L17.5 11.5L11 18H9V16Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>

  Solicitar permiso
</button>

{fotoAmpliada && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
    onClick={() => setFotoAmpliada(null)}
  >
    <div
      className="relative flex max-h-[90vh] max-w-[95vw] items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={fotoAmpliada}
        alt="Foto ampliada"
        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
      />

      <button
        type="button"
        onClick={() => setFotoAmpliada(null)}
        className="
          absolute
          right-2
          top-2
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-black/60
          text-2xl
          text-white
          shadow-lg
          transition
          hover:bg-black/80
          active:scale-95
        "
        aria-label="Cerrar foto"
      >
        ×
      </button>
    </div>
  </div>
)}

<BottomNav />


    </main>
  );
}