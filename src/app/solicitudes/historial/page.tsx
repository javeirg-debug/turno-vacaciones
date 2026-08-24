"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/navigation/BottomNav";
import {
  obtenerHistorialSolicitudes,
  eliminarSolicitud,
} from "@/services/solicitudes";


type Solicitud = {
  id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
  estado: string;
  dias?: string[];
};

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}


export default function HistorialSolicitudes() {


  const [historial, setHistorial] = useState<Solicitud[]>([]);

  const [cargando, setCargando] = useState(true);



  async function cargarHistorial() {


    try {


      const datos = await obtenerHistorialSolicitudes();



      const hoy = new Date()
        .toISOString()
        .split("T")[0];



const antiguas = (datos || []).filter(
  (solicitud) =>
    solicitud.fecha_fin < hoy
);

const agrupadas: Solicitud[] = [];

const especiales = antiguas.filter(
  (s) =>
    s.tipo === "🎄 Navidad" ||
    s.tipo === "✝️ Semana Santa"
);

const normales = antiguas.filter(
  (s) =>
    s.tipo !== "🎄 Navidad" &&
    s.tipo !== "✝️ Semana Santa"
);

// Las solicitudes normales siguen siendo individuales
agrupadas.push(...normales);

// Copia de las especiales que todavía no hemos agrupado
const pendientes = [...especiales];

while (pendientes.length > 0) {

  // Ordenamos por fecha
  pendientes.sort(
    (a, b) =>
      new Date(a.fecha_inicio).getTime() -
      new Date(b.fecha_inicio).getTime()
  );

  // La primera fecha pendiente inicia el bloque
  const primera = pendientes[0];

  const fechaInicial = new Date(
    primera.fecha_inicio
  );

  // 30 días desde la primera fecha
  const fechaLimite = new Date(
    fechaInicial
  );

  fechaLimite.setDate(
    fechaLimite.getDate() + 30
  );

  // Buscamos todos los registros del mismo tipo
  // que estén dentro de esos 30 días
  const bloque = pendientes.filter((s) => {

    if (s.tipo !== primera.tipo) {
      return false;
    }

    const fecha = new Date(
      s.fecha_inicio
    );

    return (
      fecha >= fechaInicial &&
      fecha <= fechaLimite
    );

  });

  // Creamos una tarjeta con ese bloque
  agrupadas.push({
    ...primera,
    dias: bloque
      .sort(
        (a, b) =>
          new Date(a.fecha_inicio).getTime() -
          new Date(b.fecha_inicio).getTime()
      )
      .map((s) => s.fecha_inicio)
  });

  // Quitamos del listado todos los registros
  // que ya pertenecen a este bloque
  bloque.forEach((s) => {

    const indice = pendientes.findIndex(
      (p) => p.id === s.id
    );

    if (indice !== -1) {
      pendientes.splice(indice, 1);
    }

  });

}

// Ordenamos finalmente las tarjetas:
// más reciente → más antigua
agrupadas.sort(
  (a, b) =>
    new Date(b.fecha_inicio).getTime() -
    new Date(a.fecha_inicio).getTime()
);

setHistorial(agrupadas);



    } catch (error) {


      console.error(error);


    } finally {


      setCargando(false);


    }


  }





  async function borrar(id: string) {


    const confirmar = confirm(
      "¿Quieres borrar esta solicitud?"
    );


    if (!confirmar) return;



    await eliminarSolicitud(id);



    cargarHistorial();


  }





  useEffect(() => {


    cargarHistorial();


  }, []);






  return (


    <main className="min-h-screen bg-slate-100 p-6 pb-24">



      <h1 className="text-3xl font-bold text-slate-800">

        📂 Historial de peticiones

      </h1>




      <p className="mt-2 text-slate-500">

        Solicitudes anteriores.

      </p>





      <div className="mt-6 space-y-4">



        {cargando && (

          <div className="rounded-3xl bg-white p-5 shadow">

            Cargando historial...

          </div>

        )}






        {!cargando && historial.length === 0 && (

          <div className="rounded-3xl bg-white p-5 shadow">

            No hay solicitudes anteriores.

          </div>

        )}






        {historial.map((solicitud) => (



          <div

            key={solicitud.id}

            className="rounded-3xl bg-white p-5 shadow"

          >



            <h2 className="text-xl font-bold">

              {solicitud.tipo}

            </h2>




            <div className="mt-4 space-y-2 text-slate-700">



{solicitud.dias ? (

  <div>

    {solicitud.dias.map(
      (dia: string, index: number) => (

        <p key={dia}>
          📅 Día {index + 1}: {formatearFecha(dia)}
        </p>

      )
    )}

  </div>

) : (

  <p>
    📅 {formatearFecha(solicitud.fecha_inicio)}

    {solicitud.fecha_inicio !== solicitud.fecha_fin && (
      <>
        {" → "}
        {formatearFecha(solicitud.fecha_fin)}
      </>
    )}
  </p>

)}




              {solicitud.motivo && (

                <p>

                  📝 Observaciones: {solicitud.motivo}

                </p>

              )}






              <p>

Estado: {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}
              </p>



            </div>





            <button

              onClick={() => borrar(solicitud.id)}

              className="mt-5 rounded-xl bg-red-500 px-5 py-2 text-white"

            >

              🗑️ Eliminar

            </button>




          </div>



        ))}



      </div>





      <BottomNav />



    </main>


  );


}