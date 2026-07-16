"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import { obtenerSolicitudesDia } from "@/services/solicitudes";

const inicioTurno = new Date(2026, 6, 16);

function obtenerTurno(fechaTexto: string) {
  const fecha = new Date(fechaTexto);

  const diferencia = Math.floor(
    (fecha.getTime() - inicioTurno.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const ciclo = ((diferencia % 12) + 12) % 12;

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

type Solicitud = {
  id: string;
  usuario_id: string;
  nombre: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
  estado: string;
  created_at: string;
};

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleString("es-ES");
}

export default function DiaCalendario() {
  const params = useParams();
  const router = useRouter();

  const fecha = params.fecha as string;

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerSolicitudesDia(fecha);
        setSolicitudes(datos || []);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [fecha]);

  return (
    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="text-3xl font-bold">
        📅 Día
      </h1>

      <div className="mt-6 rounded-3xl bg-white p-5 shadow">

        <h2 className="text-xl font-bold">
          {fecha}
        </h2>

        <p className="mt-4 text-lg">
          Turno
        </p>

        <p className="mt-2 text-2xl font-bold">
          {obtenerTurno(fecha)}
        </p>

        <div className="mt-8">

          <h3 className="text-xl font-bold">
            Personal de permiso
          </h3>

          {cargando && (
            <p className="mt-3">
              Cargando...
            </p>
          )}

          {!cargando && solicitudes.length === 0 && (
            <p className="mt-3 text-slate-500">
              No hay solicitudes para este día.
            </p>
          )}

          <div className="mt-4 space-y-4">

            {solicitudes.map((solicitud) => (

              <div
                key={solicitud.id}
                className="rounded-2xl border bg-slate-50 p-4"
              >

                <p className="text-lg font-bold">
                  👮 {solicitud.nombre}
                </p>

                <p className="mt-2">
                  {solicitud.tipo}
                </p>

                <p className="mt-2">
                  📅 {solicitud.fecha_inicio} → {solicitud.fecha_fin}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Registrada:
                  {" "}
                  {formatearFecha(solicitud.created_at)}
                </p>

                {solicitud.motivo && (
                  <p className="mt-2">
                    📝 {solicitud.motivo}
                  </p>
                )}

              </div>

            ))}

          </div>

        </div>

        <button
          onClick={() =>
            router.push(`/solicitudes/nueva?fecha=${fecha}`)
          }
          className="mt-8 w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white"
        >
          ➕ Solicitar este día
        </button>

      </div>

      <BottomNav />

    </main>
  );
}