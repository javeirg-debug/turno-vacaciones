"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import {
  obtenerSolicitudesDia,
  eliminarSolicitud,
} from "@/services/solicitudes";
import { supabase } from "@/lib/supabase";

const inicioTurno = new Date(2026, 6, 16);

function obtenerTurno(fechaTexto: string) {
  const fecha = new Date(fechaTexto);

  const diferencia = Math.floor(
    (fecha.getTime() - inicioTurno.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const ciclo = ((diferencia % 12) + 12) % 12;

  const turnos = [
    "🌅 Mañana",
    "🌅 Mañana",
    "🌆 Tarde",
    "🌆 Tarde",
    "🌙 Noche",
    "🌙 Noche",
    "⚪ Libre",
    "⚪ Libre",
    "⚪ Libre",
    "⚪ Libre",
    "⚪ Libre",
    "⚪ Libre",
  ];

  return turnos[ciclo];
}

type Solicitud = {
  id: string;
  usuario_id: string;
  nombre: string;
  sexo: string;
  categoria: string | null;
  puesto: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
  estado: string;
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

function obtenerVisual(tipo: string) {
  switch (tipo) {
    case "🌴 Vacaciones":
      return {
        abreviatura: "VAC",
        color: "bg-teal-500",
      };

    case "🟢 AP":
      return {
        abreviatura: "AP",
        color: "bg-sky-500",
      };

    case "⏰ Compensación horaria":
      return {
        abreviatura: "CH",
        color: "bg-slate-600",
      };

    case "🤒 Indisposición":
      return {
        abreviatura: "IND",
        color: "bg-red-500",
      };

    case "🎄 Navidad":
      return {
        abreviatura: "NAV",
        color: "bg-indigo-500",
      };

    case "✝️ Semana Santa":
      return {
        abreviatura: "SS",
        color: "bg-violet-500",
      };

    case "👶 Paternidad":
      return {
        abreviatura: "PAT",
        color: "bg-blue-500",
      };

    case "🤰 Maternidad":
      return {
        abreviatura: "MAT",
        color: "bg-pink-500",
      };

    case "🍼 Lactancia":
      return {
        abreviatura: "LAC",
        color: "bg-amber-500",
      };

    case "📄 Otros permisos":
      return {
        abreviatura: "OT",
        color: "bg-fuchsia-500",
      };

    case "🚨 Permiso urgente":
      return {
        abreviatura: "URG",
        color: "bg-orange-500",
      };

    default:
      return {
        abreviatura: "OT",
        color: "bg-slate-500",
      };
  }
}

function obtenerCategoria(
  categoria: string | null,
  sexo: string
) {
  if (categoria === "oficial") {
    return sexo === "mujer"
      ? "👮‍♀️ Oficial de Policía"
      : "👮‍♂️ Oficial de Policía";
  }

  if (categoria === "policia") {
    return sexo === "mujer"
      ? "👮‍♀️ Policía"
      : "👮‍♂️ Policía";
  }

  return "--";
}

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
          TURNO
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
            bg-violet-100
            px-5
            py-3
            text-center
          "
        >

          <p
            className="
              text-base
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
            flex-col
            items-center
            justify-center
            px-5
            py-5
            text-center
          "
        >

          <p className="text-3xl">
            {obtenerTurno(fecha).split(" ")[0]}
          </p>

          <p
            className="
              mt-2
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-400
            "
          >
            Turno
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-bold
              text-slate-800
            "
          >
            {obtenerTurno(fecha)
              .split(" ")
              .slice(1)
              .join(" ")}
          </p>

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
            flex
            items-center
            justify-between
            bg-violet-100
            px-4
            py-3
          "
        >

          <h2
            className="
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
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-violet-500
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

                <p className="text-2xl">
                  📭
                </p>

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

                            {/* NOMBRE */}

                            <p
                              className="
                                min-w-0
                                flex-1
                                text-base
                                font-bold
                                text-slate-800
                              "
                            >
                              {solicitud.nombre}
                            </p>


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
                                {obtenerCategoria(
                                  solicitud.categoria,
                                  solicitud.sexo
                                )}
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  font-semibold
                                  text-slate-500
                                "
                              >
                                {solicitud.puesto ===
                                "gac"
                                  ? "🚓 G.A.C"
                                  : solicitud.puesto ===
                                    "seguridad"
                                  ? "🛡️ Seguridad"
                                  : solicitud.puesto ===
                                    "sala"
                                  ? "🖥️ Sala"
                                  : "—"}
                              </p>

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

                            <p
                              className="
                                text-base
                                font-bold
                                leading-tight
                                text-slate-800
                              "
                            >
                              {solicitud.tipo}
                            </p>


                            {/* FECHA */}

                            <p
                              className="
                                mt-3
                                text-sm
                                font-bold
                                text-slate-700
                              "
                            >

                              📅{" "}

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
                              🕐{" "}
                              {formatearFecha(
                                solicitud.created_at
                              )}
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

                          {solicitud.usuario_id ===
                            miUsuarioId && (

                            <button
                              type="button"
                              onClick={() =>
                                borrar(
                                  solicitud.id
                                )
                              }
                              className="
                                absolute
                                bottom-4
                                right-4
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-red-100
                                text-sm
                                transition
                                hover:bg-red-200
                                active:scale-95
                              "
                              aria-label="
                                Eliminar solicitud
                              "
                            >
                              🗑️
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
          router.push(
            `/solicitudes/nueva?fecha=${fecha}`
          )
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
        📝 Solicitar permiso
      </button>


      <BottomNav />

    </main>
  );
}