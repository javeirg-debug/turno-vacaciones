
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import BottomNav from "@/components/navigation/BottomNav";
import GenerarIndicativos from "@/components/ordenservicio/GenerarIndicativos";

type Turno = "Mañana" | "Tarde" | "Noche" | "Libre";

type ConfiguracionOcupacion = {
  minimo: number;
  maximo: number;
  color: string;
};

type Solicitud = {
  fecha_inicio: string;
  fecha_fin: string;
};

const CICLO: Turno[] = [
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

// 05/01/2026 = día 1 del ciclo 1
const FECHA_INICIO = new Date(2026, 0, 5);

const MESES = [
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

const TURNOS_TRABAJO: Turno[] = [
  "Mañana",
  "Tarde",
  "Noche",
];

function convertirFechaTexto(fecha: Date) {
  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0"),
  ].join("-");
}

function obtenerPosicionCiclo(fecha: Date) {
  const fechaInicio = new Date(
    FECHA_INICIO.getFullYear(),
    FECHA_INICIO.getMonth(),
    FECHA_INICIO.getDate()
  );

  const fechaActual = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate()
  );

  const diferencia = Math.round(
    (fechaActual.getTime() - fechaInicio.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    ((diferencia % CICLO.length) + CICLO.length) %
    CICLO.length
  );
}

function obtenerTurno(fecha: Date): Turno {
  return CICLO[obtenerPosicionCiclo(fecha)];
}

function obtenerInicioCiclo(fecha: Date) {
  const posicion = obtenerPosicionCiclo(fecha);

  const inicio = new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate()
  );

  inicio.setDate(inicio.getDate() - posicion);

  return inicio;
}

function obtenerNumeroCiclo(inicioCiclo: Date) {
  const diferencia = Math.round(
    (inicioCiclo.getTime() -
      FECHA_INICIO.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return Math.floor(diferencia / CICLO.length) + 1;
}

/*
 * ICONOS DE TURNOS
 */
function iconoTurno(turno: string) {
  if (turno === "Mañana") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
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

  if (turno === "Tarde") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
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

  if (turno === "Noche") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
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

  if (turno === "Libre") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-5 w-5"
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

  return null;
}

export default function OrdenServicio() {
  const router = useRouter();

  /*
   * MES Y AÑO ACTUALES AUTOMÁTICAMENTE
   */
  const ahora = new Date();

  const [anio, setAnio] = useState(
    ahora.getFullYear()
  );

  const [mes, setMes] = useState(
    ahora.getMonth()
  );

  const [configuracion, setConfiguracion] =
    useState<ConfiguracionOcupacion[]>([]);

  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>([]);

  /*
   * CARGAR CONFIGURACIÓN DE OCUPACIÓN
   */
  async function cargarConfiguracion() {
    const { data, error } = await supabase
      .from("configuracion_ocupacion")
      .select("*")
      .order("minimo");

    if (error) {
      console.error(
        "Error cargando configuracion_ocupacion:",
        error
      );
      return;
    }

    setConfiguracion(data || []);
  }

  /*
   * CARGAR SOLICITUDES DE VACACIONES
   */
  async function cargarSolicitudes() {
    const { data, error } = await supabase
      .from("vacaciones_con_usuario")
      .select("*");

    if (error) {
      console.error(
        "Error cargando vacaciones_con_usuario:",
        error
      );
      return;
    }

    setSolicitudes(data || []);
  }

  useEffect(() => {
    cargarConfiguracion();
    cargarSolicitudes();
  }, []);

  /*
   * PERSONAS FUERA EN UNA FECHA
   */
  function personasFuera(fecha: Date) {
    const fechaTexto =
      convertirFechaTexto(fecha);

    return solicitudes.filter(
      (s) =>
        fechaTexto >= s.fecha_inicio &&
        fechaTexto <= s.fecha_fin
    );
  }

  /*
   * COLOR SEGÚN OCUPACIÓN
   */
  function colorDia(personas: number) {
    const regla = configuracion.find(
      (c) =>
        personas >= Number(c.minimo) &&
        personas <= Number(c.maximo)
    );

    if (!regla) {
      return "bg-slate-100";
    }

    if (regla.color === "verde") {
      return "bg-green-200";
    }

    if (regla.color === "amarillo") {
      return "bg-yellow-200";
    }

    if (regla.color === "naranja") {
      return "bg-orange-200";
    }

    if (regla.color === "rojo") {
      return "bg-red-200";
    }

    return "bg-slate-100";
  }

  /*
   * GENERAR CICLOS DEL MES
   */
  const ciclos = useMemo(() => {
    const primerDiaMes = new Date(
      anio,
      mes,
      1
    );

    const ultimoDiaMes = new Date(
      anio,
      mes + 1,
      0
    );

    let inicioCiclo =
      obtenerInicioCiclo(primerDiaMes);

    const resultado: {
      numero: number;
      dias: {
        fecha: Date;
        dia: number;
        turno: Turno;
        esMesActual: boolean;
      }[];
    }[] = [];

    while (inicioCiclo <= ultimoDiaMes) {
      const numeroCiclo =
        obtenerNumeroCiclo(inicioCiclo);

      if (numeroCiclo >= 1) {
        const diasTrabajados: {
          fecha: Date;
          dia: number;
          turno: Turno;
          esMesActual: boolean;
        }[] = [];

        for (
          let i = 0;
          i < CICLO.length;
          i++
        ) {
          const fecha = new Date(
            inicioCiclo
          );

          fecha.setDate(
            inicioCiclo.getDate() + i
          );

          const turno =
            obtenerTurno(fecha);

          if (
            TURNOS_TRABAJO.includes(turno)
          ) {
            diasTrabajados.push({
              fecha,
              dia: fecha.getDate(),
              turno,
              esMesActual:
                fecha.getFullYear() ===
                  anio &&
                fecha.getMonth() === mes,
            });
          }
        }

        const tieneDiasDelMes =
          diasTrabajados.some(
            (dia) =>
              dia.esMesActual
          );

        if (tieneDiasDelMes) {
          resultado.push({
            numero: numeroCiclo,
            dias: diasTrabajados,
          });
        }
      }

      inicioCiclo.setDate(
        inicioCiclo.getDate() +
          CICLO.length
      );
    }

    return resultado;
  }, [anio, mes]);

  /*
   * ABRIR DÍA
   */


  return (
    <main className="min-h-screen bg-slate-100 px-3 pb-24 pt-4">
      {/* CABECERA */}
      <header className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center">
          <svg
            width="30"
            height="30"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="4"
              y="5"
              width="17"
              height="16"
              rx="2.5"
              stroke="#1e293b"
              strokeWidth="1.8"
            />

            <path
              d="M8 3.5V7"
              stroke="#1e293b"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M17 3.5V7"
              stroke="#1e293b"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M4 9H21"
              stroke="#1e293b"
              strokeWidth="1.8"
            />

            <path
              d="M8 13H10"
              stroke="#1e293b"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M13 13H15"
              stroke="#1e293b"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M17 13H18"
              stroke="#1e293b"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M8 17H10"
              stroke="#1e293b"
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M13 17H15"
              stroke="#1e293b"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold leading-tight text-slate-800">
            Orden de servicio
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Organiza los coches patrulla y
            los puestos de la jornada.
          </p>
        </div>
      </header>

      {/* GENERAR INDICATIVOS */}
      <div className="mt-4">
        <GenerarIndicativos />
      </div>

      {/* CALENDARIO — UNA ÚNICA TARJETA */}
      <section className="mt-5 w-full rounded-2xl bg-white p-3 shadow-sm">
        {/* SELECTORES */}
        <div className="mb-4 flex w-full items-center gap-2">
          {/* AÑO */}
          <div className="flex h-10 shrink-0 items-center overflow-hidden rounded-lg border border-slate-300 bg-white">
            <button
              type="button"
              onClick={() =>
                setAnio(
                  (actual) =>
                    actual - 1
                )
              }
              className="flex h-full w-9 items-center justify-center text-xl text-slate-600 active:bg-slate-100"
              aria-label="Año anterior"
            >
              ‹
            </button>

            <span className="flex h-full min-w-[62px] items-center justify-center border-x border-slate-200 px-1 text-sm font-bold text-slate-700">
              {anio}
            </span>

            <button
              type="button"
              onClick={() =>
                setAnio(
                  (actual) =>
                    actual + 1
                )
              }
              className="flex h-full w-9 items-center justify-center text-xl text-slate-600 active:bg-slate-100"
              aria-label="Año siguiente"
            >
              ›
            </button>
          </div>

          {/* MES */}
          <select
            value={mes}
            onChange={(e) =>
              setMes(
                Number(e.target.value)
              )
            }
            className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 text-sm font-semibold text-slate-700 outline-none"
            aria-label="Seleccionar mes"
          >
            {MESES.map(
              (nombre, index) => (
                <option
                  key={nombre}
                  value={index}
                >
                  {nombre}
                </option>
              )
            )}
          </select>
        </div>

        {/* CALENDARIO SIN TARJETAS NI LÍNEAS DIVISORIAS */}
        <div className="w-full">
          {/* CABECERA DE TURNOS */}
          <div className="grid grid-cols-[64px_1fr] gap-2">
            {/* ESPACIO DEL CICLO */}
            <div />

            {/* ICONOS — UNA ÚNICA VEZ */}
            <div className="grid grid-cols-6 gap-2">
              {[
                "Mañana",
                "Mañana",
                "Tarde",
                "Tarde",
                "Noche",
                "Noche",
              ].map((turno, index) => (
                <div
                  key={index}
                  className="flex h-[54px] items-center justify-center rounded-lg border border-slate-300 bg-slate-50"
                >
                  {iconoTurno(turno)}
                </div>
              ))}
            </div>
          </div>

          {/* CICLOS */}
          <div className="mt-2 space-y-2">
            {ciclos.map((ciclo) => (
              <div
                key={ciclo.numero}
                className="grid grid-cols-[64px_1fr] gap-2"
              >
                {/* NÚMERO DE CICLO */}
               <div className="flex min-h-[54px] items-center justify-center rounded-lg border border-slate-300 px-1 text-center text-[10px] font-bold leading-tight text-slate-500">
  {ciclo.numero} ciclo
</div>

                {/* DÍAS */}
                <div className="grid grid-cols-6 gap-2">
                  {ciclo.dias.map(
                    (item) => {
                      const personas =
                        personasFuera(
                          item.fecha
                        ).length;

                      const color =
                        colorDia(
                          personas
                        );

                      const hoy =
                        new Date();

                      const esHoy =
                        item.fecha.getFullYear() ===
                          hoy.getFullYear() &&
                        item.fecha.getMonth() ===
                          hoy.getMonth() &&
                        item.fecha.getDate() ===
                          hoy.getDate();

                      return (

<button
  key={convertirFechaTexto(
    item.fecha
  )}
  type="button"
onClick={() =>
  router.push(
    `/usuarios/ordenservicio/${convertirFechaTexto(item.fecha)}`
  )
}
  className={`
    flex
    h-[54px]
    w-full
    items-center
    justify-center
    rounded-lg
    border
    text-sm
    font-bold
    text-slate-700
    transition
    active:scale-95
    ${color}
    ${
      !item.esMesActual
        ? "opacity-50"
        : ""
    }
    ${
      esHoy
        ? "border-2 border-blue-600"
        : "border-slate-300"
    }
  `}
>
  {item.dia}
</button>

                      );
                    }
                  )}
                </div>
              </div>
            ))}

            {ciclos.length === 0 && (
              <div className="px-3 py-8 text-center text-xs text-slate-400">
                No hay ciclos para este
                mes.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* NAVEGACIÓN INFERIOR */}
      <BottomNav />
    </main>
  );
}