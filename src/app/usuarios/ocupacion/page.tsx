"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/navigation/BottomNav";


type Configuracion = {
  id: string;
  color: string;
  minimo: number;
  maximo: number;
};



export default function Ocupacion() {


  const [configuracion, setConfiguracion] =
    useState<Configuracion[]>([]);


  const [guardando, setGuardando] =
    useState(false);



  useEffect(() => {

    cargarConfiguracion();

  }, []);




  async function cargarConfiguracion() {


const { data, error } = await supabase
  .from("configuracion_ocupacion")
  .select("*")
  .order("minimo");


console.log("CONFIGURACION:", data);
console.log("ERROR:", error);


setConfiguracion(data || []);

  }




  function cambiarValor(
    id:string,
    campo:"minimo" | "maximo",
    valor:number
  ){


    setConfiguracion((actual)=>


      actual.map((item)=>


        item.id === id

        ? {
            ...item,
            [campo]: valor
          }

        : item


      )


    );


  }





  async function guardarCambios(){


    setGuardando(true);



    for(const item of configuracion){


      await supabase
        .from("configuracion_ocupacion")
        .update({

          minimo:item.minimo,
          maximo:item.maximo

        })

        .eq("id",item.id);


    }



    setGuardando(false);


  }





  function iconoColor(color:string){


    if(color==="verde") return "🟢";

    if(color==="amarillo") return "🟡";

    if(color==="naranja") return "🟠";

    if(color==="rojo") return "🔴";


    return "⚪";


  }




  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">


      <h1 className="text-3xl font-bold text-slate-800">
        🎨 Configuración de ocupación
      </h1>


      <p className="mt-2 text-slate-500">
        Configura los colores según el número de policías de libranza.
      </p>




      <div className="mt-8 space-y-4">



        {configuracion.map((item)=>(


          <div
            key={item.id}
            className="rounded-3xl bg-white p-5 shadow"
          >


            <h2 className="text-xl font-bold capitalize">

              {iconoColor(item.color)} {item.color}

            </h2>



            <div className="mt-4 grid grid-cols-2 gap-4">



              <div>

                <p className="text-sm text-slate-500">
                  Desde
                </p>


                <input

                  type="number"

                  value={item.minimo}

                  onChange={(e)=>
                    cambiarValor(
                      item.id,
                      "minimo",
                      Number(e.target.value)
                    )
                  }

                  className="mt-1 w-full rounded-xl border p-2"

                />

              </div>




              <div>

                <p className="text-sm text-slate-500">
                  Hasta
                </p>


                <input

                  type="number"

                  value={item.maximo}

                  onChange={(e)=>
                    cambiarValor(
                      item.id,
                      "maximo",
                      Number(e.target.value)
                    )
                  }

                  className="mt-1 w-full rounded-xl border p-2"

                />

              </div>



            </div>



          </div>


        ))}



      </div>





      <button

        onClick={guardarCambios}

        className="mt-8 w-full rounded-2xl bg-blue-600 py-3 font-bold text-white"

      >

        {guardando
          ? "Guardando..."
          : "Guardar cambios"}

      </button>




      <BottomNav />



    </main>

  );

}