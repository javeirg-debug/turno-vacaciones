"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/navigation/BottomNav";
import { obtenerTodasLasSolicitudes } from "@/services/solicitudes";
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
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;

  usuarios: {
    nombre: string;
    puesto: string;
  } | null;
};

type ConfiguracionOcupacion = {
  id: string;
  color: string;
  minimo: number;
  maximo: number;
};

type Vista = "mensual" | "anual";

/* =====================================================
   TURNOS
===================================================== */

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

/* =====================================================
   SABER SI ES DIA DE TRABAJO
===================================================== */

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

/* =====================================================
   DIAS DEL MES
===================================================== */

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

/* =====================================================
   HUECOS DEL MES
===================================================== */

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

/* =====================================================
   CALENDARIO
===================================================== */

export default function Calendario() {
  const router = useRouter();

  const hoy = new Date();

  const searchParams =
    useSearchParams();

  const mesUrl =
    searchParams.get("mes");

  const anioUrl =
    searchParams.get("anio");

  /* =====================================================
     VISTA
  ===================================================== */

  const [vista, setVista] =
    useState<Vista>("mensual");

  /* =====================================================
     MES
  ===================================================== */

  const [mes, setMes] =
    useState(
      mesUrl
        ? Number(mesUrl)
        : hoy.getMonth()
    );

  /* =====================================================
     AÑO
  ===================================================== */

  const [anio, setAnio] =
    useState(
      anioUrl
        ? Number(anioUrl)
        : hoy.getFullYear()
    );

  /* =====================================================
     SOLICITUDES
  ===================================================== */

  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>([]);

  /* =====================================================
     CONFIGURACION
  ===================================================== */

  const [configuracion, setConfiguracion] =
    useState<ConfiguracionOcupacion[]>([]);

  /* =====================================================
     FECHAS CONFLICTIVAS
  ===================================================== */

  const [
    fechasConflictivas,
    setFechasConflictivas,
  ] =
    useState<FechaConflictiva[] | null>(null);

  /* =====================================================
     LEYENDA
  ===================================================== */

  const [
    mostrarLeyenda,
    setMostrarLeyenda,
  ] =
    useState(false);

  /* =====================================================
     CARGA INICIAL
  ===================================================== */

  useEffect(() => {
    cargarSolicitudes();
    cargarConfiguracion();
  }, []);

  /* =====================================================
     SINCRONIZAR URL
  ===================================================== */

  useEffect(() => {
    const nuevoMes =
      searchParams.get("mes");

    const nuevoAnio =
      searchParams.get("anio");

    if (
      nuevoMes &&
      nuevoAnio
    ) {
      setMes(
        Number(nuevoMes)
      );

      setAnio(
        Number(nuevoAnio)
      );
    }
  }, [searchParams]);

  /* =====================================================
     CARGAR CONFLICTOS DEL MES
  ===================================================== */

  useEffect(() => {
    cargarConflictosMes();
  }, [mes, anio]);

  /* =====================================================
     SOLICITUDES
  ===================================================== */

  async function cargarSolicitudes() {
    try {
      const datos =
        await obtenerTodasLasSolicitudes();

      setSolicitudes(
        datos || []
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* =====================================================
     CONFIGURACION OCUPACION
  ===================================================== */

  async function cargarConfiguracion() {
    const { data } =
      await supabase
        .from("configuracion_ocupacion")
        .select("*")
        .order("minimo");

    setConfiguracion(
      data || []
    );
  }

  /* =====================================================
     CONFLICTOS
  ===================================================== */

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

  /* =====================================================
     PERSONAS FUERA
  ===================================================== */

  function personasFuera(
    dia: number
  ) {
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

    return solicitudes.filter(
      (s) =>
        fecha >=
          s.fecha_inicio &&
        fecha <=
          s.fecha_fin
    );
  }

  /* =====================================================
     PERSONAS FUERA ANUAL
  ===================================================== */

  function personasFueraAnual(
    dia: number,
    mesBusqueda: number
  ) {
    const fecha =
      `${anio}-${String(
        mesBusqueda + 1
      ).padStart(
        2,
        "0"
      )}-${String(
        dia
      ).padStart(
        2,
        "0"
      )}`;

    return solicitudes.filter(
      (s) =>
        fecha >=
          s.fecha_inicio &&
        fecha <=
          s.fecha_fin
    ).length;
  }

  /* =====================================================
     COLOR
  ===================================================== */

  function colorDia(
    personas: number
  ) {
    const regla =
      configuracion.find(
        (c) =>
          personas >=
            c.minimo &&
          personas <=
            c.maximo
      );

    if (!regla) {
      return "bg-slate-100";
    }

    if (
      regla.color ===
      "verde"
    ) {
      return "bg-green-200";
    }

    if (
      regla.color ===
      "amarillo"
    ) {
      return "bg-yellow-200";
    }

    if (
      regla.color ===
      "naranja"
    ) {
      return "bg-orange-200";
    }

    if (
      regla.color ===
      "rojo"
    ) {
      return "bg-red-200";
    }

    return "bg-slate-100";
  }

  /* =====================================================
     CAMBIAR MES
  ===================================================== */

  function cambiarMes(
    valor: number
  ) {
    let nuevoMes =
      mes + valor;

    let nuevoAnio =
      anio;

    if (
      nuevoMes > 11
    ) {
      nuevoMes = 0;
      nuevoAnio++;
    }

    if (
      nuevoMes < 0
    ) {
      nuevoMes = 11;
      nuevoAnio--;
    }

    setMes(
      nuevoMes
    );

    setAnio(
      nuevoAnio
    );
  }

  /* =====================================================
     CAMBIAR AÑO
  ===================================================== */

  function cambiarAnio(
    valor: number
  ) {
    setAnio(
      anio + valor
    );
  }

  /* =====================================================
     IR A HOY
  ===================================================== */

  function irHoy() {
    setMes(
      hoy.getMonth()
    );

    setAnio(
      hoy.getFullYear()
    );
  }

  /* =====================================================
     CALENDARIO MENSUAL
  ===================================================== */

  const primerDia =
    new Date(
      anio,
      mes,
      1
    ).getDay();

  const diasMes =
    new Date(
      anio,
      mes + 1,
      0
    ).getDate();

  const huecos =
    primerDia === 0
      ? 6
      : primerDia - 1;

  const dias: (
    number | null
  )[] = [];

  for (
    let i = 0;
    i < huecos;
    i++
  ) {
    dias.push(null);
  }

  for (
    let i = 1;
    i <= diasMes;
    i++
  ) {
    dias.push(i);
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="
      min-h-screen
      bg-slate-100
      p-6
      pb-24
    ">

      {/* =================================================
          CABECERA
      ================================================= */}

      <div className="
        mb-6
        flex
        items-center
        justify-between
      ">

        <h1 className="
          text-3xl
          font-bold
        ">
          📅 Calendario
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

      {/* =================================================
          SELECTOR MENSUAL / ANUAL
      ================================================= */}

      <div className="
        flex
        rounded-2xl
        bg-slate-200
        p-1
      ">

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

      {/* =================================================
          VISTA MENSUAL
      ================================================= */}

      {vista === "mensual" && (

        <>

          <div className="
            mt-6
            rounded-2xl
            bg-white
            p-2
            shadow
          ">

            {/* MES */}

            <div className="
              flex
              items-center
              justify-between
            ">

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

              <h2 className="
                text-xl
                font-bold
              ">
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
                text-white
                transition
                hover:bg-blue-700
              "
            >
              Hoy
            </button>

            {/* DIAS SEMANA */}

            <div className="
              mt-6
              grid
              grid-cols-7
              gap-0
              text-center
              font-semibold
            ">

              <div>L</div>
              <div>M</div>
              <div>X</div>
              <div>J</div>
              <div>V</div>
              <div>S</div>
              <div>D</div>

            </div>

            {/* CALENDARIO */}

            <div className="
              grid
              grid-cols-7
              gap-0
              text-center
            ">

              {dias.map(
                (
                  dia,
                  index
                ) => {

                  const fuera =
                    dia
                      ? personasFuera(
                          dia
                        )
                      : [];

                  return (

                    <div
                      key={index}
                      onClick={() => {

                        if (
                          dia
                        ) {

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

                          window.location.href =
                            `/calendario/${fecha}`;
                        }

                      }}
                      className={`
                        aspect-square
                        overflow-hidden
                        border
                        border-slate-200
                        p-1
                        text-xs
                        cursor-pointer

                        ${
                          dia
                            ? obtenerTurno(
                                dia,
                                mes,
                                anio
                              ) ===
                              "⚪ Libre"
                              ? "bg-white"
                              : colorDia(
                                  fuera.length
                                )
                            : ""
                        }

                        ${
  dia === hoy.getDate() &&
  mes === hoy.getMonth() &&
  anio === hoy.getFullYear()
    ? "relative z-10 rounded-lg ring-2 ring-blue-500 ring-inset"
    : ""
}
                      `}
                    >

                      {dia && (

                        <>

                          {/* DIA + TURNO */}

                          <div className="
                            flex
                            items-center
                            justify-center
                            gap-1
                            font-bold
                            text-sm
                          ">

                            <span>
                              {dia}
                            </span>

                            <span>
                              {obtenerTurno(
                                dia,
                                mes,
                                anio
                              ).split(
                                " "
                              )[0]}
                            </span>

                          </div>

                          {/* PERSONAS */}

                          {obtenerTurno(
                            dia,
                            mes,
                            anio
                          ) !==
                            "⚪ Libre" &&
                            fuera.length >
                              0 && (

                            <div className="
                              mt-1
                              text-[10px]
                              font-semibold
                              text-slate-700
                              sm:text-[11px]
                            ">
                              👤{fuera.length}
                            </div>

                          )}

                        </>

                      )}

                    </div>

                  );

                }
              )}

            </div>

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
                ? "⏳ Fechas conflictivas"
                : fechasConflictivas.length >
                  0
                ? "🚨 Fechas conflictivas"
                : "✅ Fechas conflictivas"}

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

                            · 👥{" "}
                            {
                              f.gac +
                              f.seguridad +
                              f.sala
                            }

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
                              text-xs
                              text-slate-500
                            ">
                              🚓 G.A.C.:{" "}
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
                              text-xs
                              text-slate-500
                            ">
                              🛡️ Seguridad:{" "}
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
                              text-xs
                              text-slate-500
                            ">
                              🖥️ Sala:{" "}
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

      {/* =================================================
          VISTA ANUAL
      ================================================= */}

      {vista === "anual" && (

        <div className="
          mt-6
          rounded-3xl
          bg-white
          p-4
          shadow
        ">

          {/* AÑO */}

          <div className="
            flex
            items-center
            justify-between
          ">

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

            <h2 className="
              text-xl
              font-bold
              text-slate-800
            ">
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

          <div className="
            mt-6
            grid
            grid-cols-2
            gap-4
          ">

            {meses.map(
              (
                nombreMes,
                indiceMes
              ) => {

                const huecosMes =
                  obtenerHuecosMes(
                    indiceMes,
                    anio
                  );

                const diasMesAnual =
                  obtenerDiasMes(
                    indiceMes,
                    anio
                  );

                return (

                  <div
                    key={nombreMes}
                    onClick={() => {

                      setMes(
                        indiceMes
                      );

                      setVista(
                        "mensual"
                      );

                    }}
                    className="
                      cursor-pointer
                      rounded-2xl
                      bg-slate-100
                      p-3
                      shadow-sm
                      transition
                      hover:bg-slate-200
                    "
                  >

                    {/* MES */}

                    <h3 className="
                      text-center
                      text-sm
                      font-bold
                      text-slate-800
                    ">
                      {nombreMes}
                    </h3>

                    {/* DIAS SEMANA */}

                    <div className="
                      mt-2
                      grid
                      grid-cols-7
                      text-center
                      text-[8px]
                      font-bold
                      text-slate-400
                    ">

                      <div>L</div>
                      <div>M</div>
                      <div>X</div>
                      <div>J</div>
                      <div>V</div>
                      <div>S</div>
                      <div>D</div>

                    </div>

                    {/* DIAS */}

                    <div className="
                      mt-1
                      grid
                      grid-cols-7
                      gap-1
                    ">

                      {Array.from({
                        length:
                          huecosMes +
                          diasMesAnual,
                      }).map(
                        (
                          _,
                          indiceDia
                        ) => {

                          if (
                            indiceDia <
                            huecosMes
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
                            huecosMes +
                            1;

                          const trabajo =
                            esDiaTrabajo(
                              dia,
                              indiceMes,
                              anio
                            );

                          const personas =
                            personasFueraAnual(
                              dia,
                              indiceMes
                            );

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
                                items-center
                                justify-center
                                overflow-hidden
                                rounded
                                text-[9px]
                                font-bold

                                ${
                                  trabajo
                                    ? colorDia(
                                        personas
                                      )
                                    : "bg-white text-slate-400"
                                }

                                ${
  trabajo
    ? colorDia(personas)
    : "bg-white text-slate-400"
}

${
  esHoy
    ? "ring-2 ring-blue-500"
    : ""
}
                              `}
                            >

                              {/* SOLO NUMERO
                                  SIN SIMBOLO DE TURNO */}

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


      {/* =================================================
          LEYENDA
      ================================================= */}

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
          "
          onClick={() =>
            setMostrarLeyenda(false)
          }
        >

          <div
            className="
              w-80
              rounded-2xl
              bg-white
              p-6
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="
              mb-4
              flex
              items-center
              justify-between
            ">

              <h2 className="
                text-lg
                font-bold
              ">
                ¿Cómo funciona?
              </h2>

              <button
                type="button"
                onClick={() =>
                  setMostrarLeyenda(
                    false
                  )
                }
                className="
                  rounded-full
                  bg-slate-200
                  px-3
                  py-1
                "
              >
                ✕
              </button>

            </div>

            <p className="
              mb-5
              text-sm
              text-slate-600
            ">
              El color de cada día representa la ocupación prevista según el número de personas de permiso.
            </p>

            <h3 className="
              mb-3
              text-base
              font-bold
            ">
              Leyenda
            </h3>

            <div className="
              space-y-3
              text-sm
            ">

              {configuracion.map(
                (c) => {

                  let color =
                    "bg-slate-200";

                  if (
                    c.color ===
                    "verde"
                  ) {
                    color =
                      "bg-green-200";
                  }

                  if (
                    c.color ===
                    "amarillo"
                  ) {
                    color =
                      "bg-yellow-200";
                  }

                  if (
                    c.color ===
                    "naranja"
                  ) {
                    color =
                      "bg-orange-200";
                  }

                  if (
                    c.color ===
                    "rojo"
                  ) {
                    color =
                      "bg-red-200";
                  }

                  return (

                    <div
                      key={c.id}
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className={`
                          h-5
                          w-5
                          rounded
                          ${color}
                        `}
                      />

                      {c.minimo} -{" "}
                      {c.maximo} Personas

                    </div>

                  );

                }
              )}

            </div>

          </div>

        </div>

      )}

      {/* =================================================
          BOTTOM NAV
      ================================================= */}

      <BottomNav />

    </main>
  );
}