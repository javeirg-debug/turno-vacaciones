"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/navigation/BottomNav";

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

type Usuario = {
  id: string;
  nombre: string;
  activo: boolean;
};

type EstadisticaUsuario = {
  id: string;
  nombre: string;
  activo: boolean;
  dias: number;
  laborables: number;
  porcentaje: number;
};

export default function EstadisticasGrupales() {

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


  const fecha =
    new Date(anio, mes, 1);



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

  const [anio, setAnio] =
    useState(new Date().getFullYear());

  const [mes, setMes] =
    useState(new Date().getMonth());

  const [usuarios, setUsuarios] =
    useState<Usuario[]>([]);

    const [estadisticas, setEstadisticas] =
  useState<EstadisticaUsuario[]>([]);

  const [mostrarInfo, setMostrarInfo] =
  useState(false);

  const [calculando, setCalculando] =
  useState(false);

  useEffect(() => {
    cargarUsuariosActivos();
  }, []);


useEffect(() => {

  if (usuarios.length > 0) {

    calcularEstadisticas();

  }

}, [usuarios, anio, mes]);



async function calcularEstadisticas() {

  setCalculando(true);

  const resultado: EstadisticaUsuario[] = [];


  for (const usuario of usuarios) {


    const inicioMes =
      new Date(anio, mes, 1);


    const finMes =
  new Date(anio, mes + 1, 0, 23, 59, 59, 999);



    const { data, error } = await supabase
      .from("vacaciones")
      .select("fecha_inicio,fecha_fin")
      .eq(
        "usuario_id",
        usuario.id
      )
      .gte(
 "fecha_fin",
 inicioMes.toISOString().split("T")[0]
)
.lte(
 "fecha_inicio",
 finMes.toISOString().split("T")[0]
);

    if(error){
      console.error(error);
      continue;
    }


    if(!data || data.length === 0){
      continue;
    }


let diasPermiso = 0;


(data || []).forEach((permiso)=>{


const inicioOriginal =
  new Date(permiso.fecha_inicio + "T00:00:00");

const finOriginal =
  new Date(permiso.fecha_fin + "T00:00:00");


const inicio =
  new Date(
    Math.max(
      inicioOriginal.getTime(),
      inicioMes.getTime()
    )
  );


const fin =
  new Date(
    Math.min(
      finOriginal.getTime(),
      finMes.getTime()
    )
  );



  const dias =
    Math.floor(
      (
        fin.getTime()
        -
        inicio.getTime()
      )
      /
      (1000*60*60*24)
    ) + 1;



  for(let i = 0; i < dias; i++){


    const fecha =
      new Date(inicio);


    fecha.setDate(
      inicio.getDate()+i
    );


    if(esDiaTrabajado(fecha)){

      diasPermiso++;

    }


  }


});

if(diasPermiso === 0){
  continue;
}


const diasTrabajo =
  calcularDiasLaborables(anio, mes);


resultado.push({
  id: usuario.id,
  nombre: usuario.nombre,
  activo: usuario.activo,
  dias: diasPermiso,
  laborables: diasTrabajo,
  porcentaje: Math.round((diasPermiso / diasTrabajo) * 100)
});


  }


setEstadisticas(resultado);

setCalculando(false);

}

  async function cargarUsuariosActivos() {

    const { data, error } = await supabase
      .from("usuarios")
.select("id,nombre,activo")
.order("nombre");

    if (error) {
      console.error(error);
      return;
    }

    setUsuarios(data || []);
      }

  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="text-3xl font-bold text-slate-800">
        <svg
  viewBox="0 0 24 24"
  className="mr-2 inline-block h-7 w-7 align-middle text-slate-800"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <path
    d="M4 19V10"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
  <path
    d="M10 19V5"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
  <path
    d="M16 19V8"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
  <path
    d="M22 19V3"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
</svg>
Estadísticas grupales
      </h1>

      <p className="mt-2 text-slate-500">
        Ocupación mensual del personal.
      </p>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow">

<div className="space-y-4">

  {/* Año */}

  <div className="flex w-full items-center justify-between">

    <button
      onClick={() => setAnio(anio - 1)}
      className="rounded-xl bg-slate-100 px-4 py-2 shadow"
    >
      ◀
    </button>

    <span className="flex-1 text-center text-2xl font-bold">
      {anio}
    </span>

    <button
      onClick={() => setAnio(anio + 1)}
      className="rounded-xl bg-slate-100 px-4 py-2 shadow"
    >
      ▶
    </button>

  </div>

  {/* Mes */}

  <div className="flex justify-center">

    <select
      value={mes}
      onChange={(e) => setMes(Number(e.target.value))}
      className="w-56 rounded-xl border bg-white px-4 py-3 text-center shadow"
    >
      {meses.map((nombre, index) => (
        <option key={nombre} value={index}>
          {nombre}
        </option>
      ))}
    </select>

  </div>

</div>

<div className="mt-8 rounded-2xl border p-6">

<div className="mb-5">

<div className="flex items-center justify-between">

  <h2 className="text-xl font-bold text-blue-900">
    Usuarios con permisos:
  </h2>

<button
  onClick={() => setMostrarInfo(true)}
  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 shadow hover:bg-slate-200"
>
  <svg
  viewBox="0 0 24 24"
  className="h-5 w-5"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <circle
    cx="12"
    cy="12"
    r="9"
    stroke="currentColor"
    strokeWidth="2"
  />
  <path
    d="M12 11V16"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
  <circle
    cx="12"
    cy="8"
    r="1"
    fill="currentColor"
  />
</svg>
</button>

</div>


</div>


{mostrarInfo && (

  <div className="mb-5 rounded-2xl bg-blue-50 p-5 text-sm text-slate-600 shadow">

    <h3 className="mb-3 font-bold text-blue-900">
      ¿Cómo se calculan estos datos?
    </h3>

    <p className="mb-2">
      • Se revisan los permisos registrados del mes seleccionado.
    </p>

    <p className="mb-2">
      • Solo se cuentan los días en los que el usuario tiene turno trabajado.
    </p>

    <p className="mb-2">
      • Los días libres del ciclo de turnos no suman como ocupación.
    </p>

    <p>
      • El porcentaje indica qué parte de los días laborables del mes está ocupada.
    </p>

  </div>

)}

  <div className="space-y-5">


{
calculando ? (

<div className="rounded-2xl bg-slate-100 p-6 text-center text-slate-500">

<svg
  viewBox="0 0 24 24"
  className="mr-2 inline-block h-5 w-5 align-middle text-slate-500"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <circle
    cx="12"
    cy="12"
    r="9"
    stroke="currentColor"
    strokeWidth="2"
  />
  <path
    d="M12 7V12L15 14"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
Calculando permisos...

</div>

) : estadisticas.length === 0 ? (

<div className="rounded-2xl bg-slate-100 p-6 text-center text-slate-500">

<svg
  viewBox="0 0 24 24"
  className="mr-2 inline-block h-5 w-5 align-middle text-slate-500"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <rect
    x="3"
    y="4"
    width="18"
    height="17"
    rx="3"
    stroke="currentColor"
    strokeWidth="2"
  />
  <path
    d="M8 2V6"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
  <path
    d="M16 2V6"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
  <path
    d="M3 9H21"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
  <path
    d="M9 14H15"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  />
</svg>
Este mes no hay ningún permiso registrado.

</div>


) : (


[...estadisticas]
.sort((a,b)=>b.porcentaje-a.porcentaje)
.map((usuario)=>{


const color =
usuario.porcentaje <=25
?
"bg-green-500"
:
usuario.porcentaje <=50
?
"bg-yellow-400"
:
usuario.porcentaje <=75
?
"bg-orange-500"
:
"bg-red-600";


return (

<div
key={usuario.id}
className="rounded-2xl bg-slate-100 p-4"
>


<div className="flex justify-between items-center">

<span className="font-bold text-slate-800">
  {usuarios.find(u => u.id === usuario.id)?.activo
    ? usuario.nombre
    : (
      <span className="inline-flex items-center gap-1.5">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-slate-500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="5"
            y="10"
            width="14"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 10V7.5C8 5.57 9.57 4 11.5 4H12.5C14.43 4 16 5.57 16 7.5V10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle
            cx="12"
            cy="15"
            r="1"
            fill="currentColor"
          />
        </svg>
        Usuario inactivo
      </span>
    )}
</span>


<span className="text-sm text-slate-500">
{usuario.dias} de {usuario.laborables} días
</span>


</div>



<div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">


<div

className={`h-full rounded-full ${color}`}

style={{
width:`${usuario.porcentaje}%`
}}

/>


</div>



<div className="mt-1 text-right text-sm font-bold text-slate-600">

{usuario.porcentaje}%

</div>



</div>

)

})

)

}

</div>


</div>

      </div>


      {mostrarInfo && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

  <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">

    <div className="flex items-center justify-between">

      <h2 className="text-xl font-bold text-blue-900">
        ¿Cómo se calcula?
      </h2>

      <button
        onClick={() => setMostrarInfo(false)}
        className="text-xl text-slate-400"
      >
        ✕
      </button>

    </div>


<div className="mt-5 space-y-3 text-sm text-slate-600">

  <p>
    La ocupación se calcula comparando los días de permiso con los días de trabajo asignados según el cuadrante mensual.
  </p>

  <p>
    Los días libres no cuentan, solo se tienen en cuenta los días en los que correspondía trabajar.
  </p>

</div>

    <button
      onClick={() => setMostrarInfo(false)}
      className="mt-6 w-full rounded-xl bg-blue-900 py-3 font-bold text-white"
    >
      Entendido
    </button>


  </div>

</div>

)}

      <BottomNav />

    </main>

  );

}