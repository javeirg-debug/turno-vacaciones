"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import { guardarSolicitud } from "@/services/solicitudes";
import { supabase } from "@/lib/supabase";
import {
  iconosPermisos,
  type TipoPermiso,
} from "@/components/icons/Icons";

export default function NuevaSolicitud() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vieneDelCalendario = searchParams.has("fecha");

  console.log("¿Viene del calendario?", vieneDelCalendario);
  console.log("Fecha:", searchParams.get("fecha"));

  const [tipo, setTipo] = useState<TipoPermiso>(
  vieneDelCalendario ? "Asunto propio" : "Vacaciones"
);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mostrarFechaFin, setMostrarFechaFin] = useState(false);
const [mostrarSelector, setMostrarSelector] = useState(false);


  const [dia2, setDia2] = useState("");
  const [dia3, setDia3] = useState("");

  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [sexo, setSexo] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      const fecha = searchParams.get("fecha");

      if (fecha) {
        setFechaInicio(fecha);
        setFechaFin(fecha);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: usuario } = await supabase
        .from("usuarios")
        .select("sexo")
        .eq("id", user.id)
        .single();

      if (usuario) {
        setSexo(usuario.sexo);
      }
    }

    cargarDatos();
  }, [searchParams]);

  async function guardar() {
    if (tipo === "Vacaciones") {
      if (!fechaInicio || !fechaFin) {
        setMensaje("Selecciona las fechas");
        return;
      }
    } else {
      if (!fechaInicio) {
        setMensaje("Selecciona la fecha");
        return;
      }
    }

    if (tipo === "Vacaciones" && fechaFin < fechaInicio) {
      setMensaje(
        "⚠️ La fecha de fin no puede ser anterior a la fecha de inicio."
      );
      return;
    }

    try {
      setCargando(true);

      // NAVIDAD Y SEMANA SANTA
      // SE GUARDAN COMO 3 SOLICITUDES INDEPENDIENTES

      if (
        tipo === "Navidad" ||
        tipo === "Semana Santa"
      ) {
        const dias = [
          fechaInicio,
          dia2,
          dia3,
        ].filter(Boolean);

        for (const dia of dias) {
          await guardarSolicitud({
            tipo,
            fechaInicio: dia,
            fechaFin: dia,
            observaciones,
          });
        }
      } else {
        await guardarSolicitud({
          tipo,
          fechaInicio,

          fechaFin:
            tipo === "Vacaciones" ||
            tipo === "Paternidad" ||
            tipo === "Maternidad" ||
            tipo === "Lactancia"
              ? fechaFin
              : fechaFin || fechaInicio,

          observaciones,
        });
      }

      setMensaje(
        "✅ Solicitud guardada correctamente"
      );

      setTimeout(() => {
        router.push("/solicitudes");
      }, 1000);
    } catch (error: any) {
      setMensaje(
        "⚠️ " +
          (error?.message ||
            "Error guardando solicitud")
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="flex items-center gap-3 text-3xl font-bold">
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 8V16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 12H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>

  Nueva solicitud
</h1>

      <div className="mt-6 space-y-5 rounded-3xl bg-white p-5 shadow">

        {/* TIPO */}

        <div>
          <label className="font-semibold">
            Tipo
          </label>

        <div className="relative mt-2">


<div className="relative">
  <button
    type="button"
    onClick={() => setMostrarSelector(!mostrarSelector)}
    className="
      flex
      w-full
      items-center
      justify-between
      rounded-xl
      border
      border-slate-200
      bg-white
      py-3
      pl-11
      pr-3
      text-left
    "
  >
    <div className="flex items-center gap-3">
      {(() => {
        const Icono = iconosPermisos[tipo];

        return (
          <Icono
            className="h-5 w-5 text-slate-600"
            strokeWidth={1.8}
          />
        );
      })()}

      <span>{tipo}</span>
    </div>

    <span className="text-slate-400">
      ▼
    </span>
  </button>

  {mostrarSelector && (
    <div className="
      absolute
      left-0
      right-0
      z-50
      mt-2
      max-h-80
      overflow-y-auto
      rounded-xl
      border
      border-slate-200
      bg-white
      shadow-lg
    ">
      {(Object.keys(iconosPermisos) as TipoPermiso[]).map(
        (permiso) => {
          if (
            permiso === "Paternidad" &&
            sexo !== "hombre"
          ) {
            return null;
          }

          if (
            permiso === "Maternidad" &&
            sexo !== "mujer"
          ) {
            return null;
          }

          const Icono = iconosPermisos[permiso];

          return (
            <button
              key={permiso}
              type="button"
              onClick={() => {
                setTipo(permiso);
                setMostrarSelector(false);
              }}
              className="
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-left
                transition
                hover:bg-slate-100
              "
            >
              <Icono
                className="h-5 w-5 shrink-0 text-slate-600"
                strokeWidth={1.8}
              />

              <span>{permiso}</span>
            </button>
          );
        }
      )}
    </div>
  )}
</div>
</div>
</div>
        {/* FECHA INICIO */}

        <div>
          <label className="font-semibold">
            {
              tipo === "Vacaciones"
                ? "Desde"
                : tipo === "Navidad" ||
                  tipo === "Semana Santa"
                ? "Día 1"
                : "Fecha"
            }
          </label>

          <input
            type="date"
            value={fechaInicio}
            onChange={(e) =>
              setFechaInicio(e.target.value)
            }
            className="
              mt-2
              block
              w-full
              min-w-0
              max-w-full
              box-border
              appearance-none
              rounded-xl
              border
              border-slate-200
              p-3
            "
          />

          {/* NAVIDAD / SEMANA SANTA */}

          {(tipo === "Navidad" ||
            tipo === "Semana Santa") && (
            <>
              <div className="mt-5">
                <label className="font-semibold">
                  Día 2 (opcional)
                </label>

                <input
                  type="date"
                  value={dia2}
                  onChange={(e) =>
                    setDia2(e.target.value)
                  }
                  className="
                    mt-2
                    block
                    w-full
                    min-w-0
                    max-w-full
                    box-border
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    p-3
                  "
                />
              </div>

              <div className="mt-5">
                <label className="font-semibold">
                  Día 3 (opcional)
                </label>

                <input
                  type="date"
                  value={dia3}
                  onChange={(e) =>
                    setDia3(e.target.value)
                  }
                  className="
                    mt-2
                    block
                    w-full
                    min-w-0
                    max-w-full
                    box-border
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    p-3
                  "
                />
              </div>
            </>
          )}
        </div>

        {/* HASTA */}

        {(
          tipo === "Vacaciones" ||
          tipo === "Paternidad" ||
          tipo === "Maternidad" ||
          tipo === "Lactancia"
        ) && (
          <div>
            <label className="font-semibold">
              Hasta
            </label>

            <input
              type="date"
              value={fechaFin}
              onChange={(e) =>
                setFechaFin(e.target.value)
              }
              className="
                mt-2
                block
                w-full
                min-w-0
                max-w-full
                box-border
                appearance-none
                rounded-xl
                border
                border-slate-200
                p-3
              "
            />
          </div>
        )}

        {/* AMPLIAR FECHA */}

        {(
          tipo === "Asunto propio" ||
          tipo === "Compensación horaria" ||
          tipo === "Indisposición" ||
          tipo === "Otros permisos" ||
          tipo === "Permiso urgente"
        ) && (
          <div>
            {!mostrarFechaFin ? (
              <button
                type="button"
                onClick={() => {
                  setMostrarFechaFin(true);
                  setFechaFin(fechaInicio);
                }}
                className="
                  mt-3
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-blue-200
                  bg-blue-50
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-blue-600
                  transition
                  hover:bg-blue-100
                  active:scale-95
                "
              >
                <span className="text-lg leading-none">
                  ＋
                </span>

                Ampliar fecha
              </button>
            ) : (
              <>
                <label className="font-semibold">
                  Hasta
                </label>

                <input
                  type="date"
                  value={fechaFin}
                  min={fechaInicio}
                  onChange={(e) =>
                    setFechaFin(e.target.value)
                  }
                  className="
                    mt-2
                    block
                    w-full
                    min-w-0
                    max-w-full
                    box-border
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    p-3
                  "
                />

                <button
                  type="button"
                  onClick={() => {
                    setMostrarFechaFin(false);
                    setFechaFin(fechaInicio);
                  }}
                  className="
                    mt-3
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-slate-600
                    transition
                    hover:bg-slate-100
                    active:scale-95
                  "
                >
                  <span className="text-lg leading-none">
                    −
                  </span>

                  Quitar fecha fin
                </button>
              </>
            )}
          </div>
        )}

        {/* OBSERVACIONES */}

        <div>
          <label className="font-semibold">
            Observaciones
          </label>

          <textarea
            rows={4}
            value={observaciones}
            onChange={(e) =>
              setObservaciones(e.target.value)
            }
            className="
              mt-2
              block
              w-full
              min-w-0
              max-w-full
              box-border
              appearance-none
              rounded-xl
              border
              border-slate-200
              p-3
            "
          />
        </div>

        {/* MENSAJE */}

        {mensaje && (
          <div className="rounded-xl bg-slate-100 p-3 text-center">
            {mensaje}
          </div>
        )}

        {/* GUARDAR */}

        <button
          onClick={guardar}
          disabled={cargando}
          className="
            w-full
            rounded-2xl
            bg-slate-800
            py-3
            font-semibold
            text-white
            shadow-md
            transition
            hover:bg-slate-700
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {cargando
            ? "Guardando..."
            : "Guardar solicitud"}
        </button>

      </div>

      <BottomNav />

    </main>
  );
}