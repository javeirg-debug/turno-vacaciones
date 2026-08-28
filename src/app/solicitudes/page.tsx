"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import {
  obtenerSolicitudes,
  eliminarSolicitud,
} from "@/services/solicitudes";
import { iconosPermisos } from "@/components/icons/Icons";


type Solicitud = {
  id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
  estado: string;

  usuarios: {
    nombre: string;
  } | null;
};


type SolicitudVistaNormal = Solicitud & {
  tipoVisual: string;
  icono: React.ElementType;
  abreviatura: string;
  color: string;
};


type SolicitudVistaAgrupada = {
  id: string;
  tipo: string;
  icono: React.ElementType;
  abreviatura: string;
  color: string;
  dias: {
    id: string;
    fecha: string;
  }[];
  motivo: string | null;
  estado: string;
};


function formatearFecha(fecha: string) {

  return new Date(fecha + "T00:00:00").toLocaleDateString(
    "es-ES",
    {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }
  );

}


/* =========================
   CONFIGURACIÓN VISUAL
========================= */

function obtenerVisual(tipo: string) {
  const icono =
  iconosPermisos[tipo as keyof typeof iconosPermisos];

  switch (tipo) {
    case "Vacaciones":
      return {
        tipoVisual: "Vacaciones",
        icono,
        abreviatura: "VAC",
        color: "bg-teal-500",
      };

    case "Asunto propio":
      return {
        tipoVisual: "Asunto propio",
        icono,
        abreviatura: "AP",
        color: "bg-sky-500",
      };

    case "Compensación horaria":
      return {
        tipoVisual: "Compensación horaria",
        icono,
        abreviatura: "CH",
        color: "bg-slate-600",
      };

    case "Indisposición":
      return {
        tipoVisual: "Indisposición",
        icono,
        abreviatura: "IND",
        color: "bg-red-500",
      };

    case "Navidad":
      return {
        tipoVisual: "Navidad",
        icono,
        abreviatura: "NAV",
        color: "bg-indigo-500",
      };

    case "Semana Santa":
      return {
        tipoVisual: "Semana Santa",
        icono,
        abreviatura: "SS",
        color: "bg-violet-500",
      };

    case "Paternidad":
      return {
        tipoVisual: "Paternidad",
        icono,
        abreviatura: "PAT",
        color: "bg-blue-500",
      };

    case "Maternidad":
      return {
        tipoVisual: "Maternidad",
        icono,
        abreviatura: "MAT",
        color: "bg-pink-500",
      };

    case "Lactancia":
      return {
        tipoVisual: "Lactancia",
        icono,
        abreviatura: "LAC",
        color: "bg-amber-500",
      };

    case "Otros permisos":
      return {
        tipoVisual: "Otros permisos",
        icono,
        abreviatura: "OT",
        color: "bg-fuchsia-500",
      };

    case "Permiso urgente":
      return {
        tipoVisual: "Permiso urgente",
        icono,
        abreviatura: "URG",
        color: "bg-orange-500",
      };

    default:
      return {
        tipoVisual: tipo,
        icono: iconosPermisos["Otros permisos"],
        abreviatura: "OT",
        color: "bg-slate-500",
      };
  }
}

export default function Solicitudes() {


  const router = useRouter();


  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>([]);

  const [solicitudesActuales, setSolicitudesActuales] =
    useState<Solicitud[]>([]);

  const [solicitudesVista, setSolicitudesVista] =
    useState<
      (SolicitudVistaNormal | SolicitudVistaAgrupada)[]
    >([]);

  const [cargando, setCargando] =
    useState(true);


  /* =========================
     CARGAR SOLICITUDES
  ========================= */

  async function cargarSolicitudes() {

    try {

      const datos =
        await obtenerSolicitudes();

      const lista =
        datos || [];


      const hoy =
        new Date()
          .toISOString()
          .split("T")[0];


      const actuales =
        lista.filter(
          (solicitud) =>
            solicitud.fecha_fin >= hoy
        );


      setSolicitudes(lista);

      setSolicitudesActuales(actuales);


      /* =========================
         AGRUPAR NAVIDAD /
         SEMANA SANTA
      ========================= */

      const agrupadas: (
        SolicitudVistaNormal |
        SolicitudVistaAgrupada
      )[] = [];


      actuales.forEach((s) => {


        if (
          s.tipo === "Navidad" ||
          s.tipo === "Semana Santa"
        ) {


          const visual =
            obtenerVisual(s.tipo);


          const grupo =
            agrupadas.find(
              (x) =>
                "dias" in x &&
                x.tipo === s.tipo
            ) as
              | SolicitudVistaAgrupada
              | undefined;


          if (grupo) {

            grupo.dias.push({
              id: s.id,
              fecha: s.fecha_inicio,
            });

          } else {

            agrupadas.push({

              id: s.id,

              tipo: s.tipo,

              icono:
                visual.icono,

              abreviatura:
                visual.abreviatura,

              color:
                visual.color,

              dias: [
                {
                  id: s.id,
                  fecha: s.fecha_inicio,
                },
              ],

              motivo:
                s.motivo,

              estado:
                s.estado,

            });

          }


        } else {


          const visual =
            obtenerVisual(s.tipo);


          agrupadas.push({

            ...s,

            tipoVisual:
              visual.tipoVisual,

            icono:
              visual.icono,

            abreviatura:
              visual.abreviatura,

            color:
              visual.color,

          });


        }

      });



      agrupadas.forEach((grupo) => {
  if ("dias" in grupo) {
    grupo.dias.sort((a, b) =>
      a.fecha.localeCompare(b.fecha)
    );
  }
});

setSolicitudesVista(agrupadas);


      setSolicitudesVista(agrupadas);


    } catch (error) {

      console.error(error);

    } finally {

      setCargando(false);

    }

  }


  useEffect(() => {

    cargarSolicitudes();

  }, []);


  /* =========================
     BORRAR SOLICITUD
  ========================= */

  async function borrar(id: string) {


    const confirmar =
      confirm(
        "¿Quieres borrar esta solicitud?"
      );


    if (!confirmar) return;


    try {

      await eliminarSolicitud(id);

      await cargarSolicitudes();

    } catch (error) {

      console.error(error);

    }

  }


  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">


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
    className="h-7 w-7"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 4h6m-7 4h8m-8 4h5m-5 4h4M6 3h9l3 3v15H6V3z"
    />
  </svg>
  Solicitudes
</h1>


      <button
        onClick={() => {
          window.location.href =
            "/solicitudes/nueva";
        }}
        className="
  mt-6
  w-full
  rounded-2xl
  bg-slate-800
  py-3
  text-lg
  font-semibold
  text-white
  transition
  hover:bg-slate-700
  active:scale-[0.98]
"
      >
  <span className="flex items-center justify-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 5v14M5 12h14"
      />
    </svg>
    Nueva solicitud
  </span>
</button>


      {/* =========================
          SOLICITUDES ACTUALES
      ========================= */}

      <div className="mt-6">


        <h2 className="flex items-center gap-1 text-xl font-bold">
  <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  className="h-5 w-5"
  aria-hidden="true"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M9 3h6l-1 5 3 3v2H7v-2l3-3-1-5zM12 13v8"
  />
</svg>
  Solicitudes actuales
</h2>


        <div className="mt-4 space-y-3">


          {/* CARGANDO */}

          {cargando && (

            <div className="
              rounded-2xl
              bg-white
              p-5
              shadow-md
            ">
              Cargando solicitudes...
            </div>

          )}


          {/* SIN SOLICITUDES */}

          {!cargando &&
            solicitudesActuales.length === 0 && (

              <div className="
                rounded-2xl
                bg-white
                p-5
                shadow-md
              ">
                No tienes solicitudes actuales.
              </div>

            )}


          {/* =========================
              TARJETAS
          ========================= */}

          {!cargando &&
            solicitudesVista.map(
              (solicitud) => {


                /* =========================
                   NAVIDAD / SEMANA SANTA
                ========================= */

                if ("dias" in solicitud) {

                  const Icono = solicitud.icono;
                  return (

                    
                    <div
                      key={solicitud.id}
                      className="
                        rounded-2xl
                        bg-white
                        px-3
                        py-3
                        shadow-md
                      "
                    >

                      <div className="
                        flex
                        items-start
                        gap-3
                      ">


                        {/* CÍRCULO */}

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
                            shadow-sm
                            ${solicitud.color}
                          `}
                        >
                          {solicitud.abreviatura}
                        </div>


                        {/* INFORMACIÓN */}

                        <div className="
                          min-w-0
                          flex-1
                        ">


                          {/* TIPO */}


{/* TIPO */}

<h2 className="flex items-center gap-2 text-base font-bold leading-tight text-slate-800">
  <Icono className="h-5 w-5 shrink-0 text-slate-600" />

  {solicitud.tipo === "Navidad"
    ? "Navidad"
    : "Semana Santa"}
</h2>


                          {/* DÍAS */}

                          <div className="
                            mt-2
                            space-y-2
                          ">

                            {solicitud.dias.map(
                              (dia, index) => (

                                <div
                                  key={dia.id}
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                  "
                                >

                                  <p className="
  flex
  items-center
  whitespace-nowrap
  text-xs
  text-slate-500
">
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
  {formatearFecha(dia.fecha)}
</p>


                                  <button
                                    type="button"
                                    onClick={() =>
                                      borrar(
                                        dia.id
                                      )
                                    }
                                    className="
                                      ml-2
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
    d="M9 3h6m-8 4h10M10 11v6m4-6v6M6 7l1 14h10l1-14M9 3l-1 4h8l-1-4"
  />
</svg>
                                  </button>

                                </div>

                              )
                            )}

                          </div>


                          {/* OBSERVACIONES */}

                          {solicitud.motivo && (

                            <p className="
                              mt-2
                              text-xs
                              italic
                              text-slate-500
                            ">
                              Observaciones:{" "}
                              {solicitud.motivo}
                            </p>

                          )}



                        </div>

                      </div>

                    </div>

                  );

                }

const Icono = solicitud.icono;
                /* =========================
                   SOLICITUD NORMAL
                ========================= */

                return (

                  <div
                    key={solicitud.id}
                    className="
                      rounded-2xl
                      bg-white
                      px-3
                      py-3
                      shadow-md
                    "
                  >

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">


                      {/* CÍRCULO */}

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
                          shadow-sm
                          ${solicitud.color}
                        `}
                      >

                        {solicitud.abreviatura}

                      </div>


                      {/* INFORMACIÓN */}

                      <div className="
                        min-w-0
                        flex-1
                      ">


                        {/* TIPO */}

                      

<h2 className="flex items-center gap-2 text-base font-bold leading-tight text-slate-800">
  <Icono className="h-5 w-5 shrink-0 text-slate-600" />
  {solicitud.tipo}
</h2>


                        {/* FECHA */}

<p className="
  mt-1
  flex
  items-center
  whitespace-nowrap
  text-xs
  text-slate-500
">
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

  {formatearFecha(solicitud.fecha_inicio)}

  {solicitud.fecha_inicio !== solicitud.fecha_fin && (
    <>
      {" → "}
      {formatearFecha(solicitud.fecha_fin)}
    </>
  )}
</p>


                        {/* OBSERVACIONES */}

                        {solicitud.motivo && (

                          <p className="
                            mt-1
                            text-xs
                            italic
                            text-slate-500
                          ">

                            Observaciones:{" "}
                            {solicitud.motivo}

                          </p>

                        )}



                      </div>


                      {/* PAPELERA */}

                      <button
                        type="button"
                        onClick={() =>
                          borrar(
                            solicitud.id
                          )
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
                        aria-label={`Eliminar ${solicitud.tipoVisual}`}
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


                    </div>

                  </div>

                );

              }
            )}

        </div>

      </div>


      {/* =========================
          HISTORIAL
      ========================= */}

      <button
        onClick={() =>
          router.push(
            "/solicitudes/historial"
          )
        }
        className="
          mt-4
          w-full
          rounded-2xl
          bg-slate-800
          py-3
          text-lg
          font-semibold
          text-white
        "
      >
  <span className="flex items-center justify-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7h6l2 2h10v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
      />
    </svg>
    Historial de peticiones
  </span>
</button>


      <BottomNav />


    </main>

  );

}