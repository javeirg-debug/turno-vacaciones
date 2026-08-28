"use client";

import {
  Palmtree,
  Clock3,
  HeartPulse,
  Siren,
  CircleCheckBig,
  TreePine,
  Cross,
  Baby,
  Milk,
  ClipboardList,
} from "lucide-react";

const iconos = [
  // VACACIONES
  {
    permiso: "Vacaciones",
    iconos: [
      { nombre: "Palmtree", componente: Palmtree },
  
    ],
  },

  // ASUNTO PROPIO
  {
    permiso: "Asunto propio",
  iconos: [
    { nombre: "CircleCheckBig", componente: CircleCheckBig },
    ],
  },

  // COMPENSACIÓN HORARIA
  {
    permiso: "Compensación horaria",
    iconos: [
      { nombre: "Clock3", componente: Clock3 },
    
    ],
  },

  // INDISPOSICIÓN
  {
    permiso: "Indisposición",
    iconos: [
      { nombre: "HeartPulse", componente: HeartPulse },
      
    ],
  },

  // PERMISO URGENTE
  {
    permiso: "Permiso urgente",
    iconos: [
      { nombre: "Siren", componente: Siren },
    
    ],
  },

  // NAVIDAD
  {
    permiso: "Navidad",
    iconos: [
      { nombre: "TreePine", componente: TreePine },
      
    ],
  },

  // SEMANA SANTA
  {
    permiso: "Semana Santa",
    iconos: [
      { nombre: "Cross", componente: Cross },
     
    ],
  },

  // PATERNIDAD
  {
    permiso: "Paternidad",
    iconos: [
      { nombre: "Baby", componente: Baby },
    
    ],
  },

  // MATERNIDAD
  {
    permiso: "Maternidad",
    iconos: [
      { nombre: "Baby", componente: Baby },
    
    ],
  },

  // LACTANCIA
  {
    permiso: "Lactancia",
    iconos: [
      { nombre: "Milk", componente: Milk },
      
    ],
  },

  // OTROS PERMISOS
  {
    permiso: "Otros permisos",
    iconos: [
     
      { nombre: "ClipboardList", componente: ClipboardList },
    ],
  },
];

export default function PruebaIconos() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 pb-24">
      <div className="mx-auto max-w-6xl">

        {/* CABECERA */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Prueba de iconos de permisos
          </h1>

          <p className="mt-2 text-slate-500">
            Selección de iconos vectoriales de Lucide.
          </p>
        </div>

        {/* PERMISOS */}
        <div className="space-y-8">
          {iconos.map((grupo) => (
            <section
              key={grupo.permiso}
              className="rounded-3xl bg-white p-5 shadow-sm"
            >
              {/* NOMBRE DEL PERMISO */}
              <h2 className="mb-5 text-xl font-bold text-slate-800">
                {grupo.permiso}
              </h2>

              {/* ICONOS */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {grupo.iconos.map((icono) => {
                  const Icono = icono.componente;

                  return (
                    <div
                      key={icono.nombre}
                      className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-5
                        transition
                        hover:bg-slate-100
                      "
                    >
                      <Icono
                        className="h-10 w-10 text-slate-700"
                        strokeWidth={1.8}
                      />

                      <p className="mt-3 text-center text-sm font-semibold text-slate-700">
                        {icono.nombre}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

      </div>
    </main>
  );
}