"use client";

import BottomNav from "@/components/navigation/BottomNav";

export default function EstadisticasGrupales() {

  return (

    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 pb-24">

      <div className="rounded-3xl bg-white p-10 shadow-xl text-center max-w-md w-full">

        <div className="text-7xl mb-6">
          🚧👷🚜
        </div>

        <h1 className="text-4xl font-extrabold text-yellow-500">
          En obras
        </h1>

        <p className="mt-6 text-slate-600 text-lg leading-relaxed">
          Estamos construyendo las estadísticas grupales.
          <br />
          Muy pronto estarán disponibles.
        </p>

      </div>

      <BottomNav />

    </main>

  );

}