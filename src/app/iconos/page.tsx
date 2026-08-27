"use client";

import BottomNav from "@/components/navigation/BottomNav";
import { bibliotecaIconos } from "@/components/icons/Icons";

export default function IconosPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">

      <div className="mx-auto max-w-xl">

        <h1 className="text-3xl font-bold text-slate-800">
          Iconos
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Biblioteca de iconos vectoriales
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">

          {bibliotecaIconos.map((icono) => {
            const Icono = icono.componente;

            return (
              <div
                key={icono.nombre}
                className="rounded-3xl bg-white p-5 shadow-sm"
              >

                <div className="flex h-20 items-center justify-center rounded-2xl bg-slate-100">
                  <Icono className="h-10 w-10 text-slate-700" />
                </div>

                <p className="mt-4 text-sm font-bold text-slate-800">
                  {icono.nombre}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {icono.descripcion}
                </p>

              </div>
            );
          })}

        </div>

      </div>

      <BottomNav />

    </main>
  );
}