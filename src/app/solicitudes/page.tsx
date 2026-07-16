"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import {
  obtenerSolicitudes,
  eliminarSolicitud,
} from "@/services/solicitudes";


type Solicitud = {
  id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
  estado: string;

  usuarios: {
    nombre: string;
  } | null;
};


export default function Solicitudes() {


  const router = useRouter();


  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const [solicitudesActuales, setSolicitudesActuales] =
    useState<Solicitud[]>([]);

  const [cargando, setCargando] = useState(true);



  async function cargarSolicitudes() {


    try {


      const datos = await obtenerSolicitudes();


      const lista = datos || [];


      const hoy = new Date()
        .toISOString()
        .split("T")[0];


      const actuales = lista.filter(

        (solicitud) =>
          solicitud.fecha_fin >= hoy

      );



      setSolicitudes(lista);

      setSolicitudesActuales(actuales);



    } catch (error) {


      console.error(error);


    } finally {


      setCargando(false);


    }


  }



  useEffect(() => {


    cargarSolicitudes();


  }, []);




  async function borrar(id: string) {


    const confirmar = confirm(
      "¿Quieres borrar esta solicitud?"
    );


    if (!confirmar) return;



    await eliminarSolicitud(id);


    cargarSolicitudes();


  }




  return (


    <main className="min-h-screen bg-slate-100 p-6 pb-24">



      <h1 className="text-3xl font-bold text-slate-800">

        📝 Solicitudes

      </h1>






      <button


        onClick={() =>
          router.push("/solicitudes/nueva")
        }


        className="mt-6 w-full rounded-2xl bg-blue-600 py-3 text-lg font-semibold text-white"


      >

        ➕ Nueva solicitud

      </button>












      <div className="mt-6">


        <h2 className="text-xl font-bold">

          📌 Solicitudes actuales

        </h2>



        <div className="mt-4 space-y-4">



          {
            cargando && (


              <div className="rounded-3xl bg-white p-5 shadow">

                Cargando solicitudes...

              </div>


            )
          }






          {
            !cargando &&
            solicitudesActuales.length === 0 && (


              <div className="rounded-3xl bg-white p-5 shadow">


                No tienes solicitudes actuales.


              </div>


            )
          }







          {
            solicitudesActuales.map((solicitud) => (



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




                  {
                    solicitud.motivo && (


                      <p>

                        📝 Observaciones: {solicitud.motivo}

                      </p>


                    )
                  }




                  <p>

                    Estado: {solicitud.estado}

                  </p>



                </div>





                <button


                  onClick={() =>
                    borrar(solicitud.id)
                  }


                  className="mt-5 rounded-xl bg-red-500 px-5 py-2 text-white"


                >

                  🗑️ Eliminar


                </button>




              </div>



            ))
          }



        </div>


      </div>


      <button


        onClick={() =>
          router.push("/solicitudes/historial")
        }


        className="mt-4 w-full rounded-2xl bg-slate-700 py-3 text-lg font-semibold text-white"


      >

        📂 Historial de peticiones

      </button>


      <BottomNav />



    </main>


  );


}