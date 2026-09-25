"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BottomNav from "@/components/navigation/BottomNav";
import { supabase } from "@/lib/supabase";
import { obtenerConflictosUsuario } from "@/services/conflictos";
import { eliminarSolicitud } from "@/services/solicitudes";
import { iconosPermisos } from "@/components/icons/Icons";
import TarjetaOrdenServicio from "@/components/ordenservicio/TarjetaOrdenServicio";
import Aviso from "@/components/avisos/Aviso";
import Presentacion from "@/components/perfil/Presentacion";

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

function IconUser({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </SvgIcon>
  );
}

function IconInfo({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </SvgIcon>
  );
}

function IconCalendar({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </SvgIcon>
  );
}

function IconTrash({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 15H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </SvgIcon>
  );
}

function IconKey({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 9-9" />
      <path d="m17 6 2 2" />
      <path d="m14 9 2 2" />
    </SvgIcon>
  );
}

function IconLogout({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 3v18" />
    </SvgIcon>
  );
}

function IconMonitor({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </SvgIcon>
  );
}

function IconX({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="m6 6 12 12M18 6 6 18" />
    </SvgIcon>
  );
}

function IconSmartphone({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M10 18h4" />
    </SvgIcon>
  );
}

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

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default function Inicio() {
  const router = useRouter();

  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>([]);

  const [solicitudesVista, setSolicitudesVista] =
    useState<any[]>([]);

  const [fechasConflictivas, setFechasConflictivas] =
    useState<FechaConflictiva[] | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [mostrarInfo, setMostrarInfo] =
    useState(false);

  useEffect(() => {
    async function cargar() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

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
          .eq("usuario_id", user.id)
          .gte("fecha_fin", hoy)
          .order("fecha_inicio");

      const lista = data || [];

      const agrupadas: any[] = [];

      lista.forEach((s) => {
        if (
          s.tipo === "Navidad" ||
          s.tipo === "Semana Santa"
        ) {
          const grupo = agrupadas.find(
            (x) => x.tipo === s.tipo
          );

          if (grupo) {
            grupo.dias.push({
              id: s.id,
              fecha: s.fecha_inicio,
            });
          } else {
            agrupadas.push({
              ...s,
              dias: [
                {
                  id: s.id,
                  fecha: s.fecha_inicio,
                },
              ],
            });
          }
        } else {
          agrupadas.push(s);
        }
      });

      setSolicitudes(lista);
      setSolicitudesVista(agrupadas);

      const conflictos =
        await obtenerConflictosUsuario(user.id);

      setFechasConflictivas(conflictos);

      setCargando(false);
    }

    cargar();
  }, [router]);

  async function cerrarSesion() {
    await supabase.auth.signOut();

    router.replace("/login");
  }

  async function borrar(id: string) {
    const confirmar = confirm(
      "¿Quieres borrar esta solicitud?"
    );

    if (!confirmar) return;

    await eliminarSolicitud(id);

    window.location.reload();
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-100">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-sm text-slate-500">
            Cargando...
          </div>
        </div>

        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">

      {/* =========================
          PRESENTACION
      ========================= */}

      <Presentacion />

      {/* =========================
          AVISOS
      ========================= */}

      <Aviso />

      {/* =========================
          ORDEN DE SERVICIO
      ========================= */}

      <TarjetaOrdenServicio />

      {/* =========================
          FECHAS CONFLICTIVAS
      ========================= */}

      <div
        className={`
          mt-4
          rounded-3xl
          p-4
          shadow

          ${
            fechasConflictivas === null
              ? "border border-slate-200 bg-white"
              : fechasConflictivas.length > 0
              ? "border border-red-200 bg-red-50"
              : "border border-green-200 bg-green-50"
          }
        `}
      >
        <h2
          className={`
            mb-3
            text-lg
            font-bold

            ${
              fechasConflictivas === null
                ? "text-slate-800"
                : fechasConflictivas.length > 0
                ? "text-red-900"
                : "text-green-900"
            }
          `}
        >
          {fechasConflictivas === null ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 inline-block h-5 w-5 align-[-3px]"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>

              Fechas conflictivas
            </>
          ) : fechasConflictivas.length > 0 ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 inline-block h-5 w-5 align-[-3px]"
                aria-hidden="true"
              >
                <path d="m10.3 3.9-8 14a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>

              Fechas conflictivas
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 inline-block h-5 w-5 align-[-3px]"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 2.5 2.5L16 9" />
              </svg>

              Fechas conflictivas
            </>
          )}
        </h2>

        {fechasConflictivas === null ? (
          <p className="text-sm text-slate-500">
            Comprobando ocupación...
          </p>
        ) : fechasConflictivas.length > 0 ? (
          <>
            <p className="mb-3 text-sm text-slate-700">
              Tienes coincidencias en fechas de alta ocupación:
            </p>

            <div className="space-y-2">
              {fechasConflictivas.map((f) => (
                <button
                  key={f.fecha}
                  type="button"
                  onClick={() =>
                    router.push(`/calendario/${f.fecha}`)
                  }
                  className="
                    w-full
                    rounded-2xl
                    bg-red-100
                    p-3
                    shadow-sm
                    transition
                    active:scale-95
                  "
                >
                  <div
                    className="
                      border-y
                      border-red-200
                      py-2
                      text-center
                    "
                  >
                    <p
                      className="
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-1
                        text-sm
                        font-bold
                        leading-relaxed
                        text-slate-800
                      "
                    >
                      <span>
                        {new Date(f.fecha).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>

                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        ·

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-4 w-4 shrink-0 text-slate-600"
                          aria-hidden="true"
                        >
                          <circle cx="9" cy="8" r="4" />
                          <path d="M2 21a7 7 0 0 1 14 0H2Z" />
                          <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
                          <path d="M17 14a6 6 0 0 1 5 7h-4a7 7 0 0 0-3-5.8" />
                        </svg>

                        {f.gac + f.seguridad + f.sala}
                      </span>
                    </p>
                  </div>

                  <div
                    className="
                      mt-2
                      grid
                      grid-cols-3
                      text-center
                    "
                  >
                    <div className="min-w-0">
                      <p
                        className="
                          flex
                          items-center
                          justify-center
                          gap-1
                          text-xs
                          text-slate-500
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5 shrink-0 text-slate-600"
                          aria-hidden="true"
                        >
                          <path d="M5 17h14l-1-7H6Z" />
                          <path d="M7 10 9 5h6l2 5" />
                          <circle cx="8" cy="17" r="1.5" />
                          <circle cx="16" cy="17" r="1.5" />
                        </svg>

                        <span>G.A.C.:</span>

                        <span className="font-bold text-slate-800">
                          {f.gac}
                        </span>
                      </p>
                    </div>

                    <div className="min-w-0 border-x border-red-200">
                      <p
                        className="
                          flex
                          items-center
                          justify-center
                          gap-1
                          text-xs
                          text-slate-500
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5 shrink-0 text-slate-600"
                          aria-hidden="true"
                        >
                          <path d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>

                        <span>Seguridad:</span>

                        <span className="font-bold text-slate-800">
                          {f.seguridad}
                        </span>
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          flex
                          items-center
                          justify-center
                          gap-1
                          text-xs
                          text-slate-500
                        "
                      >
                        <IconMonitor className="h-3.5 w-3.5 shrink-0 text-slate-600" />

                        <span>Sala:</span>

                        <span className="font-bold text-slate-800">
                          {f.sala}
                        </span>
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-green-800">
            No tienes coincidencias en días de alta ocupación.
          </p>
        )}
      </div>

      {/* =========================
          PRÓXIMOS PERMISOS
      ========================= */}

      <div className="mt-4 rounded-3xl bg-white p-5 shadow">

        <h2 className="flex items-center gap-2 text-xl font-bold">
          <IconCalendar className="h-5 w-5" />
          Próximos permisos
        </h2>

        <button
          type="button"
          onClick={() =>
            router.push("/solicitudes/nueva")
          }
          className="
            mt-4
            w-full
            rounded-xl
            bg-slate-800
            py-3
            font-semibold
            text-white
            transition
            hover:bg-slate-700
            active:scale-[0.98]
          "
        >
          Nueva solicitud
        </button>

        {solicitudes.length === 0 ? (
          <p className="mt-4 text-slate-500">
            No tienes permisos pendientes.
          </p>
        ) : (
          <div className="mt-4 space-y-3">

            {solicitudesVista.map((solicitud) => {
              const tipo = solicitud.tipo;

              const Icono =
                iconosPermisos[
                  tipo as keyof typeof iconosPermisos
                ] ?? iconosPermisos["Otros permisos"];

              let abreviatura = "OT";
              let color = "bg-slate-500";

              switch (tipo) {
                case "Vacaciones":
                  abreviatura = "VAC";
                  color = "bg-teal-500";
                  break;

                case "Asunto propio":
                  abreviatura = "AP";
                  color = "bg-sky-500";
                  break;

                case "Compensación horaria":
                  abreviatura = "CH";
                  color = "bg-slate-600";
                  break;

                case "Indisposición":
                  abreviatura = "IND";
                  color = "bg-red-500";
                  break;

                case "Navidad":
                  abreviatura = "NAV";
                  color = "bg-indigo-500";
                  break;

                case "Semana Santa":
                  abreviatura = "SS";
                  color = "bg-violet-500";
                  break;

                case "Paternidad":
                  abreviatura = "PAT";
                  color = "bg-blue-500";
                  break;

                case "Maternidad":
                  abreviatura = "MAT";
                  color = "bg-pink-500";
                  break;

                case "Lactancia":
                  abreviatura = "LAC";
                  color = "bg-amber-500";
                  break;

                case "Otros permisos":
                  abreviatura = "OT";
                  color = "bg-fuchsia-500";
                  break;

                case "Permiso urgente":
                  abreviatura = "URG";
                  color = "bg-orange-500";
                  break;
              }

              return (
                <div
                  key={solicitud.id}
                  className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-3
                    py-3
                    shadow-md
                  "
                >
                  <div className="flex items-center gap-3">

                    <div
                      className={`
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-[11px]
                        font-extrabold
                        text-white
                        ${color}
                      `}
                    >
                      {abreviatura}
                    </div>

                    <button
                      onClick={() =>
                        router.push("/solicitudes")
                      }
                      className="
                        min-w-0
                        flex-1
                        text-left
                      "
                    >
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
                        <Icono
                          className="
                            h-5
                            w-5
                            shrink-0
                            text-slate-600
                          "
                          strokeWidth={2}
                        />

                        <span className="truncate">
                          {tipo}
                        </span>
                      </p>

                      {!solicitud.dias && (
                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          <span
                            className="
                              inline-flex
                              items-center
                              gap-1
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
                                d="M8 14H8.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />

                              <path
                                d="M12 14H12.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />

                              <path
                                d="M16 14H16.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>

                            {formatearFecha(
                              solicitud.fecha_inicio
                            )}
                          </span>

                          {solicitud.fecha_inicio !==
                            solicitud.fecha_fin && (
                            <>
                              {" → "}
                              {formatearFecha(
                                solicitud.fecha_fin
                              )}
                            </>
                          )}
                        </p>
                      )}

                      {!solicitud.dias &&
                        solicitud.motivo && (
                          <p
                            className="
                              mt-1
                              text-xs
                              italic
                              text-slate-500
                            "
                          >
                            Observaciones:{" "}
                            {solicitud.motivo}
                          </p>
                        )}
                    </button>

                    {!solicitud.dias && (
                      <button
                        type="button"
                        onClick={() =>
                          borrar(solicitud.id)
                        }
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-red-100
                          text-base
                          transition
                          hover:bg-red-200
                          active:scale-95
                        "
                        aria-label="Eliminar solicitud"
                      >
                        <IconTrash
                          className="
                            h-4
                            w-4
                            text-red-600
                          "
                        />
                      </button>
                    )}
                  </div>

                  {solicitud.dias && (
                    <div
                      className="
                        mt-3
                        ml-[68px]
                        space-y-2
                      "
                    >
                      {[...solicitud.dias]
                        .sort(
                          (
                            a: any,
                            b: any
                          ) =>
                            new Date(
                              a.fecha
                            ).getTime() -
                            new Date(
                              b.fecha
                            ).getTime()
                        )
                        .map(
                          (
                            dia: any,
                            index: number
                          ) => (
                            <div
                              key={dia.id}
                              className="
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                bg-slate-50
                                px-3
                                py-2
                              "
                            >
                              <div className="min-w-0">
                                <p
                                  className="
                                    text-xs
                                    text-slate-600
                                  "
                                >
                                  <span
                                    className="
                                      inline-flex
                                      items-center
                                      gap-1
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

                                    Día {index + 1}:{" "}
                                    {formatearFecha(
                                      dia.fecha
                                    )}
                                  </span>
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  borrar(dia.id)
                                }
                                className="
                                  ml-3
                                  flex
                                  h-8
                                  w-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-red-100
                                  text-sm
                                  transition
                                  hover:bg-red-200
                                  active:scale-95
                                "
                                aria-label="Eliminar día"
                              >
                                <IconTrash
                                  className="
                                    h-4
                                    w-4
                                    text-red-600
                                  "
                                />
                              </button>
                            </div>
                          )
                        )}

                      {solicitud.motivo && (
                        <p
                          className="
                            mt-2
                            text-xs
                            italic
                            text-slate-500
                          "
                        >
                          Observaciones:{" "}
                          {solicitud.motivo}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================
          CUENTA
      ========================= */}

      <div className="mt-4 rounded-3xl bg-white p-5 shadow">

        <h2 className="flex items-center gap-2 text-xl font-bold">
          <IconUser className="h-5 w-5" />
          Cuenta
        </h2>

        <div className="mt-5 flex gap-3">

          <button
            onClick={() =>
              router.push("/cambiar-clave")
            }
            className="
              flex-1
              rounded-xl
              bg-amber-500
              py-3
              font-semibold
              text-white
            "
          >
            <span className="flex items-center justify-center gap-2">
              <IconKey className="h-4 w-4" />
              Cambiar clave
            </span>
          </button>

          <button
            onClick={cerrarSesion}
            className="
              flex-1
              rounded-xl
              bg-slate-800
              py-3
              font-semibold
              text-white
            "
          >
            <span className="flex items-center justify-center gap-2">
              <IconLogout className="h-4 w-4" />
              Salir
            </span>
          </button>

        </div>
      </div>

      {/* =========================
          INFORMACIÓN
      ========================= */}

      {mostrarInfo && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-6
          "
        >
          <div
            className="
              w-full
              max-w-2xl
              rounded-3xl
              bg-white
              p-6
              shadow-xl
            "
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
                  text-blue-900
                "
              >
                <span className="flex items-center gap-2">
                  <IconInfo className="h-5 w-5" />
                  Información de la aplicación
                </span>
              </h2>

              <button
                onClick={() =>
                  setMostrarInfo(false)
                }
                className="
                  text-xl
                  text-slate-400
                "
                aria-label="Cerrar"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <div
              className="
                mt-6
                max-h-[60vh]
                space-y-5
                overflow-y-auto
                text-sm
                leading-7
                text-slate-700
              "
            >
              <div>
                <h3
                  className="
                    mb-2
                    text-lg
                    font-bold
                    text-blue-900
                  "
                >
                  <span className="flex items-center gap-2">
                    <IconSmartphone className="h-5 w-5" />
                    Sobre la aplicación
                  </span>
                </h3>

                <p>
                  Esta aplicación ha sido desarrollada de manera completamente altruista,
                  con el único objetivo de facilitar la organización y coordinación de los
                  turnos de vacaciones entre los funcionarios.
                </p>

                <p className="mt-3">
                  Se trata de una herramienta de apoyo para mejorar la comunicación y la
                  planificación interna,{" "}
                  <strong>
                    sin sustituir en ningún caso los procedimientos oficiales ni las
                    autorizaciones correspondientes.
                  </strong>
                </p>

                <p className="mt-3">
                  Cualquier permiso o incidencia deberá seguir tramitándose por los canales
                  oficiales establecidos.
                </p>

                <p className="mt-3">
                  Gracias a todos los compañeros por utilizarla y contribuir a una mejor
                  coordinación del servicio.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setMostrarInfo(false)
              }
              className="
                mt-6
                w-full
                rounded-xl
                bg-blue-900
                py-3
                font-bold
                text-white
              "
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <BottomNav />

    </main>
  );
}