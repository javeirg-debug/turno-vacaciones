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

const [dia2, setDia2] = useState("");
const [dia3, setDia3] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

useEffect(() => {

  const fecha = searchParams.get("fecha");

  if (fecha) {

    setFechaInicio(fecha);
    setFechaFin(fecha);

  }

}, [searchParams]);

  async function guardar() {

  if (tipo === "🌴 Vacaciones") {

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


  if (
    tipo === "🌴 Vacaciones" &&
    fechaFin < fechaInicio
  ) {

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
      tipo === "🎄 Navidad" ||
      tipo === "✝️ Semana Santa"
    ) {


      const dias = [
        fechaInicio,
        dia2,
        dia3
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
          tipo === "🌴 Vacaciones"
            ? fechaFin
            : fechaInicio,
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

<h1 className="text-3xl font-bold">

  ➕ Nueva solicitud

</h1>




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

<option>🌴 Vacaciones</option>

  <option>🟢 AP</option>
  <option>⏰ Compensación horaria</option>
  <option>🎄 Navidad</option>
<option>✝️ Semana Santa</option>
<option>📄 Otros permisos</option>
</select>

        </div>

        <div>

<label className="font-semibold">

  {
    tipo === "🌴 Vacaciones"
      ? "Desde"
      : tipo === "🎄 Navidad" || tipo === "✝️ Semana Santa"
      ? "Día 1"
      : "Fecha"
  }

</label>

          <input

            type="date"

            value={fechaInicio}

            onChange={(e) => setFechaInicio(e.target.value)}

            className="mt-2 w-full rounded-xl border p-3"

          />

{(tipo === "🎄 Navidad" || tipo === "✝️ Semana Santa") && (

  <>

    <div className="mt-5">

      <label className="font-semibold">
        Día 2 (opcional)
      </label>

      <input

        type="date"

        value={dia2}

        onChange={(e)=>setDia2(e.target.value)}

        className="mt-2 w-full rounded-xl border p-3"

      />

    </div>


    <div className="mt-5">

      <label className="font-semibold">
        Día 3 (opcional)
      </label>

      <input

        type="date"

        value={dia3}

        onChange={(e)=>setDia3(e.target.value)}

        className="mt-2 w-full rounded-xl border p-3"

      />

    </div>

  </>

)}

        </div>

{tipo === "🌴 Vacaciones" && (

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

)}

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