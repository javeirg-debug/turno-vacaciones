"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";

export default function Estadisticas() {

  const router = useRouter();

  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="text-3xl font-bold">
        📊 Estadísticas
      </h1>

      <p className="mt-2 text-slate-500">
        Selecciona el tipo de estadísticas que deseas consultar.
      </p>

      <div className="mt-8 space-y-5">

        <button
          onClick={() => router.push("/estadisticas/personal")}
          className="w-full rounded-3xl bg-white p-6 shadow text-left"
        >
          <h2 className="text-xl font-bold">
            👤 Personal
          </h2>

          <p className="mt-2 text-slate-500">
            Estadísticas individuales.
          </p>
        </button>

        <button
          onClick={() => router.push("/estadisticas/grupales")}
          className="w-full rounded-3xl bg-white p-6 shadow text-left"
        >
          <h2 className="text-xl font-bold">
            👥 Grupales
          </h2>

          <p className="mt-2 text-slate-500">
            Estadísticas del conjunto de la plantilla.
          </p>
        </button>

      </div>

      <BottomNav />

    </main>

  );

}