"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Turno = "Mañana" | "Tarde" | "Noche" | "Libre";

type CalendarioOrdenServicioProps = {
  onSeleccionarFecha: (fecha: string) => void;
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

  return Math.floor(
    diferencia / CICLO.length
  ) + 1;
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
        className="h-4 w-4"
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
        className="h-4 w-4"
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

  return null;
}

export default function CalendarioOrdenServicio({
  onSeleccionarFecha,
}: CalendarioOrdenServicioProps) {
  const ahora = new Date();

  const [anio, setAnio] = useState(
    ahora.getFullYear()
  );

  const [mes, setMes] = useState(
    ahora.getMonth()
  );

  const [fechasConOrden, setFechasConOrden] =
    useState<Set<string>>(new Set());

  const [cargandoOrdenes, setCargandoOrdenes] =
    useState(true);

  async function cargarOrdenes() {
    setCargandoOrdenes(true);

    const { data, error } = await supabase
      .from("ordenes_servicio")
      .select("fecha")
      .eq("estado", "confirmada");

    if (error) {
      console.error(
        "Error cargando ordenes_servicio:",
        error
      );

      setFechasConOrden(new Set());
      setCargandoOrdenes(false);
      return;
    }

    const fechas = new Set<string>(
      (data ?? [])
        .map((orden) => orden.fecha)
        .filter(Boolean)
    );

    setFechasConOrden(fechas);
    setCargandoOrdenes(false);
  }

  useEffect(() => {
    cargarOrdenes();
  }, []);

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

  function manejarSeleccionFecha(
    fecha: Date
  ) {
    onSeleccionarFecha(
      convertirFechaTexto(fecha)
    );
  }

  return (
    <section className="w-full rounded-xl bg-white p-2.5 shadow-sm">
      <div className="mb-2.5 flex w-full items-center gap-1.5">
        <div className="flex h-8 shrink-0 items-center overflow-hidden rounded-md border border-slate-300 bg-white">
          <button
            type="button"
            onClick={() =>
              setAnio(
                (actual) =>
                  actual - 1
              )
            }
            className="flex h-full w-7 items-center justify-center text-lg leading-none text-slate-600 active:bg-slate-100"
            aria-label="Año anterior"
          >
            ‹
          </button>

          <span className="flex h-full min-w-[52px] items-center justify-center border-x border-slate-200 px-1 text-xs font-bold text-slate-700">
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
            className="flex h-full w-7 items-center justify-center text-lg leading-none text-slate-600 active:bg-slate-100"
            aria-label="Año siguiente"
          >
            ›
          </button>
        </div>

        <select
          value={mes}
          onChange={(e) =>
            setMes(
              Number(e.target.value)
            )
          }
          className="h-8 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-1.5 text-xs font-semibold text-slate-700 outline-none"
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

        <div className="flex shrink-0 items-center gap-1.5 text-[9px] text-slate-500">
          <span className="flex items-center gap-0.5">
            <span className="font-black text-green-600">
              ✓
            </span>
            Orden
          </span>

          <span className="flex items-center gap-0.5">
            <span className="font-black text-red-500">
              ×
            </span>
            Sin orden
          </span>
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-[42px_1fr] gap-1">
          <div />

          <div className="grid grid-cols-6 gap-1">
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
                className="flex h-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50"
              >
                {iconoTurno(turno)}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-1 space-y-1">
          {ciclos.map((ciclo) => (
            <div
              key={ciclo.numero}
              className="grid grid-cols-[42px_1fr] gap-1"
            >
              <div className="flex min-h-[38px] items-center justify-center rounded-md border border-slate-200 px-0.5 text-center text-[8px] font-bold leading-tight text-slate-500">
                {ciclo.numero}
                <br />
                ciclo
              </div>

              <div className="grid grid-cols-6 gap-1">
                {ciclo.dias.map(
                  (item) => {
                    const fechaTexto =
                      convertirFechaTexto(
                        item.fecha
                      );

                    const tieneOrden =
                      fechasConOrden.has(
                        fechaTexto
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
                        key={fechaTexto}
                        type="button"
                        onClick={() =>
                          manejarSeleccionFecha(
                            item.fecha
                          )
                        }
                        className={`
                          relative
                          flex
                          h-[38px]
                          w-full
                          items-center
                          justify-center
                          rounded-md
                          border
                          bg-slate-50
                          text-xs
                          font-bold
                          text-slate-700
                          transition
                          active:scale-95
                          ${
                            !item.esMesActual
                              ? "opacity-40"
                              : ""
                          }
                          ${
                            esHoy
                              ? "border-2 border-blue-600"
                              : "border-slate-200"
                          }
                        `}
                      >
                        {item.dia}

                        <span
                          className={`
                            absolute
                            bottom-0.5
                            right-1
                            text-[13px]
                            font-black
                            leading-none
                            ${
                              tieneOrden
                                ? "text-green-600"
                                : "text-red-500"
                            }
                          `}
                          aria-label={
                            tieneOrden
                              ? "Tiene orden de servicio"
                              : "No tiene orden de servicio"
                          }
                        >
                          {tieneOrden
                            ? "✓"
                            : "×"}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          ))}

          {ciclos.length === 0 && (
            <div className="px-2 py-5 text-center text-xs text-slate-400">
              No hay ciclos para este mes.
            </div>
          )}
        </div>
      </div>

      {cargandoOrdenes && (
        <div className="mt-2 text-center text-[9px] text-slate-400">
          Comprobando órdenes...
        </div>
      )}
    </section>
  );
}