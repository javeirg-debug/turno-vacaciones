"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/navigation/BottomNav";
import { obtenerTodasLasSolicitudes } from "@/services/solicitudes";


const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];


const inicioTurno = new Date(2026, 6, 16);



type Solicitud = {

  id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;

  usuarios: {
    nombre: string;
  } | null;

};


type ConfiguracionOcupacion = {

  id: string;
  color: string;
  minimo: number;
  maximo: number;

};





function obtenerTurno(
  dia:number,
  mes:number,
  anio:number
) {


  const fecha = new Date(
    anio,
    mes,
    dia
  );


  const diferencia = Math.floor(

    (fecha.getTime() - inicioTurno.getTime())

    /

    (1000 * 60 * 60 * 24)

  );



  const ciclo = ((diferencia % 12) + 12) % 12;



  const turnos = [

    "🌅 Mañana",
    "🌅 Mañana",

    "🌆 Tarde",
    "🌆 Tarde",

    "🌙 Noche",
    "🌙 Noche",

    "⚪ Libre",
    "⚪ Libre",
    "⚪ Libre",
    "⚪ Libre",
    "⚪ Libre",
    "⚪ Libre",

  ];


  return turnos[ciclo];

}





export default function Calendario() {


  const hoy = new Date();


  const [mes,setMes] = useState(
    hoy.getMonth()
  );


  const [anio,setAnio] = useState(
    hoy.getFullYear()
  );


const [solicitudes,setSolicitudes] =
  useState<Solicitud[]>([]);


const [configuracion,setConfiguracion] =
  useState<ConfiguracionOcupacion[]>([]);




useEffect(()=>{

  cargarSolicitudes();
  cargarConfiguracion();

},[]);





async function cargarSolicitudes(){

  try{

    const datos =
      await obtenerTodasLasSolicitudes();


    setSolicitudes(datos || []);


  }catch(error){

    console.error(error);

  }

}



async function cargarConfiguracion(){

  const { data } = await supabase
    .from("configuracion_ocupacion")
    .select("*")
    .order("minimo");


  setConfiguracion(data || []);

}





function personasFuera(dia:number){


    const fecha =
      `${anio}-${String(mes + 1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;



    return solicitudes.filter((s)=>{


      return (

        fecha >= s.fecha_inicio &&

        fecha <= s.fecha_fin

      );


    });


  }
function colorDia(personas:number){


  const regla = configuracion.find((c)=>

    personas >= c.minimo &&
    personas <= c.maximo

  );


  if(!regla){

    return "bg-slate-100";

  }



  if(regla.color === "verde"){

    return "bg-green-100";

  }



  if(regla.color === "amarillo"){

    return "bg-yellow-100";

  }



  if(regla.color === "naranja"){

    return "bg-orange-100";

  }



  if(regla.color === "rojo"){

    return "bg-red-100";

  }



  return "bg-slate-100";


}








  function cambiarMes(valor:number){


    let nuevoMes = mes + valor;

    let nuevoAnio = anio;



    if(nuevoMes > 11){

      nuevoMes = 0;

      nuevoAnio++;

    }



    if(nuevoMes < 0){

      nuevoMes = 11;

      nuevoAnio--;

    }



    setMes(nuevoMes);

    setAnio(nuevoAnio);


  }







  function irHoy(){


    setMes(
      hoy.getMonth()
    );


    setAnio(
      hoy.getFullYear()
    );


  }







  const primerDia =
    new Date(
      anio,
      mes,
      1
    ).getDay();




  const diasMes =
    new Date(
      anio,
      mes + 1,
      0
    ).getDate();





  const huecos =
    primerDia === 0
      ? 6
      : primerDia - 1;





  const dias = [];



  for(let i=0;i<huecos;i++){

    dias.push(null);

  }



  for(let i=1;i<=diasMes;i++){

    dias.push(i);

  }








  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">


      <h1 className="text-3xl font-bold">

        📅 Calendario

      </h1>




      <div className="mt-6 rounded-2xl bg-white p-2 shadow">



        <div className="flex items-center justify-between">


          <button

            onClick={()=>cambiarMes(-1)}

            className="rounded-xl bg-slate-200 px-4 py-2"

          >

            ◀

          </button>




          <h2 className="text-xl font-bold">

            {meses[mes]} {anio}

          </h2>




          <button

            onClick={()=>cambiarMes(1)}

            className="rounded-xl bg-slate-200 px-4 py-2"

          >

            ▶

          </button>


        </div>





        <button

          onClick={irHoy}

          className="mt-4 w-full rounded-xl bg-blue-600 py-2 text-white"

        >

          Hoy

        </button>







        <div className="mt-6 grid grid-cols-7 gap-0 text-center font-semibold">


          <div>L</div>
          <div>M</div>
          <div>X</div>
          <div>J</div>
          <div>V</div>
          <div>S</div>
          <div>D</div>





          {
            dias.map((dia,index)=>{


              const fuera =
                dia
                ? personasFuera(dia)
                : [];



              return (

                <div

                  key={index}


                  onClick={()=>{

                    if(dia){

                      const fecha =

                        `${anio}-${String(mes + 1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;


                      window.location.href =
                        `/calendario/${fecha}`;

                    }

                  }}



className={`aspect-square overflow-hidden border border-slate-200 p-1 text-xs cursor-pointer ${
  dia
    ? dia === hoy.getDate() &&
      mes === hoy.getMonth() &&
      anio === hoy.getFullYear()
      ? `${colorDia(fuera.length)} border-2 border-blue-500`
      : colorDia(fuera.length)
    : ""
}`}

                >



                  {
                    dia && (

                      <>

                        <div className="font-bold text-sm">

                          {dia}

                        </div>




                        <div className="flex items-center justify-center gap-1 font-bold text-sm">

  <span>
    {dia}
  </span>

  <span>
    {obtenerTurno(
      dia,
      mes,
      anio
    ).split(" ")[0]}
  </span>

</div>




{
  fuera.length > 0 && (

<div className="mt-1 text-[10px] sm:text-[11px] font-semibold text-slate-700">

      {fuera.length} fuera

    </div>

  )
}

                      </>

                    )
                  }

                </div>

              );

            })
          }

        </div>

      </div>

      <BottomNav />

    </main>

  );

}