"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/navigation/BottomNav";
import {
  obtenerHistorialSolicitudes,
  eliminarSolicitud,
} from "@/services/solicitudes";


type Solicitud = {
  id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
  estado: string;
  dias?: {
    id: string;
    fecha: string;
  }[];
};


function formatearFecha(fecha: string) {

  return new Date(
    fecha + "T00:00:00"
  ).toLocaleDateString(
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

  switch (tipo) {

    case "🌴 Vacaciones":
      return {
        tipoVisual: "Vacaciones",
        icono: "🌴",
        abreviatura: "VAC",
        color: "bg-teal-500",
      };

    case "🟢 AP":
      return {
        tipoVisual: "AP",
        icono: "🟢",
        abreviatura: "AP",
        color: "bg-sky-500",
      };

    case "⏰ Compensación horaria":
      return {
        tipoVisual: "Compensación horaria",
        icono: "⏰",
        abreviatura: "CH",
        color: "bg-slate-600",
      };

    case "🤒 Indisposición":
      return {
        tipoVisual: "Indisposición",
        icono: "🤒",
        abreviatura: "IND",
        color: "bg-red-500",
      };

    case "🎄 Navidad":
      return {
        tipoVisual: "Navidad",
        icono: "🎄",
        abreviatura: "NAV",
        color: "bg-indigo-500",
      };

    case "✝️ Semana Santa":
      return {
        tipoVisual: "Semana Santa",
        icono: "✝️",
        abreviatura: "SS",
        color: "bg-violet-500",
      };

    case "👶 Paternidad":
      return {
        tipoVisual: "Paternidad",
        icono: "👶",
        abreviatura: "PAT",
        color: "bg-blue-500",
      };

    case "🤰 Maternidad":
      return {
        tipoVisual: "Maternidad",
        icono: "🤰",
        abreviatura: "MAT",
        color: "bg-pink-500",
      };

    case "🍼 Lactancia":
      return {
        tipoVisual: "Lactancia",
        icono: "🍼",
        abreviatura: "LAC",
        color: "bg-amber-500",
      };

    case "📄 Otros permisos":
      return {
        tipoVisual: "Otros permisos",
        icono: "📄",
        abreviatura: "OT",
        color: "bg-fuchsia-500",
      };

    case "🚨 Permiso urgente":
      return {
        tipoVisual: "Permiso urgente",
        icono: "🚨",
        abreviatura: "URG",
        color: "bg-orange-500",
      };

    default:
      return {
        tipoVisual: tipo,
        icono: "📄",
        abreviatura: "OT",
        color: "bg-slate-500",
      };

  }

}


export default function HistorialSolicitudes() {


  const [historial, setHistorial] =
    useState<Solicitud[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [busqueda, setBusqueda] =
    useState("");


  /* =========================
     CARGAR HISTORIAL
  ========================= */

  async function cargarHistorial() {

    try {

      const datos =
        await obtenerHistorialSolicitudes();


      const hoy =
        new Date()
          .toISOString()
          .split("T")[0];


      const antiguas =
        (datos || []).filter(
          (solicitud) =>
            solicitud.fecha_fin < hoy
        );


      const agrupadas: Solicitud[] = [];


      const especiales =
        antiguas.filter(
          (s) =>
            s.tipo === "🎄 Navidad" ||
            s.tipo === "✝️ Semana Santa"
        );


      const normales =
        antiguas.filter(
          (s) =>
            s.tipo !== "🎄 Navidad" &&
            s.tipo !== "✝️ Semana Santa"
        );


      /* =========================
         SOLICITUDES NORMALES
      ========================= */

      agrupadas.push(
        ...normales
      );


      /* =========================
         NAVIDAD / SEMANA SANTA
      ========================= */

      const pendientes =
        [...especiales];


      while (
        pendientes.length > 0
      ) {


        pendientes.sort(
          (a, b) =>
            new Date(
              a.fecha_inicio
            ).getTime() -
            new Date(
              b.fecha_inicio
            ).getTime()
        );


        const primera =
          pendientes[0];


        const fechaInicial =
          new Date(
            primera.fecha_inicio
          );


        const fechaLimite =
          new Date(
            fechaInicial
          );


        fechaLimite.setDate(
          fechaLimite.getDate() + 30
        );


        const bloque =
          pendientes.filter(
            (s) => {

              if (
                s.tipo !==
                primera.tipo
              ) {
                return false;
              }


              const fecha =
                new Date(
                  s.fecha_inicio
                );


              return (
                fecha >=
                  fechaInicial &&
                fecha <=
                  fechaLimite
              );

            }
          );


        bloque.sort(
          (a, b) =>
            new Date(
              a.fecha_inicio
            ).getTime() -
            new Date(
              b.fecha_inicio
            ).getTime()
        );


        agrupadas.push({

          ...primera,

          dias:
            bloque.map(
              (s) => ({
                id: s.id,
                fecha:
                  s.fecha_inicio,
              })
            ),

        });


        bloque.forEach(
          (s) => {

            const indice =
              pendientes.findIndex(
                (p) =>
                  p.id === s.id
              );


            if (
              indice !== -1
            ) {

              pendientes.splice(
                indice,
                1
              );

            }

          }
        );

      }


      /* =========================
         ORDEN FINAL
         MÁS RECIENTE → ANTIGUA
      ========================= */

      agrupadas.sort(
        (a, b) =>
          new Date(
            b.fecha_inicio
          ).getTime() -
          new Date(
            a.fecha_inicio
          ).getTime()
      );


      setHistorial(
        agrupadas
      );


    } catch (error) {

      console.error(error);

    } finally {

      setCargando(false);

    }

  }


  useEffect(() => {

    cargarHistorial();

  }, []);


  /* =========================
     BORRAR
  ========================= */

  async function borrar(
    id: string
  ) {


    const confirmar =
      confirm(
        "¿Quieres borrar esta solicitud?"
      );


    if (!confirmar) return;


    try {

      await eliminarSolicitud(
        id
      );

      await cargarHistorial();

    } catch (error) {

      console.error(error);

    }

  }


  /* =========================
     BUSCADOR
  ========================= */

  const historialFiltrado =
    historial.filter(
      (solicitud) => {

        const texto =
          busqueda
            .toLowerCase()
            .trim();


        if (!texto) {
          return true;
        }


        const visual =
          obtenerVisual(
            solicitud.tipo
          );


        const fechas =
          solicitud.dias
            ? solicitud.dias
                .map(
                  (dia) =>
                    dia.fecha
                )
                .join(" ")
            : `${solicitud.fecha_inicio} ${solicitud.fecha_fin}`;


        const contenido = `
          ${solicitud.tipo}
          ${visual.tipoVisual}
          ${visual.abreviatura}
          ${fechas}
          ${solicitud.motivo || ""}
        `
          .toLowerCase();


        return contenido.includes(
          texto
        );

      }
    );


  return (

    <main className="
      min-h-screen
      bg-slate-100
      p-6
      pb-24
    ">


      {/* =========================
          CABECERA
      ========================= */}

      <h1 className="
        text-3xl
        font-bold
        text-slate-800
      ">

        📂 Historial de peticiones

      </h1>


      <p className="
        mt-2
        text-slate-500
      ">

        Solicitudes anteriores.

      </p>


      {/* =========================
          BUSCADOR
      ========================= */}

      <div className="
        mt-6
        rounded-2xl
        bg-white
        p-3
        shadow-md
      ">

        <div className="
          flex
          items-center
          gap-3
        ">


          <span className="
            text-xl
          ">
            🔎
          </span>


          <input
            type="text"
            value={busqueda}
            onChange={(e) =>
              setBusqueda(
                e.target.value
              )
            }
            placeholder="
              Buscar permiso...
            "
            className="
              min-w-0
              flex-1
              bg-transparent
              text-sm
              text-slate-700
              outline-none
              placeholder:text-slate-400
            "
          />


          {busqueda && (

            <button
              type="button"
              onClick={() =>
                setBusqueda("")
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                bg-slate-100
                text-slate-500
              "
            >
              ✕
            </button>

          )}

        </div>

      </div>


      {/* =========================
          LISTADO
      ========================= */}

      <div className="
        mt-4
        space-y-3
      ">


        {/* CARGANDO */}

        {cargando && (

          <div className="
            rounded-2xl
            bg-white
            p-5
            shadow-md
          ">

            Cargando historial...

          </div>

        )}


        {/* SIN RESULTADOS */}

        {!cargando &&
          historialFiltrado.length === 0 && (

            <div className="
              rounded-2xl
              bg-white
              p-5
              text-center
              text-slate-500
              shadow-md
            ">

              {busqueda
                ? "No se encontraron solicitudes."
                : "No hay solicitudes anteriores."
              }

            </div>

          )}


        {/* =========================
            TARJETAS
        ========================= */}

        {!cargando &&
          historialFiltrado.map(
            (solicitud) => {


              const visual =
                obtenerVisual(
                  solicitud.tipo
                );


              /* =========================
                 NAVIDAD / SEMANA SANTA
              ========================= */

              if (
                solicitud.dias
              ) {

                return (

                  <div
                    key={
                      solicitud.id
                    }
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
                          ${visual.color}
                        `}
                      >

                        {
                          visual.abreviatura
                        }

                      </div>


                      {/* INFORMACIÓN */}

                      <div className="
                        min-w-0
                        flex-1
                      ">


                        <h2 className="
                          text-base
                          font-bold
                          leading-tight
                          text-slate-800
                        ">

                          <span className="mr-1">
                            {visual.icono}
                          </span>

                          {
                            visual.tipoVisual
                          }

                        </h2>


                        {/* DÍAS */}

                        <div className="
                          mt-2
                          space-y-2
                        ">

                          {solicitud.dias.map(
                            (
                              dia,
                              index
                            ) => (

                              <div
                                key={
                                  dia.id
                                }
                                className="
                                  flex
                                  items-center
                                  justify-between
                                "
                              >

                                <p className="
                                  text-xs
                                  text-slate-500
                                ">

                                  📅 Día{" "}
                                  {index + 1}:{" "}
                                  {formatearFecha(
                                    dia.fecha
                                  )}

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
                                  aria-label="
                                    Eliminar día
                                  "
                                >

                                  🗑️

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
                            {
                              solicitud.motivo
                            }

                          </p>

                        )}

                      </div>

                    </div>

                  </div>

                );

              }


              /* =========================
                 SOLICITUD NORMAL
              ========================= */

              return (

                <div
                  key={
                    solicitud.id
                  }
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
                        ${visual.color}
                      `}
                    >

                      {
                        visual.abreviatura
                      }

                    </div>


                    {/* INFORMACIÓN */}

                    <div className="
                      min-w-0
                      flex-1
                    ">


                      {/* TIPO */}

                      <h2 className="
                        text-base
                        font-bold
                        leading-tight
                        text-slate-800
                      ">

                        <span className="mr-1">
                          {visual.icono}
                        </span>

                        {
                          visual.tipoVisual
                        }

                      </h2>


                      {/* FECHAS */}

                      <p className="
                        mt-1
                        text-xs
                        text-slate-500
                      ">

                        📅{" "}
                        {
                          formatearFecha(
                            solicitud.fecha_inicio
                          )
                        }

                        {
                          solicitud.fecha_inicio !==
                          solicitud.fecha_fin && (

                            <>
                              {" → "}
                              {
                                formatearFecha(
                                  solicitud.fecha_fin
                                )
                              }
                            </>

                          )
                        }

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
                          {
                            solicitud.motivo
                          }

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
                      aria-label="
                        Eliminar solicitud
                      "
                    >

                      🗑️

                    </button>


                  </div>

                </div>

              );

            }
          )}

      </div>


      <BottomNav />


    </main>

  );

}