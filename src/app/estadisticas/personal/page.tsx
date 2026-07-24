"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/navigation/BottomNav";


type Solicitud = {
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
};


export default function EstadisticasPersonales() {


  const [resumen, setResumen] =
    useState<Record<string, number>>({});

const [porMes, setPorMes] = useState<number[]>([]);
const [laborables, setLaborables] =
useState<number[]>([]);


const [porMesBarras, setPorMesBarras] =
useState<number[]>([]);

const [laborablesBarras, setLaborablesBarras] =
useState<number[]>([]);


  const [cargando, setCargando] =
    useState(true);


const [anioPermisos,setAnioPermisos] =
  useState(new Date().getFullYear());

const [anioBarras,setAnioBarras] =
  useState(new Date().getFullYear());

const [mostrarInfo, setMostrarInfo] =
  useState(false);

const [mostrarInfoDias, setMostrarInfoDias] =
  useState(false);

  const tipos = [
    "Vacaciones",
    "AP",
    "Compensación horaria",
    "Navidad",
    "Semana Santa",
    "Otros",
  ];

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


function buscarTipoBD(tipo:string): string[]{

  const equivalencias: Record<string, string[]> = {


      "Vacaciones":[
        "Vacaciones",
        "🌴 Vacaciones"
      ],


      "AP":[
        "AP",
        "🟢 AP"
      ],


      "Compensación horaria":[
        "Compensación horaria",
        "⏰ Compensación horaria"
      ],


      "Navidad":[
        "Navidad",
        "🎄 Navidad"
      ],


      "Semana Santa":[
        "Semana Santa",
        "✝️ Semana Santa"
      ],


      "Otros":[
        "Otros",
        "📄 Otros permisos",
        "Otros permisos"
      ]


    };


    return equivalencias[tipo];


  }

const inicioTurno = new Date(2026, 6, 16);


function esDiaTrabajado(fecha: Date){

  const diferencia = Math.floor(
    (
      fecha.getTime()
      -
      inicioTurno.getTime()
    )
    /
    (1000 * 60 * 60 * 24)
  );


  const ciclo = ((diferencia % 12) + 12) % 12;


  const turnos = [
    "mañana",
    "mañana",
    "tarde",
    "tarde",
    "noche",
    "noche",
    "libre",
    "libre",
    "libre",
    "libre",
    "libre",
    "libre",
  ];


  return turnos[ciclo] !== "libre";

}



function calcularDiasLaborables(
  anio:number,
  mes:number
){

  let contador = 0;

  const fecha = new Date(anio, mes, 1);


  while(fecha.getMonth() === mes){


    if(esDiaTrabajado(fecha)){
      contador++;
    }


    fecha.setDate(
      fecha.getDate()+1
    );

  }


  return contador;

}
useEffect(()=>{

    setCargando(true);

    cargarEstadisticas(anioPermisos);

},[anioPermisos]);



useEffect(()=>{

    cargarBarras(anioBarras);

},[anioBarras]);


  async function cargarEstadisticas(anio:number){


    try {


      const {
        data:{user}
      } = await supabase.auth.getUser();



      if(!user) return;



const fechaInicio =
        `${anio}-01-01`;


const fechaFin =
        `${anio}-12-31`;



      const {data,error}=await supabase
        .from("vacaciones")
        .select(
          "tipo,fecha_inicio,fecha_fin"
        )
        .eq(
          "usuario_id",
          user.id
        )
        .gte(
          "fecha_inicio",
          fechaInicio
        )
        .lte(
          "fecha_inicio",
          fechaFin
        );



      if(error){
console.log(
  "SOLICITUDES RECIBIDAS:",
  JSON.stringify(data, null, 2)
);
        console.error(error);
        return;

      }



      const totales:Record<string,number>={};
const mesesTotales = Array(12).fill(0);

const diasLaborables = Array(12)
.fill(0)
.map((_,i)=>
  calcularDiasLaborables(anio,i)
);

      (data || []).forEach(
        (solicitud:Solicitud)=>{
console.log(
  "PERMISO LEIDO:",
  JSON.stringify({
    inicio: solicitud.fecha_inicio,
    fin: solicitud.fecha_fin,
    tipo: solicitud.tipo
  }, null, 2)
);

          const inicio =
            new Date(
              solicitud.fecha_inicio
            );


          const fin =
            new Date(
              solicitud.fecha_fin
            );



const diasTotales =
  Math.floor(
    (
      fin.getTime()
      -
      inicio.getTime()
    )
    /
    (1000*60*60*24)
  ) + 1;


// sumar cada día al mes correspondiente
for(let i = 0; i < diasTotales; i++){

  const fecha = new Date(inicio);

  fecha.setDate(
    inicio.getDate() + i
  );


  if(esDiaTrabajado(fecha)){

console.log(
  "COMPROBANDO PERMISO",
  fecha.toISOString().split("T")[0],
  esDiaTrabajado(fecha)
);

const mes = fecha.getMonth();

if(esDiaTrabajado(fecha)){
  mesesTotales[mes]++;
}

  }

}


totales[solicitud.tipo]=
(
  totales[solicitud.tipo] || 0
)
+
diasTotales;


        }
      );



      setResumen(totales);
setPorMes(mesesTotales);
setLaborables(diasLaborables);

    } finally {


      setCargando(false);


    }


  }


  async function cargarBarras(anio:number){

    try {


      const {
        data:{user}
      } = await supabase.auth.getUser();


      if(!user) return;



      const fechaInicio =
        `${anio}-01-01`;


      const fechaFin =
        `${anio}-12-31`;



      const {data,error}=await supabase
        .from("vacaciones")
        .select(
          "fecha_inicio,fecha_fin"
        )
        .eq(
          "usuario_id",
          user.id
        )
        .gte(
          "fecha_inicio",
          fechaInicio
        )
        .lte(
          "fecha_inicio",
          fechaFin
        );



      if(error){
        console.error(error);
        return;
      }



      const mesesTotales = Array(12).fill(0);



      const diasLaborables = Array(12)
      .fill(0)
      .map((_,i)=>
        calcularDiasLaborables(anio,i)
      );



      (data || []).forEach((solicitud)=>{


        const inicio =
          new Date(
            solicitud.fecha_inicio
          );


        const fin =
          new Date(
            solicitud.fecha_fin
          );



        const diasTotales =
          Math.floor(
            (
              fin.getTime()
              -
              inicio.getTime()
            )
            /
            (1000*60*60*24)
          ) + 1;



        for(let i=0;i<diasTotales;i++){


          const fecha =
            new Date(inicio);


          fecha.setDate(
            inicio.getDate()+i
          );



          if(esDiaTrabajado(fecha)){


            const mes =
              fecha.getMonth();


            mesesTotales[mes]++;


          }


        }


      });


console.log("AÑO:", anio);
console.log("MESES TOTALES:", mesesTotales);
      setPorMesBarras(mesesTotales);

      setLaborablesBarras(diasLaborables);



    } catch(error){

      console.error(error);

    }


  }


  const total =
    Object.values(resumen)
    .reduce(
      (a,b)=>a+b,
      0
    );



return (

<main className="min-h-screen bg-slate-100 p-6 pb-24">


<h1 className="text-3xl font-bold text-slate-800">
📊 Estadísticas personales
</h1>


<p className="mt-2 text-slate-500">
Resumen de permisos utilizados.
</p>



{cargando ? (

<div className="mt-6 rounded-3xl bg-white p-6 shadow">
Cargando estadísticas...
</div>


) : (


<>


{/* =========================
      TARJETA DIAS USADOS
========================= */}


<div className="mt-6 rounded-3xl bg-white p-6 shadow">


<div className="flex items-center justify-between rounded-2xl bg-slate-100 p-3">


<button

onClick={()=>setAnioPermisos(anioPermisos-1)}

className="rounded-xl bg-white px-4 py-2 shadow"

>
◀
</button>



<div className="text-center">

<p className="text-sm text-slate-500">
Año de permisos
</p>

<h2 className="text-3xl font-bold">
{anioPermisos}
</h2>

</div>



<button

onClick={()=>setAnioPermisos(anioPermisos+1)}

className="rounded-xl bg-white px-4 py-2 shadow"

>
▶
</button>


</div>



<div className="mt-6 flex items-center justify-between">

  <h2 className="text-xl font-bold">
    📅 Días usados
  </h2>

  <button
    onClick={() => setMostrarInfoDias(true)}
    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-100 text-yellow-700 shadow transition hover:bg-yellow-200"
    title="Cómo se calcula"
  >
    <span className="text-lg font-extrabold">i</span>
  </button>

</div>


<div className="mt-4 overflow-hidden rounded-2xl border">


<table className="w-full">


<thead>

<tr className="bg-slate-100 text-slate-500">

<th className="p-4 text-left">
Permiso
</th>

<th className="p-4 text-right">
Días
</th>

</tr>

</thead>



<tbody>


{tipos.map((tipo)=>(


<tr
key={tipo}
className="border-t"
>


<td className="p-4 font-medium">


{tipo==="Vacaciones"&&"🌴 "}
{tipo==="AP"&&"🟢 "}
{tipo==="Compensación horaria"&&"⏰ "}
{tipo==="Navidad"&&"🎄 "}
{tipo==="Semana Santa"&&"✝️ "}
{tipo==="Otros"&&"📄 "}


{tipo}


</td>



<td className="p-4 text-right">


<span className="rounded-full bg-blue-100 px-4 py-1 font-bold text-blue-700">


{
(buscarTipoBD(tipo)||[])
.reduce(
(total,nombre)=>
total+
(resumen[nombre]||0),
0
)
}


</span>


</td>


</tr>


))}


</tbody>



<tfoot>


<tr className="bg-slate-50">


<td className="p-4 text-lg font-bold">
Total
</td>


<td className="p-4 text-right">


<span className="rounded-full bg-blue-600 px-5 py-2 text-xl font-bold text-white">

{total}

</span>


</td>


</tr>


</tfoot>



</table>


</div>


</div>





{/* =========================
      TARJETA BARRAS
========================= */}



<div className="mt-6 rounded-3xl bg-white p-6 shadow">



<div className="flex items-center justify-between rounded-2xl bg-slate-100 p-3">


<button

onClick={()=>setAnioBarras(anioBarras-1)}

className="rounded-xl bg-white px-4 py-2 shadow"

>
◀
</button>



<div className="text-center">

<p className="text-sm text-slate-500">
Año de barras
</p>

<h2 className="text-3xl font-bold">
{anioBarras}
</h2>

</div>



<button

onClick={()=>setAnioBarras(anioBarras+1)}

className="rounded-xl bg-white px-4 py-2 shadow"

>
▶
</button>


</div>




<div className="mt-6 flex items-center justify-between">

  <h2 className="text-xl font-bold">
    📊 Ocupación por meses
  </h2>

<button
  onClick={() => setMostrarInfo(true)}
  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-100 text-yellow-700 shadow transition hover:bg-yellow-200"
  title="Cómo se calcula"
>
  <span className="text-lg font-extrabold">i</span>
</button>

</div>



<div className="mt-4 space-y-5">


{
meses.map((mes,index)=>{


const dias = porMesBarras[index] || 0;


const porcentaje =
laborablesBarras[index] > 0
?
Math.round(
(dias/laborablesBarras[index])*100
)
:
0;

const color =
  porcentaje <= 25
    ? "bg-green-500"
    : porcentaje <= 50
    ? "bg-yellow-400"
    : porcentaje <= 75
    ? "bg-orange-500"
    : "bg-red-600";

return (

<div key={mes}>


<div className="flex justify-between mb-1">

<span className="font-medium">
{mes}
</span>


<span className="text-slate-500">
{dias} de {laborablesBarras[index]} ({porcentaje}%)
</span>


</div>



<div className="h-3 overflow-hidden rounded-full bg-slate-200">


<div

className={`h-full rounded-full ${color}`}

style={{
width:`${porcentaje}%`
}}

/>


</div>


</div>


)


})
}


</div>



</div>


</>


)}


{mostrarInfo && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

  <div className="w-[90%] max-w-md rounded-3xl bg-white p-6 shadow-2xl">

    <h3 className="text-xl font-bold text-slate-800">
      ℹ️ Cómo se calcula
    </h3>

    <p className="mt-4 leading-7 text-slate-600">
      Los porcentajes comparan los días de permiso con los días que tenías
      asignados para trabajar según tu cuadrante en cada mes. Los días libres
      no se tienen en cuenta.
    </p>

    <button
      onClick={() => setMostrarInfo(false)}
      className="mt-6 w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
    >
      Cerrar
    </button>

  </div>

</div>

)}

{mostrarInfoDias && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

  <div className="w-[90%] max-w-md rounded-3xl bg-white p-6 shadow-2xl">

    <h3 className="text-xl font-bold text-slate-800">
      ℹ️ Cómo se calcula
    </h3>

    <p className="mt-4 leading-7 text-slate-600">
      Los días usados se cuentan únicamente dentro del año seleccionado. Si un
      permiso empieza antes o termina después de ese año, solo se tienen en
      cuenta las fechas que pertenecen al calendario del año mostrado.
    </p>

    <button
      onClick={() => setMostrarInfoDias(false)}
      className="mt-6 w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
    >
      Cerrar
    </button>

  </div>

</div>

)}


      <BottomNav />

    </main>

  );

}