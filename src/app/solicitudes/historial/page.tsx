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
};



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



      setHistorial(antiguas);



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



              <p>

                📅 Desde: {solicitud.fecha_inicio}

              </p>



              <p>

                📅 Hasta: {solicitud.fecha_fin}

              </p>




              {solicitud.motivo && (

                <p>

                  📝 Observaciones: {solicitud.motivo}

                </p>

              )}






              <p>

                Estado: {solicitud.estado}

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