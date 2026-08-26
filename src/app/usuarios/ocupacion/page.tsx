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
    if (color === "verde") return "🟢";
    if (color === "amarillo") return "🟡";
    if (color === "naranja") return "🟠";
    if (color === "rojo") return "🔴";

    return "⚪";
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

      <h1 className="text-3xl font-bold text-slate-800">
        🎨 Configuración de ocupación
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
            ℹ️
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
          w-full
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
        {guardando
          ? "Guardando..."
          : "Guardar cambios"}
      </button>


      <BottomNav />

    </main>
  );
}