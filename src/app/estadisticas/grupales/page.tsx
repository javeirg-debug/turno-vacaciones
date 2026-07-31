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
      new Date(anio, mes + 1, 0);



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
        📊 Estadísticas grupales
      </h1>

      <p className="mt-2 text-slate-500">
        Ocupación mensual del personal.
      </p>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow">

        <div className="flex items-center justify-between gap-4">

          {/* Año */}

          <div className="flex items-center gap-3">

            <button
              onClick={() => setAnio(anio - 1)}
              className="rounded-xl bg-slate-100 px-4 py-2 shadow"
            >
              ◀
            </button>

            <span className="text-2xl font-bold">
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

          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="rounded-xl border bg-white px-4 py-2 shadow"
          >

            {meses.map((nombre, index) => (
              <option
                key={nombre}
                value={index}
              >
                {nombre}
              </option>
            ))}

          </select>

        </div>

<div className="mt-8 rounded-2xl border p-6">

<div className="mb-5">

<div className="flex items-center justify-between">

  <h2 className="text-xl font-bold text-blue-900">
    Usuarios con permisos:
  </h2>

<button
  onClick={() => setMostrarInfo(true)}
  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-yellow-400 bg-yellow-100 text-yellow-700 shadow transition hover:bg-yellow-200"
  title="Cómo se calcula"
>
  <span className="text-lg font-extrabold">i</span>
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

⏳ Calculando permisos...

</div>

) : estadisticas.length === 0 ? (

<div className="rounded-2xl bg-slate-100 p-6 text-center text-slate-500">

📅 Este mes no hay ningún permiso registrado.

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
  : "🔒 Usuario inactivo"}
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