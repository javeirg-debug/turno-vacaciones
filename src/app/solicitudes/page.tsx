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

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-ES");
}

export default function Solicitudes() {


  const router = useRouter();


  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);

  const [solicitudesActuales, setSolicitudesActuales] =
    useState<Solicitud[]>([]);

const [solicitudesVista, setSolicitudesVista] =
    useState<any[]>([]);

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

const agrupadas:any[] = [];

actuales.forEach((s) => {

  if (
    s.tipo === "🎄 Navidad" ||
    s.tipo === "✝️ Semana Santa"
  ) {

    let grupo = agrupadas.find(
      (x) =>
        x.tipo === s.tipo
    );


    if (grupo) {

      grupo.dias.push(
        s.fecha_inicio
      );

    } else {

      agrupadas.push({

        ...s,
        dias:[
          s.fecha_inicio
        ]

      });

    }


  } else {

    agrupadas.push(s);

  }

});


setSolicitudesVista(agrupadas);

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


onClick={() => {
  window.location.href = "/solicitudes/nueva";
}}


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
            solicitudesVista.map((solicitud) => (



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

{
solicitud.dias.map(
(dia:string,index:number)=>(

<p key={dia}>
📅 Día {index+1}: {formatearFecha(dia)}
</p>

))
}

</div>

) : solicitud.tipo === "🌴 Vacaciones" ? (

<p>
📅 {formatearFecha(solicitud.fecha_inicio)}
→
{formatearFecha(solicitud.fecha_fin)}
</p>

) : (

<p>
📅 {formatearFecha(solicitud.fecha_inicio)}
</p>

)}


                  {
                    solicitud.motivo && (


                      <p>

                        📝 Observaciones: {solicitud.motivo}

                      </p>


                    )
                  }




                  <p>

                    Estado: {solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1)}

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