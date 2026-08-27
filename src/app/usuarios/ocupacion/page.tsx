"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/navigation/BottomNav";

type Configuracion = {
  id: string;
  color: string;
  minimo: number;
  maximo: number;
};

export default function Ocupacion() {
  const [configuracion, setConfiguracion] =
    useState<Configuracion[]>([]);

  const [guardando, setGuardando] =
    useState(false);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  async function cargarConfiguracion() {
    const { data, error } = await supabase
      .from("configuracion_ocupacion")
      .select("*")
      .order("minimo");

    console.log("CONFIGURACION:", data);
    console.log("ERROR:", error);

    setConfiguracion(data || []);
  }

  function cambiarValor(
    id: string,
    campo: "minimo" | "maximo",
    valor: number
  ) {
    setConfiguracion((actual) =>
      actual.map((item) =>
        item.id === id
          ? {
              ...item,
              [campo]: valor,
            }
          : item
      )
    );
  }

  async function guardarCambios() {
    setGuardando(true);

    for (const item of configuracion) {
      await supabase
        .from("configuracion_ocupacion")
        .update({
          minimo: item.minimo,
          maximo: item.maximo,
        })
        .eq("id", item.id);
    }

    setGuardando(false);
  }

  function iconoColor(color: string) {
    const colores: Record<string, string> = {
      verde: "text-green-500",
      amarillo: "text-yellow-400",
      naranja: "text-orange-500",
      rojo: "text-red-500",
    };

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`h-5 w-5 ${colores[color] || "text-slate-400"}`}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8" />
      </svg>
    );
  }

  function estiloColor(color: string) {
    if (color === "verde") {
      return {
        fondo: "bg-green-50",
        borde: "border-green-200",
        texto: "text-green-700",
        foco:
          "focus:border-green-400 focus:ring-2 focus:ring-green-100",
      };
    }

    if (color === "amarillo") {
      return {
        fondo: "bg-yellow-50",
        borde: "border-yellow-200",
        texto: "text-yellow-700",
        foco:
          "focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100",
      };
    }

    if (color === "naranja") {
      return {
        fondo: "bg-orange-50",
        borde: "border-orange-200",
        texto: "text-orange-700",
        foco:
          "focus:border-orange-400 focus:ring-2 focus:ring-orange-100",
      };
    }

    if (color === "rojo") {
      return {
        fondo: "bg-red-50",
        borde: "border-red-200",
        texto: "text-red-700",
        foco:
          "focus:border-red-400 focus:ring-2 focus:ring-red-100",
      };
    }

    return {
      fondo: "bg-slate-50",
      borde: "border-slate-200",
      texto: "text-slate-700",
      foco:
        "focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
    };
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      {/* CABECERA */}

      <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-8 w-8"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3a9 9 0 0 0 0 18h1.2a2.3 2.3 0 0 0 0-4.6h-.8a2 2 0 0 1 0-4h3.1A5.5 5.5 0 0 0 21 7.9C19.5 5 16.1 3 12 3Z"
    />
    <circle cx="7.5" cy="9" r="1" fill="currentColor" stroke="none" />
    <circle cx="10" cy="6.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="14" cy="6.5" r="1" fill="currentColor" stroke="none" />
    <circle cx="16.5" cy="9" r="1" fill="currentColor" stroke="none" />
  </svg>

  Configuración de ocupación
</h1>
      <p className="mt-1 text-sm text-slate-500">
        Configura los rangos de ocupación.
      </p>

      {/* INFORMACIÓN */}

      <div
        className="
          mt-5
          rounded-2xl
          border
          border-blue-200
          bg-blue-50
          px-4
          py-3
          shadow-sm
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-blue-100
              text-base
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
              className="h-5 w-5 text-blue-600"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5" />
              <path d="M12 8h.01" />
            </svg>
          </div>

          <div>

            <h2 className="font-bold text-blue-900">
              Niveles de ocupación
            </h2>

            <p className="mt-0.5 text-xs leading-5 text-blue-800">
              Estos rangos determinan el color que se mostrará en el
              calendario según el número de policías de libranza.
              Verde, amarillo, naranja y rojo representan de menor
              a mayor nivel de ocupación.
            </p>

          </div>

        </div>

      </div>

      {/* TARJETAS */}

      <div className="mt-3 space-y-2">

        {configuracion.map((item) => {

          const estilo =
            estiloColor(item.color);

          return (
            <div
              key={item.id}
              className={`
                rounded-2xl
                border
                bg-white
                px-4
                py-3
                shadow-sm
                ${estilo.borde}
              `}
            >

              {/* COLOR */}

              <div
                className={`
                  flex
                  items-center
                  justify-center
                  gap-2
                  ${estilo.texto}
                `}
              >

                <span className="text-xl">
                  {iconoColor(item.color)}
                </span>

                <span
                  className="
                    text-base
                    font-bold
                    capitalize
                  "
                >
                  {item.color}
                </span>

              </div>

              {/* RANGOS */}

              <div
                className="
                  mt-2
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                <span
                  className="
                    text-xs
                    font-semibold
                    text-slate-400
                  "
                >
                  Desde
                </span>

                <input
                  type="number"
                  value={item.minimo}
                  onChange={(e) =>
                    cambiarValor(
                      item.id,
                      "minimo",
                      Number(e.target.value)
                    )
                  }
                  className={`
                    w-16
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-2
                    py-1.5
                    text-center
                    text-base
                    font-bold
                    text-slate-800
                    outline-none
                    transition
                    ${estilo.foco}
                  `}
                />

                <span className="text-slate-300">
                  –
                </span>

                <span
                  className="
                    text-xs
                    font-semibold
                    text-slate-400
                  "
                >
                  Hasta
                </span>

                <input
                  type="number"
                  value={item.maximo}
                  onChange={(e) =>
                    cambiarValor(
                      item.id,
                      "maximo",
                      Number(e.target.value)
                    )
                  }
                  className={`
                    w-16
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-2
                    py-1.5
                    text-center
                    text-base
                    font-bold
                    text-slate-800
                    outline-none
                    transition
                    ${estilo.foco}
                  `}
                />

              </div>

            </div>
          );
        })}

      </div>

      {/* GUARDAR */}

      <button
        type="button"
        onClick={guardarCambios}
        disabled={guardando}
        className="
          mt-5
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-2xl
          bg-slate-700
          py-3
          font-bold
          text-white
          shadow-sm
          transition
          hover:bg-slate-500
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {guardando ? (
          "Guardando..."
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
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
              <path d="M17 21v-8H7v8" />
              <path d="M7 3v5h8" />
            </svg>

            Guardar cambios
          </>
        )}
      </button>

      <BottomNav />

    </main>
  );
}