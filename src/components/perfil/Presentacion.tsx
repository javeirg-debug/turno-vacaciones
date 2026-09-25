"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { obtenerConflictosUsuario } from "@/services/conflictos";
import { iconosPermisos } from "@/components/icons/Icons";
import Avatar from "@/components/perfil/Avatar";

type IconProps = {
  className?: string;
};

function SvgIcon({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function IconCalendar({
  className,
}: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
      />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </SvgIcon>
  );
}

function IconSunrise({
  className,
}: IconProps) {
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

function IconSun({
  className,
}: IconProps) {
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

function IconMoon({
  className,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 15.5A8.5 8.5 0 0 1 8.5 4.2 A8.5 8.5 0 1 0 20 15.5Z"
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

function IconFree({
  className,
}: IconProps) {
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

function IconWeather({
  className,
  codigo,
}: IconProps & {
  codigo: number | null;
}) {
  if (codigo === null) {
    return null;
  }

  if (codigo === 0) {
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

  if (
    codigo >= 1 &&
    codigo <= 3
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <circle
          cx="8"
          cy="8"
          r="3.5"
          fill="#FACC15"
        />

        <path
          d="M8 3v1.5M3 8h1.5M4.5 4.5l1 1"
          stroke="#FACC15"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        <path
          d="M7 18h10.5a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.5 1.5A3 3 0 0 0 7 18Z"
          fill="#CBD5E1"
          stroke="#94A3B8"
          strokeWidth="1.4"
        />
      </svg>
    );
  }

  if (
    codigo >= 45 &&
    codigo <= 48
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M4 9h16M3 13h18M5 17h14"
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (
    (codigo >= 51 &&
      codigo <= 67) ||
    (codigo >= 80 &&
      codigo <= 82)
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M7 14h10.5a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.5 1.5A3 3 0 0 0 7 14Z"
          fill="#CBD5E1"
          stroke="#64748B"
          strokeWidth="1.4"
        />

        <path
          d="M8 17l-1 2M12 17l-1 2M16 17l-1 2"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (
    codigo >= 71 &&
    codigo <= 77
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M7 14h10.5a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.5 1.5A3 3 0 0 0 7 14Z"
          fill="#E2E8F0"
          stroke="#94A3B8"
          strokeWidth="1.4"
        />

        <path
          d="M8 18h.01M12 18h.01M16 18h.01"
          stroke="#38BDF8"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (codigo >= 95) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M7 13h10.5a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.5 1.5A3 3 0 0 0 7 13Z"
          fill="#64748B"
          stroke="#475569"
          strokeWidth="1.4"
        />

        <path
          d="m13 12-3 5h3l-1 4 4-6h-3l2-3Z"
          fill="#FACC15"
          stroke="#EAB308"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

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
        d="M12 2v3M12 19v3M2 12h3M19 12h3"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const inicioTurno = new Date(
  2026,
  6,
  16
);

function obtenerTurnoHoy() {
  const hoy = new Date();

  const diferencia = Math.floor(
    (hoy.getTime() -
      inicioTurno.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const ciclo =
    ((diferencia % 12) + 12) % 12;

  const turnos = [
    {
      texto: "Mañana",
      icono: "sunrise",
    },
    {
      texto: "Mañana",
      icono: "sunrise",
    },
    {
      texto: "Tarde",
      icono: "sun",
    },
    {
      texto: "Tarde",
      icono: "sun",
    },
    {
      texto: "Noche",
      icono: "moon",
    },
    {
      texto: "Noche",
      icono: "moon",
    },
    {
      texto: "Libre",
      icono: "free",
    },
    {
      texto: "Libre",
      icono: "free",
    },
    {
      texto: "Libre",
      icono: "free",
    },
    {
      texto: "Libre",
      icono: "free",
    },
    {
      texto: "Libre",
      icono: "free",
    },
    {
      texto: "Libre",
      icono: "free",
    },
  ];

  return turnos[ciclo];
}

type Usuario = {
  id: string;
  nombre: string;
  rol: string;
  sexo: string;
  categoria: string | null;
  puesto: string;
  avatar_url: string | null;
  indicativo: string | null;
};

type Solicitud = {
  id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
};

type FechaConflictiva = {
  fecha: string;
  gac: number;
  seguridad: number;
  sala: number;
};

function obtenerPermisoHoy(
  solicitudes: Solicitud[]
) {
  const hoy =
    new Date().toLocaleDateString(
      "sv-SE",
      {
        timeZone: "Europe/Madrid",
      }
    );

  return solicitudes.find(
    (solicitud) => {
      return (
        solicitud.fecha_inicio <= hoy &&
        solicitud.fecha_fin >= hoy
      );
    }
  );
}

export default function Presentacion() {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>([]);

  const [
    fechasConflictivas,
    setFechasConflictivas,
  ] = useState<
    FechaConflictiva[] | null
  >(null);

  const [cargando, setCargando] =
    useState(true);

  const [horaActual, setHoraActual] =
    useState("");

  const [tiempo, setTiempo] =
    useState({
      temperatura:
        null as number | null,
      maxima:
        null as number | null,
      minima:
        null as number | null,
      codigo:
        null as number | null,
    });

  useEffect(() => {
    function actualizarHora() {
      const ahora = new Date();

      setHoraActual(
        ahora.toLocaleTimeString(
          "es-ES",
          {
            timeZone:
              "Europe/Madrid",
            hour: "2-digit",
            minute: "2-digit",
          }
        )
      );
    }

    actualizarHora();

    const intervalo =
      setInterval(
        actualizarHora,
        1000
      );

    return () =>
      clearInterval(
        intervalo
      );
  }, []);

  useEffect(() => {
    async function cargar() {
      try {
        const respuestaTiempo =
          await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=40.4233&longitude=-3.5613&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FMadrid"
          );

        if (respuestaTiempo.ok) {
          const datosTiempo =
            await respuestaTiempo.json();

          setTiempo({
            temperatura:
              Math.round(
                datosTiempo
                  .current
                  .temperature_2m
              ),
            maxima:
              Math.round(
                datosTiempo
                  .daily
                  .temperature_2m_max[0]
              ),
            minima:
              Math.round(
                datosTiempo
                  .daily
                  .temperature_2m_min[0]
              ),
            codigo:
              datosTiempo
                .current
                .weather_code,
          });
        }

        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser();

        if (!user) {
          router.replace(
            "/login"
          );
          return;
        }

        const {
          data: perfil,
        } =
          await supabase
            .from("usuarios")
            .select(
              "id,nombre,rol,sexo,categoria,puesto,avatar_url,indicativo"
            )
            .eq(
              "id",
              user.id
            )
            .single();

        setUsuario(perfil);

        const hoy =
          new Date()
            .toISOString()
            .split("T")[0];

        const { data } =
          await supabase
            .from("vacaciones")
            .select(
              "id,tipo,fecha_inicio,fecha_fin,motivo"
            )
            .eq(
              "usuario_id",
              user.id
            )
            .gte(
              "fecha_fin",
              hoy
            )
            .order(
              "fecha_inicio"
            );

        setSolicitudes(
          data || []
        );

        const conflictos =
          await obtenerConflictosUsuario(
            user.id
          );

        setFechasConflictivas(
          conflictos
        );
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [router]);

  if (cargando) {
    return (
      <div className="mx-auto mt-4 w-full max-w-xl rounded-3xl bg-white p-5 shadow-lg">
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-slate-500">
            Cargando...
          </div>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  const turnoHoy =
    obtenerTurnoHoy();

  const permisoHoy =
    obtenerPermisoHoy(
      solicitudes
    );

  return (
    <div className="mx-auto mt-4 w-full max-w-xl rounded-3xl bg-white p-5 shadow-lg">

      {/* =========================
          HORA Y TIEMPO
      ========================= */}

      <div className="flex items-start justify-between">

        <div className="text-left">

          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Madrid
          </div>

          <div className="mt-1 text-3xl font-bold leading-none text-slate-800">
            {horaActual}
          </div>

        </div>

        <div className="text-right">

          <div className="flex items-center justify-end gap-1.5">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Coslada
            </p>

            <IconWeather
              codigo={
                tiempo.codigo
              }
              className="h-6 w-6"
            />

          </div>

          <div className="mt-1 flex items-baseline justify-end gap-1.5">

            <span className="text-2xl font-bold leading-tight text-slate-800">
              {tiempo.temperatura !==
              null
                ? `${tiempo.temperatura}°C`
                : "--"}
            </span>

            <span className="text-xs font-medium text-slate-500">
              · Máx.{" "}
              {tiempo.maxima ??
                "--"}° · Mín.{" "}
              {tiempo.minima ??
                "--"}°
            </span>

          </div>

        </div>

      </div>

      {/* =========================
          SEPARADOR
      ========================= */}

      <div className="my-4 h-px bg-slate-100" />

      {/* =========================
          PERFIL
      ========================= */}

      <div className="relative">

        <div className="flex items-center gap-4">

          {/* AVATAR */}

          <div className="relative shrink-0">
            <Avatar
              usuarioId={
                usuario.id
              }
              avatarUrl={
                usuario.avatar_url
              }
            />
          </div>

          {/* INFORMACIÓN */}

          <div className="min-w-0 flex-1 text-left">

            {/* NOMBRE */}

            <div className="mb-2">

              <h1 className="text-xl font-bold leading-tight text-slate-800">
                {usuario.nombre ||
                  "Sin nombre"}
              </h1>

            </div>

            {/* ADMINISTRADOR */}

            {usuario.rol ===
              "admin" && (
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">

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
                  <path d="M4 7l4 4 4-7 4 7 4-4-2 11H6L4 7Z" />
                  <path d="M6 21h12" />
                </svg>

                <span>
                  Administrador
                </span>

              </div>
            )}

            {/* POLICÍA + G.A.C. */}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">

              {/* CATEGORÍA */}

              <div className="flex items-center gap-1.5">

                {usuario.categoria ===
                "oficial" ? (
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
                ) : (
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
                )}

                <span className="font-medium">
                  {usuario.categoria ===
                  "oficial"
                    ? "Oficial de Policía"
                    : usuario.categoria ===
                      "policia"
                    ? "Policía"
                    : "—"}
                </span>

              </div>

              {/* PUESTO */}

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
                  <path d="M5 17h14l-1-7H6Z" />
                  <path d="M7 10 9 5h6l2 5" />
                  <circle
                    cx="8"
                    cy="17"
                    r="1.5"
                  />
                  <circle
                    cx="16"
                    cy="17"
                    r="1.5"
                  />
                </svg>

                <span className="font-medium">
                  {usuario.puesto ===
                  "gac"
                    ? "G.A.C"
                    : usuario.puesto ===
                      "seguridad"
                    ? "Seguridad"
                    : usuario.puesto ===
                      "sala"
                    ? "Sala"
                    : "—"}
                </span>

                {usuario.puesto ===
                  "gac" &&
                  usuario.indicativo && (
                    <span className="font-medium">
                      {usuario.indicativo}
                    </span>
                  )}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          SEPARADOR
      ========================= */}

      <div className="my-4 h-px bg-slate-100" />

      {/* =========================
          TURNO / PERMISO
      ========================= */}

      <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">

        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {permisoHoy
            ? "Hoy tienes"
            : "Hoy estás de"}
        </span>

        <span className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-1.5 text-sm font-bold text-white shadow-sm">

          {permisoHoy ? (
            <>
              {(() => {
                const IconoPermiso =
                  iconosPermisos[
                    permisoHoy.tipo as keyof typeof iconosPermisos
                  ];

                return IconoPermiso ? (
                  <IconoPermiso className="h-5 w-5 shrink-0" />
                ) : (
                  <IconCalendar className="h-5 w-5 shrink-0" />
                );
              })()}

              <span>
                {permisoHoy.tipo}
              </span>
            </>
          ) : (
            <>
              {turnoHoy.icono ===
                "sunrise" && (
                <IconSunrise className="h-5 w-5 shrink-0" />
              )}

              {turnoHoy.icono ===
                "sun" && (
                <IconSun className="h-5 w-5 shrink-0" />
              )}

              {turnoHoy.icono ===
                "moon" && (
                <IconMoon className="h-5 w-5 shrink-0" />
              )}

              {turnoHoy.icono ===
                "free" && (
                <IconFree className="h-5 w-5 shrink-0" />
              )}

              <span>
                {turnoHoy.texto}
              </span>
            </>
          )}

        </span>

      </div>

    </div>
  );
}