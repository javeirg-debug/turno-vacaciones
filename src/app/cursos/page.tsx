"use client";

import BottomNav from "@/components/navigation/BottomNav";

export default function Cursos() {

  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">


      <h1 className="text-3xl font-bold text-slate-800">
        🎯 Cursos
      </h1>


      <p className="mt-2 text-slate-500">
        Formación y contenidos.
      </p>



      <div className="mt-8 rounded-3xl border border-yellow-300 bg-yellow-50 p-8 text-center shadow">


        <div className="text-5xl">
          🚧
        </div>


        <h2 className="mt-4 text-3xl font-bold text-yellow-700">
          En obras
        </h2>


        <p className="mt-3 text-slate-600">
          Esta sección estará disponible próximamente.
        </p>


      </div>



      <BottomNav />


    </main>

  );

}