"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/navigation/BottomNav";
import { obtenerTodasLasSolicitudes } from "@/services/solicitudes";
import {
  obtenerConflictosMes,
  type FechaConflictiva,
} from "@/services/conflictos";

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
  puesto: string;
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


  const router = useRouter();

  const hoy = new Date();

  const searchParams = useSearchParams();

  const mesUrl = searchParams.get("mes");
  const anioUrl = searchParams.get("anio");


  const [mes,setMes] = useState(
    mesUrl
      ? Number(mesUrl)
      : hoy.getMonth()
  );


  const [anio,setAnio] = useState(
    anioUrl
      ? Number(anioUrl)
      : hoy.getFullYear()
  );


const [solicitudes,setSolicitudes] =
  useState<Solicitud[]>([]);


const [configuracion,setConfiguracion] =
  useState<ConfiguracionOcupacion[]>([]);


const [fechasConflictivas, setFechasConflictivas] =
  useState<FechaConflictiva[] | null>(null);

const [mostrarLeyenda, setMostrarLeyenda] = useState(false);  

useEffect(()=>{

  cargarSolicitudes();
  cargarConfiguracion();

},[]);



useEffect(()=>{

  const nuevoMes = searchParams.get("mes");
  const nuevoAnio = searchParams.get("anio");


  if(nuevoMes && nuevoAnio){

    setMes(Number(nuevoMes));
    setAnio(Number(nuevoAnio));

  }

},[searchParams]);


useEffect(() => {

  cargarConflictosMes();

}, [mes, anio]);


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


async function cargarConflictosMes(){

  setFechasConflictivas(null);

  const conflictos =
    await obtenerConflictosMes(
      mes,
      anio
    );

console.log(JSON.stringify(conflictos, null, 2));

  setFechasConflictivas(conflictos);

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

    return "bg-green-200";

  }



  if(regla.color === "amarillo"){

    return "bg-yellow-200";

  }



  if(regla.color === "naranja"){

    return "bg-orange-200";

  }



  if(regla.color === "rojo"){

    return "bg-red-200";

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


<div className="mb-6 flex items-center justify-between">

  <h1 className="text-3xl font-bold">
    📅 Calendario
  </h1>

  <button
    onClick={() => setMostrarLeyenda(true)}
className="h-9 w-9 rounded-full bg-blue-100 shadow hover:bg-blue-200"    
  >
    ℹ️
  </button>

</div>




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
    ? obtenerTurno(dia, mes, anio) === "⚪ Libre"
      ? "bg-white"
      : colorDia(fuera.length)
    : ""
} ${
  dia === hoy.getDate() &&
  mes === hoy.getMonth() &&
  anio === hoy.getFullYear()
    ? "shadow-lg scale-105 rounded-lg z-10 relative"
    : ""
}`}

                >



                  {
                    dia && (

                      <>




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



{obtenerTurno(dia, mes, anio) !== "⚪ Libre" &&
fuera.length > 0 && (

  <div className="mt-1 text-[10px] sm:text-[11px] font-semibold text-slate-700">
    👤{fuera.length}
  </div>

)}
                      </>

                    )
                  }

                </div>

              );

            })
          }

        </div>

            </div>


      <button

        onClick={() => router.push("/calendario/anual")}

        className="mt-6 w-full rounded-xl bg-slate-700 py-3 text-white font-semibold"

      >

        📅 Vista anual

      </button>


<div
  className={`mt-6 rounded-3xl p-4 shadow ${
    fechasConflictivas === null
      ? "border border-slate-200 bg-white"
      : fechasConflictivas.length > 0
      ? "border border-red-200 bg-red-50"
      : "border border-green-200 bg-green-50"
  }`}
>

  <h2
    className={`mb-3 text-lg font-bold ${
      fechasConflictivas === null
        ? "text-slate-800"
        : fechasConflictivas.length > 0
        ? "text-red-900"
        : "text-green-900"
    }`}
  >

    {fechasConflictivas === null
      ? "⏳ Fechas conflictivas"
      : fechasConflictivas.length > 0
      ? "🚨 Fechas conflictivas"
      : "✅ Fechas conflictivas"}

  </h2>



  {fechasConflictivas === null ? (

    <p className="text-sm text-slate-500">
      Comprobando ocupación...
    </p>


) : fechasConflictivas.length > 0 ? (

    <>

      <p className="mb-3 text-sm text-slate-700">
        Este mes tiene días con alta ocupación:
      </p>

      <div className="space-y-2">


      {fechasConflictivas.map((f) => (


        <button
          key={f.fecha}
          className="
            w-full
            rounded-2xl
            bg-red-100
            p-3
            shadow-sm
            transition
            active:scale-95
          "
        >


          {/* FECHA */}

          <div
            className="
              border-y
              border-red-200
              py-1
              text-center
            "
          >

            <p className="text-sm font-bold text-slate-800">

              {new Date(f.fecha).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}

            </p>

          </div>



          {/* OCUPACIÓN */}

          <div
            className="
              mt-2
              grid
              grid-cols-3
              text-center
            "
          >


            <div>

              <p className="text-xs text-slate-500">
                🚓 GAC{" "}
                <span className="font-bold text-slate-800">
                  {f.gac}
                </span>
              </p>

            </div>



            <div className="border-x border-red-200">

              <p className="text-xs text-slate-500">
                🛡️ Seguridad{" "}
                <span className="font-bold text-slate-800">
                  {f.seguridad}
                </span>
              </p>

            </div>



            <div>

              <p className="text-xs text-slate-500">
                🖥️ Sala{" "}
                <span className="font-bold text-slate-800">
                  {f.sala}
                </span>
              </p>

            </div>


          </div>


        </button>


      ))}


    </div>

    </>

  ) : (


    <p className="text-sm text-green-800">
      Este mes no tiene días con alta ocupación.
    </p>


  )}


</div>

{mostrarLeyenda && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

    <div className="w-80 rounded-2xl bg-white p-6 shadow-2xl">

      <div className="mb-4 flex items-center justify-between">

        <h2 className="text-lg font-bold">
          ¿Cómo funciona?
        </h2>

        <button
          onClick={() => setMostrarLeyenda(false)}
          className="rounded-full bg-slate-200 px-3 py-1"
        >
          ✕
        </button>

      </div>

      <p className="mb-5 text-sm text-slate-600">
        El color de cada día representa la ocupación prevista según el número de personas de permiso.
      </p>

      <h3 className="mb-3 text-base font-bold">
        Leyenda
      </h3>

      <div className="space-y-3 text-sm">

        {configuracion.map((c) => {

          let color = "bg-slate-200";

          if (c.color === "verde") color = "bg-green-200";
          if (c.color === "amarillo") color = "bg-yellow-200";
          if (c.color === "naranja") color = "bg-orange-200";
          if (c.color === "rojo") color = "bg-red-200";

          return (
            <div
              key={c.id}
              className="flex items-center gap-3"
            >
              <div className={`h-5 w-5 rounded ${color}`}></div>

              {c.minimo} - {c.maximo} Personas
            </div>
          );

        })}

      </div>

    </div>

  </div>
)}


      <BottomNav />

    </main>

  );

}