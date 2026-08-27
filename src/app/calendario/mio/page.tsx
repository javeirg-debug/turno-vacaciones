"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import { supabase } from "@/lib/supabase";
import {
  obtenerTodasLasSolicitudes,
} from "@/services/solicitudes";
import {
  obtenerConflictosMes,
  type FechaConflictiva,
} from "@/services/conflictos";

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
  "Mañana",
  "Mañana",

  "Tarde",
  "Tarde",

  "Noche",
  "Noche",

  "Libre",
  "Libre",
  "Libre",
  "Libre",
  "Libre",
  "Libre",
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
    ) !== "Libre"
  );

}

function iconoTurno(turno: string) {

  if (turno === "Mañana") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4"
        aria-hidden="true"
      >
        {/* Sol amarillo completo */}
        <circle
          cx="12"
          cy="12"
          r="4.5"
          fill="#FACC15"
        />

        {/* Rayos */}
        <path
          d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
          stroke="#FACC15"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (turno === "Tarde") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4"
        aria-hidden="true"
      >
        {/* Sol naranja */}
        <path
          d="M7 15a5 5 0 0 1 10 0"
          fill="#F97316"
        />

        {/* Rayos */}
        <path
          d="M12 3v4M5.64 5.64l2.83 2.83M18.36 5.64l-2.83 2.83"
          stroke="#F97316"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Horizonte */}
        <path
          d="M3 17h18"
          stroke="#64748B"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Línea inferior */}
        <path
          d="M6 20h12"
          stroke="#64748B"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (turno === "Noche") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4"
        aria-hidden="true"
      >
        {/* Luna azul oscuro */}
        <path
          d="M20 15.5A8.5 8.5 0 0 1 8.5 4.2
             A8.5 8.5 0 1 0 20 15.5Z"
          fill="#1E3A8A"
          stroke="#172554"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Pequeño brillo */}
        <circle
          cx="7"
          cy="8"
          r="0.8"
          fill="#93C5FD"
        />
      </svg>
    );
  }

  if (turno === "Libre") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-4 w-4"
        aria-hidden="true"
      >
        {/* Día libre */}
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

  return null;
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
     FECHAS CONFLICTIVAS
  ========================= */

  const [
    fechasConflictivas,
    setFechasConflictivas,
  ] =
    useState<FechaConflictiva[] | null>(null);


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
     CARGAR CONFLICTOS DEL MES
  ========================= */

  useEffect(() => {
    cargarConflictosMes();
  }, [mes, anio]);


  /* =========================
     CONFLICTOS
  ========================= */

  async function cargarConflictosMes() {

    setFechasConflictivas(null);

    const conflictos =
      await obtenerConflictosMes(
        mes,
        anio
      );

    console.log(
      JSON.stringify(
        conflictos,
        null,
        2
      )
    );

    setFechasConflictivas(
      conflictos
    );

  }


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

       <h1 className="
  flex
  items-center
  gap-2
  text-3xl
  font-bold
">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-7 w-7"
    aria-hidden="true"
  >
    <rect
      width="18"
      height="18"
      x="3"
      y="4"
      rx="2"
    />
    <line
      x1="16"
      x2="16"
      y1="2"
      y2="6"
    />
    <line
      x1="8"
      x2="8"
      y1="2"
      y2="6"
    />
    <line
      x1="3"
      x2="21"
      y1="10"
      y2="10"
    />
  </svg>

  Mi Calendario
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
    bg-slate-200
    text-slate-600
    shadow
    transition
    hover:bg-slate-300
  "
  aria-label="Información"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="16" y2="12" />
    <line x1="12" x2="12.01" y1="8" y2="8" />
  </svg>
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

        <>

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
    {iconoTurno(turno)}
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


        {/* =================================================
            FECHAS CONFLICTIVAS
            SOLO EN VISTA MENSUAL
        ================================================= */}

        <div
          className={`
            mt-6
            rounded-3xl
            p-4
            shadow

            ${
              fechasConflictivas === null
                ? "border border-slate-200 bg-white"
                : fechasConflictivas.length >
                  0
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
                  : fechasConflictivas.length >
                    0
                  ? "text-red-900"
                  : "text-green-900"
              }
            `}
          >

            {fechasConflictivas ===
            null
              ? <>
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
              : fechasConflictivas.length >
                0
              ? <>
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
              : <>
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
</>}

          </h2>

          {fechasConflictivas ===
          null ? (

            <p className="
              text-sm
              text-slate-500
            ">
              Comprobando ocupación...
            </p>

          ) : fechasConflictivas.length >
            0 ? (

            <>

              <p className="
                mb-3
                text-sm
                text-slate-700
              ">
                Este mes tiene días con alta ocupación:
              </p>

              <div className="
                space-y-2
              ">

                {fechasConflictivas.map(
                  (f) => (

                    <button
                      key={f.fecha}
                      type="button"
                      onClick={() =>
                        router.push(
                          `/calendario/${f.fecha}`
                        )
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

                      {/* FECHA */}

                      <div className="
                        border-y
                        border-red-200
                        py-1
                        text-center
                      ">

                        <p className="
                          text-sm
                          font-bold
                          text-slate-800
                        ">

                          {new Date(
                            f.fecha
                          ).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}

                          <span className="inline-flex items-center gap-1">
  ·
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4 text-slate-600"
    aria-hidden="true"
  >
    <circle cx="9" cy="8" r="4" />
    <path d="M2 21a7 7 0 0 1 14 0H2Z" />
    <path d="M16 4.5a3.5 3.5 0 0 1 0 7" />
    <path d="M17 14a6 6 0 0 1 5 7h-4a7 7 0 0 0-3-5.8" />
  </svg>
  {
    f.gac +
    f.seguridad +
    f.sala
  }
</span>
                        </p>

                      </div>

                      {/* OCUPACION */}

<div className="
  mt-2
  grid
  grid-cols-3
  text-center
">

  <div>
    <p className="
      flex
      items-center
      justify-center
      gap-1
      text-xs
      text-slate-500
    ">
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

      <span className="
        font-bold
        text-slate-800
      ">
        {f.gac}
      </span>
    </p>
  </div>

  <div className="
    border-x
    border-red-200
  ">
    <p className="
      flex
      items-center
      justify-center
      gap-1
      text-xs
      text-slate-500
    ">
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

      <span className="
        font-bold
        text-slate-800
      ">
        {f.seguridad}
      </span>
    </p>
  </div>

  <div>
    <p className="
      flex
      items-center
      justify-center
      gap-1
      text-xs
      text-slate-500
    ">
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
        <rect
          x="3"
          y="4"
          width="18"
          height="13"
          rx="2"
        />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>

      <span>Sala:</span>

      <span className="
        font-bold
        text-slate-800
      ">
        {f.sala}
      </span>
    </p>
  </div>

</div>

                    </button>

                  )
                )}

              </div>

            </>

          ) : (

            <p className="
              text-sm
              text-green-800
            ">
              Este mes no tiene días con alta ocupación.
            </p>

          )}

        </div>

        </>

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