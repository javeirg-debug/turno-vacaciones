"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import { supabase } from "@/lib/supabase";
import {
  obtenerTodasLasSolicitudes,
} from "@/services/solicitudes";

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const inicioTurno = new Date(2026, 6, 16);

type Solicitud = {
  id: string;
  usuario_id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
};

type Vista = "mensual" | "anual";


/* =========================
   TURNOS
========================= */

function obtenerTurno(
  dia: number,
  mes: number,
  anio: number
) {

  const fecha = new Date(
    anio,
    mes,
    dia
  );

  const diferencia = Math.floor(
    (fecha.getTime() - inicioTurno.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const ciclo =
    ((diferencia % 12) + 12) % 12;

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


function esDiaTrabajo(
  dia: number,
  mes: number,
  anio: number
) {

  return (
    obtenerTurno(
      dia,
      mes,
      anio
    ) !== "⚪ Libre"
  );

}


/* =========================
   VISUAL PERMISOS
========================= */

function obtenerVisual(
  tipo: string
) {

  switch (tipo) {

    case "🌴 Vacaciones":
      return {
        abreviatura: "VAC",
        nombre: "Vacaciones",
        color: "bg-teal-500",
      };

    case "🟢 AP":
      return {
        abreviatura: "AP",
        nombre: "Asunto Propio",
        color: "bg-sky-500",
      };

    case "⏰ Compensación horaria":
      return {
        abreviatura: "CH",
        nombre: "Compensación horaria",
        color: "bg-slate-600",
      };

    case "🤒 Indisposición":
      return {
        abreviatura: "IND",
        nombre: "Indisposición",
        color: "bg-red-500",
      };

    case "🎄 Navidad":
      return {
        abreviatura: "NAV",
        nombre: "Navidad",
        color: "bg-indigo-500",
      };

    case "✝️ Semana Santa":
      return {
        abreviatura: "SS",
        nombre: "Semana Santa",
        color: "bg-violet-500",
      };

    case "👶 Paternidad":
      return {
        abreviatura: "PAT",
        nombre: "Paternidad",
        color: "bg-blue-500",
      };

    case "🤰 Maternidad":
      return {
        abreviatura: "MAT",
        nombre: "Maternidad",
        color: "bg-pink-500",
      };

    case "🍼 Lactancia":
      return {
        abreviatura: "LAC",
        nombre: "Lactancia",
        color: "bg-amber-500",
      };

    case "📄 Otros permisos":
      return {
        abreviatura: "OT",
        nombre: "Otros permisos",
        color: "bg-fuchsia-500",
      };

    case "🚨 Permiso urgente":
      return {
        abreviatura: "URG",
        nombre: "Permiso urgente",
        color: "bg-orange-500",
      };

    default:
      return null;
  }

}


/* =========================
   DIAS DEL MES
========================= */

function obtenerHuecosMes(
  mes: number,
  anio: number
) {

  const primerDia =
    new Date(
      anio,
      mes,
      1
    ).getDay();

  return primerDia === 0
    ? 6
    : primerDia - 1;

}


function obtenerDiasMes(
  mes: number,
  anio: number
) {

  return new Date(
    anio,
    mes + 1,
    0
  ).getDate();

}


export default function MiCalendario() {

  const router = useRouter();

  const hoy = new Date();

  const [vista, setVista] =
    useState<Vista>("mensual");

  const [mes, setMes] =
    useState(
      hoy.getMonth()
    );

  const [anio, setAnio] =
    useState(
      hoy.getFullYear()
    );

  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>([]);

  const [mostrarLeyenda, setMostrarLeyenda] =
    useState(false);

  const [cargando, setCargando] =
    useState(true);


  /* =========================
     CARGAR SOLO MIS PERMISOS
  ========================= */

  useEffect(() => {

    async function cargar() {

      try {

        const {
          data: { user },
        } =
          await supabase.auth.getUser();

        if (!user) {
          setSolicitudes([]);
          return;
        }

        const datos =
          await obtenerTodasLasSolicitudes();

        const misSolicitudes =
          (datos || []).filter(
            (solicitud: Solicitud) =>
              solicitud.usuario_id ===
              user.id
          );

        setSolicitudes(
          misSolicitudes
        );

      } catch (error) {

        console.error(
          "Error cargando mis permisos:",
          error
        );

      } finally {

        setCargando(false);

      }

    }

    cargar();

  }, []);


  /* =========================
     CAMBIAR MES
  ========================= */

  function cambiarMes(
    valor: number
  ) {

    let nuevoMes =
      mes + valor;

    let nuevoAnio =
      anio;

    if (nuevoMes > 11) {

      nuevoMes = 0;
      nuevoAnio++;

    }

    if (nuevoMes < 0) {

      nuevoMes = 11;
      nuevoAnio--;

    }

    setMes(nuevoMes);
    setAnio(nuevoAnio);

  }


  /* =========================
     CAMBIAR AÑO
  ========================= */

  function cambiarAnio(
    valor: number
  ) {

    setAnio(
      anio + valor
    );

  }


  /* =========================
     IR A HOY
  ========================= */

  function irHoy() {

    setMes(
      hoy.getMonth()
    );

    setAnio(
      hoy.getFullYear()
    );

  }


  /* =========================
     PERMISO DE UN DIA
  ========================= */

  function obtenerSolicitudDia(
    dia: number,
    mesBusqueda: number,
    anioBusqueda: number
  ) {

    const fecha =
      `${anioBusqueda}-${String(
        mesBusqueda + 1
      ).padStart(2, "0")}-${String(
        dia
      ).padStart(2, "0")}`;

    return solicitudes.find(
      (solicitud) =>
        fecha >= solicitud.fecha_inicio &&
        fecha <= solicitud.fecha_fin
    );

  }


  /* =========================
     LEYENDA
  ========================= */

  const leyenda = [

    {
      abreviatura: "VAC",
      nombre: "Vacaciones",
      color: "bg-teal-500",
    },

    {
      abreviatura: "AP",
      nombre: "Asunto Propio",
      color: "bg-sky-500",
    },

    {
      abreviatura: "CH",
      nombre: "Compensación horaria",
      color: "bg-slate-600",
    },

    {
      abreviatura: "IND",
      nombre: "Indisposición",
      color: "bg-red-500",
    },

    {
      abreviatura: "NAV",
      nombre: "Navidad",
      color: "bg-indigo-500",
    },

    {
      abreviatura: "SS",
      nombre: "Semana Santa",
      color: "bg-violet-500",
    },

    {
      abreviatura: "PAT",
      nombre: "Paternidad",
      color: "bg-blue-500",
    },

    {
      abreviatura: "MAT",
      nombre: "Maternidad",
      color: "bg-pink-500",
    },

    {
      abreviatura: "LAC",
      nombre: "Lactancia",
      color: "bg-amber-500",
    },

    {
      abreviatura: "OT",
      nombre: "Otros permisos",
      color: "bg-fuchsia-500",
    },

    {
      abreviatura: "URG",
      nombre: "Permiso urgente",
      color: "bg-orange-500",
    },

  ];


  /* =========================
     RENDER
  ========================= */

  return (

    <main
      className="
        min-h-screen
        bg-slate-100
        p-6
        pb-24
      "
    >

      {/* =========================
          CABECERA
      ========================= */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            text-slate-800
          "
        >
          📅 Mi calendario
        </h1>


        <button
          type="button"
          onClick={() =>
            setMostrarLeyenda(true)
          }
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-blue-100
            text-blue-700
            shadow
            transition
            hover:bg-blue-200
          "
          aria-label="Información"
        >
          ℹ️
        </button>

      </div>


      <p
        className="
          mt-2
          text-slate-500
        "
      >
        Consulta tus permisos en el calendario.
      </p>


      {/* =========================
          SELECTOR
      ========================= */}

      <div
        className="
          mt-5
          flex
          rounded-2xl
          bg-slate-200
          p-1
        "
      >

        <button
          type="button"
          onClick={() =>
            setVista("mensual")
          }
          className={`
            flex-1
            rounded-xl
            py-2.5
            text-sm
            font-bold
            transition
            ${
              vista === "mensual"
                ? "bg-white text-slate-800 shadow"
                : "text-slate-500 hover:text-slate-700"
            }
          `}
        >
           Mensual
        </button>


        <button
          type="button"
          onClick={() =>
            setVista("anual")
          }
          className={`
            flex-1
            rounded-xl
            py-2.5
            text-sm
            font-bold
            transition
            ${
              vista === "anual"
                ? "bg-white text-slate-800 shadow"
                : "text-slate-500 hover:text-slate-700"
            }
          `}
        >
           Anual
        </button>

      </div>


      {/* =====================================================
          VISTA MENSUAL
      ===================================================== */}

      {vista === "mensual" && (

        <div
          className="
            mt-6
            rounded-3xl
            bg-white
            p-2
            shadow
          "
        >

          {/* MES */}

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <button
              type="button"
              onClick={() =>
                cambiarMes(-1)
              }
              className="
                rounded-xl
                bg-slate-200
                px-4
                py-2
                transition
                hover:bg-slate-300
              "
            >
              ◀
            </button>


            <h2
              className="
                text-xl
                font-bold
                text-slate-800
              "
            >
              {meses[mes]} {anio}
            </h2>


            <button
              type="button"
              onClick={() =>
                cambiarMes(1)
              }
              className="
                rounded-xl
                bg-slate-200
                px-4
                py-2
                transition
                hover:bg-slate-300
              "
            >
              ▶
            </button>

          </div>


          {/* HOY */}

          <button
            type="button"
            onClick={irHoy}
            className="
              mt-4
              w-full
              rounded-xl
              bg-blue-600
              py-2
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            Hoy
          </button>


          {/* DIAS SEMANA */}

          <div
            className="
              mt-6
              grid
              grid-cols-7
              text-center
              font-semibold
              text-slate-500
            "
          >

            <div>L</div>
            <div>M</div>
            <div>X</div>
            <div>J</div>
            <div>V</div>
            <div>S</div>
            <div>D</div>

          </div>


          {/* CALENDARIO */}

          <div
            className="
              grid
              grid-cols-7
              gap-0
              text-center
            "
          >

            {Array.from({
              length:
                obtenerHuecosMes(
                  mes,
                  anio
                ) +
                obtenerDiasMes(
                  mes,
                  anio
                ),
            }).map(
              (_, indice) => {

                const huecos =
                  obtenerHuecosMes(
                    mes,
                    anio
                  );

                if (
                  indice < huecos
                ) {

                  return (
                    <div
                      key={indice}
                      className="
                        aspect-square
                        border
                        border-slate-200
                      "
                    />
                  );

                }


                const dia =
                  indice -
                  huecos +
                  1;


                const turno =
                  obtenerTurno(
                    dia,
                    mes,
                    anio
                  );


                const solicitud =
                  obtenerSolicitudDia(
                    dia,
                    mes,
                    anio
                  );


                const visual =
                  solicitud
                    ? obtenerVisual(
                        solicitud.tipo
                      )
                    : null;


                const esHoy =
                  dia === hoy.getDate() &&
                  mes === hoy.getMonth() &&
                  anio === hoy.getFullYear();


                return (

                  <div
                    key={indice}
                    onClick={() => {

                      const fecha =
                        `${anio}-${String(
                          mes + 1
                        ).padStart(
                          2,
                          "0"
                        )}-${String(
                          dia
                        ).padStart(
                          2,
                          "0"
                        )}`;

                      router.push(
                        `/calendario/${fecha}`
                      );

                    }}
                    className={`
                      relative
                      flex
                      aspect-square
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      overflow-hidden
                      border
                      border-slate-200
                      p-1
                      transition
                      hover:brightness-95

                      ${
                        visual
                          ? `${visual.color} text-white`
                          : esDiaTrabajo(
                              dia,
                              mes,
                              anio
                            )
                          ? "bg-slate-50 text-slate-700"
                          : "bg-white text-slate-400"
                      }

                      ${
                        esHoy
                          ? "z-10 rounded-lg ring-2 ring-blue-500"
                          : ""
                      }
                    `}
                  >

                   {/* DIA + TURNO */}

<div
  className="
    flex
    items-center
    justify-center
    gap-1
  "
>
  <span
    className="
      text-sm
      font-bold
    "
  >
    {dia}
  </span>

  <span
    className="
      text-[11px]
      leading-none
    "
  >
    {turno.split(" ")[0]}
  </span>
</div>


{/* ABREVIATURA PERMISO */}

{visual && (

  <span
    className="
      mt-1
      text-[10px]
      font-extrabold
      leading-none
    "
  >
    {visual.abreviatura}
  </span>

)}

                  </div>

                );

              }
            )}

          </div>


          {cargando && (

            <p
              className="
                mt-4
                text-center
                text-sm
                text-slate-400
              "
            >
              Cargando permisos...
            </p>

          )}

        </div>

      )}


      {/* =====================================================
          VISTA ANUAL
      ===================================================== */}

      {vista === "anual" && (

        <div
          className="
            mt-6
            rounded-3xl
            bg-white
            p-4
            shadow
          "
        >

          {/* AÑO */}

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <button
              type="button"
              onClick={() =>
                cambiarAnio(-1)
              }
              className="
                rounded-xl
                bg-slate-200
                px-4
                py-2
                transition
                hover:bg-slate-300
              "
            >
              ◀
            </button>


            <h2
              className="
                text-xl
                font-bold
                text-slate-800
              "
            >
              {anio}
            </h2>


            <button
              type="button"
              onClick={() =>
                cambiarAnio(1)
              }
              className="
                rounded-xl
                bg-slate-200
                px-4
                py-2
                transition
                hover:bg-slate-300
              "
            >
              ▶
            </button>

          </div>


          {/* 12 MESES */}

          <div
            className="
              mt-6
              grid
              grid-cols-2
              gap-4
            "
          >

            {meses.map(
              (nombreMes, indiceMes) => {

                const huecos =
                  obtenerHuecosMes(
                    indiceMes,
                    anio
                  );

                const diasMes =
                  obtenerDiasMes(
                    indiceMes,
                    anio
                  );


                return (

                  <div
  key={nombreMes}
  onClick={() => {
    setMes(indiceMes);
    setVista("mensual");
  }}
  className="
    cursor-pointer
    rounded-2xl
    bg-slate-100
    p-3
    shadow-sm
    transition
    hover:bg-slate-200
    active:scale-[0.98]
  "
>

                    {/* NOMBRE MES */}

                    <h3
                      className="
                        text-center
                        text-sm
                        font-bold
                        text-slate-800
                      "
                    >
                      {nombreMes}
                    </h3>


                    {/* DIAS SEMANA */}

                    <div
                      className="
                        mt-2
                        grid
                        grid-cols-7
                        text-center
                        text-[8px]
                        font-bold
                        text-slate-400
                      "
                    >

                      <div>L</div>
                      <div>M</div>
                      <div>X</div>
                      <div>J</div>
                      <div>V</div>
                      <div>S</div>
                      <div>D</div>

                    </div>


                    {/* DIAS */}

                    <div
                      className="
                        mt-1
                        grid
                        grid-cols-7
                        gap-1
                      "
                    >

                      {Array.from({
                        length:
                          huecos +
                          diasMes,
                      }).map(
                        (_, indiceDia) => {

                          if (
                            indiceDia <
                            huecos
                          ) {

                            return (
                              <div
                                key={
                                  indiceDia
                                }
                                className="
                                  aspect-square
                                "
                              />
                            );

                          }


                          const dia =
                            indiceDia -
                            huecos +
                            1;


                          const turno =
                            obtenerTurno(
                              dia,
                              indiceMes,
                              anio
                            );


                          const trabajo =
                            esDiaTrabajo(
                              dia,
                              indiceMes,
                              anio
                            );


                          const solicitud =
                            obtenerSolicitudDia(
                              dia,
                              indiceMes,
                              anio
                            );


                          const visual =
                            solicitud
                              ? obtenerVisual(
                                  solicitud.tipo
                                )
                              : null;


                          const esHoy =
                            dia ===
                              hoy.getDate() &&
                            indiceMes ===
                              hoy.getMonth() &&
                            anio ===
                              hoy.getFullYear();


                          return (

                            <div
                              key={
                                indiceDia
                              }
                              className={`
                                relative
                                flex
                                aspect-square
                                flex-col
                                items-center
                                justify-center
                                overflow-hidden
                                rounded
                                text-[9px]
                                font-bold

                                ${
                                  visual
                                    ? `${visual.color} text-white`
                                    : trabajo
                                    ? "bg-slate-200 text-slate-700"
                                    : "bg-white text-slate-400"
                                }

                                ${
                                  esHoy
                                    ? "ring-2 ring-blue-500"
                                    : ""
                                }
                              `}
                            >

                              <span>
                                {dia}
                              </span>





                              {/* PERMISO */}

                              {visual && (

                                <span
                                  className="
                                    text-[6px]
                                    font-extrabold
                                    leading-none
                                  "
                                >
                                  {
                                    visual.abreviatura
                                  }
                                </span>

                              )}

                            </div>

                          );

                        }
                      )}

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </div>

      )}


      {/* =====================================================
          LEYENDA
      ===================================================== */}

      {mostrarLeyenda && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
          onClick={() =>
            setMostrarLeyenda(false)
          }
        >

          <div
            className="
              max-h-[85vh]
              w-full
              max-w-sm
              overflow-y-auto
              rounded-3xl
              bg-white
              p-6
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-lg
                  font-bold
                  text-slate-800
                "
              >
                Leyenda
              </h2>


              <button
                type="button"
                onClick={() =>
                  setMostrarLeyenda(false)
                }
                className="
                  rounded-full
                  bg-slate-200
                  px-3
                  py-1
                  transition
                  hover:bg-slate-300
                "
              >
                ✕
              </button>

            </div>


            <p
              className="
                mb-5
                text-sm
                text-slate-500
              "
            >
              Los colores indican el tipo de
              permiso registrado.
            </p>


            <div className="space-y-3">

              {leyenda.map(
                (permiso) => (

                  <div
                    key={
                      permiso.abreviatura
                    }
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        ${permiso.color}
                        text-[9px]
                        font-extrabold
                        text-white
                        shadow-sm
                      `}
                    >
                      {
                        permiso.abreviatura
                      }
                    </div>


                    <span
                      className="
                        text-sm
                        font-semibold
                        text-slate-700
                      "
                    >
                      {
                        permiso.nombre
                      }
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      )}


      <BottomNav />

    </main>

  );
}