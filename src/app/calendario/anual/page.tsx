"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import {
  obtenerTodasLasSolicitudes,
} from "@/services/solicitudes";
import { supabase } from "@/lib/supabase";


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

  id:string;
  fecha_inicio:string;
  fecha_fin:string;

};



type ConfiguracionOcupacion = {

  id:string;
  color:string;
  minimo:number;
  maximo:number;

};





function obtenerTurno(
  dia:number,
  mes:number,
  anio:number
){

  const fecha = new Date(
    anio,
    mes,
    dia
  );


  const diferencia = Math.floor(
    (fecha.getTime() - inicioTurno.getTime()) /
    (1000 * 60 * 60 * 24)
  );


  const ciclo =
    ((diferencia % 12) + 12) % 12;



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




function esDiaTrabajo(
  dia:number,
  mes:number,
  anio:number
){

  return obtenerTurno(
    dia,
    mes,
    anio
  ) !== "⚪ Libre";

}





function diasDelMes(
  mes:number,
  anio:number
){

  return new Date(
    anio,
    mes + 1,
    0
  ).getDate();

}





function huecosMes(
  mes:number,
  anio:number
){

  const primerDia =
    new Date(
      anio,
      mes,
      1
    ).getDay();


  return primerDia === 0
    ? 6
    : primerDia - 1;

}





export default function VistaAnual(){


const router = useRouter();



const [anio,setAnio] =
useState(
 new Date().getFullYear()
);



const [solicitudes,setSolicitudes] =
useState<Solicitud[]>([]);



const [configuracion,setConfiguracion] =
useState<ConfiguracionOcupacion[]>([]);





useEffect(()=>{

 cargar();

},[]);





async function cargar(){


 const datos =
 await obtenerTodasLasSolicitudes();


 setSolicitudes(
   datos || []
 );



 const {data} =
 await supabase
 .from("configuracion_ocupacion")
 .select("*")
 .order("minimo");


 setConfiguracion(
   data || []
 );


}







function cambiarAnio(valor:number){

 setAnio(
   anio + valor
 );

}







function personasFuera(
 dia:number,
 mes:number
){


 const fecha =
 `${anio}-${String(mes+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;



 return solicitudes.filter((s)=>{


 return (

  fecha >= s.fecha_inicio &&

  fecha <= s.fecha_fin

 );


 }).length;


}







function colorDia(
 personas:number
){


 const regla =
 configuracion.find((c)=>

  personas >= c.minimo &&
  personas <= c.maximo

 );



 if(!regla){

  return "bg-slate-100";

 }



 if(regla.color==="verde")
 return "bg-green-100";


 if(regla.color==="amarillo")
 return "bg-yellow-100";


 if(regla.color==="naranja")
 return "bg-orange-100";


 if(regla.color==="rojo")
 return "bg-red-100";


 return "bg-slate-100";


}







return (

<main className="min-h-screen bg-slate-100 p-6 pb-24">


<h1 className="text-3xl font-bold">
📅 Vista anual
</h1>




<div className="mt-6 rounded-3xl bg-white p-4 shadow">


<div className="flex items-center justify-between">


<button
onClick={()=>cambiarAnio(-1)}
className="rounded-xl bg-slate-200 px-4 py-2"
>
◀
</button>



<h2 className="text-xl font-bold">
{anio}
</h2>



<button
onClick={()=>cambiarAnio(1)}
className="rounded-xl bg-slate-200 px-4 py-2"
>
▶
</button>


</div>





<div className="mt-6 grid grid-cols-2 gap-4">


{
meses.map((mes,index)=>(


<div

key={mes}

onClick={()=>router.push(
`/calendario?mes=${index}&anio=${anio}`
)}

className="rounded-2xl bg-slate-100 p-3 shadow cursor-pointer"

>


<h3 className="text-center font-bold">
{mes}
</h3>




<div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">


{

Array.from({

length:
huecosMes(index,anio)+
diasDelMes(index,anio)

}).map((_,dia)=>(


<div

key={dia}

className={`

rounded p-1


${
dia >= huecosMes(index,anio)

?

colorDia(

personasFuera(
dia-huecosMes(index,anio)+1,
index
)

)

:

""

}


${
dia >= huecosMes(index,anio)
&&
esDiaTrabajo(
dia-huecosMes(index,anio)+1,
index,
anio
)

?

"shadow-md ring-1 ring-slate-200"

:

""

}

`}

>


{
dia < huecosMes(index,anio)

?

""

:

dia-huecosMes(index,anio)+1

}


</div>


))



}


</div>


</div>


))

}


</div>


</div>



<BottomNav />


</main>

);


}