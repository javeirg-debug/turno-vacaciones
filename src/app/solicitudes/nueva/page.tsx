"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import { guardarSolicitud } from "@/services/solicitudes";

export default function NuevaSolicitud() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const vieneDelCalendario = searchParams.has("fecha");
console.log("¿Viene del calendario?", vieneDelCalendario);
console.log("Fecha:", searchParams.get("fecha"));
const [tipo, setTipo] = useState(
  vieneDelCalendario ? "🟢 AP" : "🌴 Vacaciones"
);  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {

    const fecha = searchParams.get("fecha");

    if (fecha) {
      setTipo("🟢 AP");
      setFechaInicio(fecha);
      setFechaFin(fecha);

    }

  }, [searchParams]);

  async function guardar() {

    if (!fechaInicio || !fechaFin) {

      setMensaje("Selecciona las fechas");

      return;

    }
    if (fechaFin < fechaInicio) {

  setMensaje(
    "⚠️ La fecha de fin no puede ser anterior a la fecha de inicio."
  );

  return;

}

    try {

      setCargando(true);

      await guardarSolicitud({

        tipo,
        fechaInicio,
        fechaFin,
        observaciones,

      });

      setMensaje("✅ Solicitud guardada correctamente");

      setTimeout(() => {

        router.push("/solicitudes");

      }, 1000);

    } catch (error: any) {

  setMensaje(
    "⚠️ " + (error?.message || "Error guardando solicitud")
  );

} finally {

      setCargando(false);

    }

  }

  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">

<h1 className="text-3xl font-bold">

  ➕ Nueva solicitud

</h1>


{vieneDelCalendario && (

<div className="mt-4 rounded-3xl bg-amber-50 border border-amber-200 p-4 text-amber-900 text-center">
     Desde el esta opción solo pueden solicitarse permisos de un día.
    <br />
    Las vacaciones y los permisos de varios días deben solicitarse desde Solicitudes.

  </div>

)}


<div className="mt-6 rounded-3xl bg-white p-5 shadow space-y-5">
        <div>

          <label className="font-semibold">

            Tipo

          </label>

<select
  value={tipo}
  onChange={(e) => setTipo(e.target.value)}
  className="mt-2 w-full rounded-xl border p-3"
>

  {!vieneDelCalendario && (
    <option>🌴 Vacaciones</option>
  )}

  <option>🟢 AP</option>
  <option>⏰ Compensación horaria</option>
  <option>📄 Otros permisos</option>

</select>

        </div>

        <div>

          <label className="font-semibold">

            Desde

          </label>

          <input

            type="date"

            value={fechaInicio}

            onChange={(e) => setFechaInicio(e.target.value)}

            className="mt-2 w-full rounded-xl border p-3"

          />

        </div>

        <div>

          <label className="font-semibold">

            Hasta

          </label>

          <input

            type="date"

            value={fechaFin}

            onChange={(e) => setFechaFin(e.target.value)}

            className="mt-2 w-full rounded-xl border p-3"

          />

        </div>

        <div>

          <label className="font-semibold">

            Observaciones

          </label>

          <textarea

            rows={4}

            value={observaciones}

            onChange={(e) => setObservaciones(e.target.value)}

            className="mt-2 w-full rounded-xl border p-3"

          />

        </div>

        {mensaje && (

          <div className="rounded-xl bg-slate-100 p-3 text-center">

            {mensaje}

          </div>

        )}

        <button

          onClick={guardar}

          disabled={cargando}

          className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white"

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