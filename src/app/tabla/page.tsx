"use client";

import BottomNav from "@/components/navigation/BottomNav";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";


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

function esDiaTrabajo(fecha: Date) {

  const diferencia = Math.floor(
    (fecha.getTime() - inicioTurno.getTime()) /
    (1000 * 60 * 60 * 24)
  );

  const ciclo =
    ((diferencia % 12) + 12) % 12;

  return ciclo < 6;

}

function obtenerTurno(fecha: Date) {

  const diferencia = Math.floor(
    (fecha.getTime() - inicioTurno.getTime()) /
    (1000 * 60 * 60 * 24)
  );

  const ciclo =
    ((diferencia % 12) + 12) % 12;

  switch (ciclo) {

    case 0:
    case 1:
      return "M";

    case 2:
    case 3:
      return "T";

    case 4:
    case 5:
      return "N";

    default:
      return "";

  }

}


function obtenerBloquesTrabajo(
  anio: number,
  mes: number
) {

  const bloques: Date[][] = [];

  let fecha = new Date(anio, mes, 1);

  fecha.setDate(fecha.getDate() - 20);

  const fin = new Date(anio, mes + 1, 20);

  while (fecha <= fin) {

    if (esDiaTrabajo(fecha)) {

      const bloque: Date[] = [];

      for (let i = 0; i < 6; i++) {

        const f = new Date(fecha);

        f.setDate(fecha.getDate() + i);

        bloque.push(f);

      }

      const pertenece = bloque.some(
        d =>
          d.getMonth() === mes &&
          d.getFullYear() === anio
      );

      if (pertenece) {

        bloques.push(bloque);

      }

      fecha.setDate(fecha.getDate() + 6);

    } else {

      fecha.setDate(fecha.getDate() + 1);

    }

  }

  return bloques;

}


type Usuario = {
  id: string;
  nombre: string;
};


function nombreCorto(nombre: string) {

  const partes = nombre.trim().split(" ");

  if (partes.length === 1) return partes[0];

  return (
    partes[0] +
    " " +
    partes
      .slice(1)
      .map(p => p[0] + ".")
      .join(" ")
  );

}


export default function CalendarioTabla() {

const { usuario } = useUser();

const router = useRouter();

  const [anio, setAnio] =
  useState(new Date().getFullYear());

const [mes, setMes] =
  useState(new Date().getMonth());

  const [ciclo, setCiclo] = useState(1);

const [mostrarLeyenda, setMostrarLeyenda] = useState(false);

  const bloques = obtenerBloquesTrabajo(anio, mes);

const bloque = bloques[ciclo - 1] || [];

const mesesBloque = [...new Set(bloque.map(f => f.getMonth()))];

const tituloBloque = mesesBloque
  .map(m => meses[m].toUpperCase())
  .join(" / ");


const [usuarios, setUsuarios] =
useState<Usuario[]>([]);

function obtenerIncidencia(
  usuarioId: string,
  fecha: Date,
  turno: string
) {

  
const fechaTexto = [
  fecha.getFullYear(),
  String(fecha.getMonth() + 1).padStart(2, "0"),
  String(fecha.getDate()).padStart(2, "0"),
].join("-");

const solicitud = solicitudes.find((s) => {


  
  return (
    s.usuario_id === usuarioId &&
    fechaTexto >= s.fecha_inicio &&
    fechaTexto <= s.fecha_fin
  );

});

if (!solicitud) return turno;


switch (solicitud.tipo) {

  case "🌴 Vacaciones":
    return "VAC";

  case "🟢 AP":
    return "AP";

  case "✝️ Semana Santa":
    return "SS";

  case "🎄 Navidad":
    return "NAV";

  case "⏰ Compensación horaria":
    return "CH";

  case "📄 Otros permisos":
    return "OT";

  default:
    return turno;

}

}

const [solicitudes, setSolicitudes] =
  useState<any[]>([]);

  useEffect(() => {

  cargarUsuarios();

}, []);

async function cargarUsuarios() {

  const { data, error } = await supabase

    .from("usuarios")

    .select("id,nombre")

    .order("nombre");

  if (error) {

    
    return;

  }

  const lista = data || [];

lista.sort((a, b) => {
  if (a.id === usuario?.id) return -1;
  if (b.id === usuario?.id) return 1;
  return a.nombre.localeCompare(b.nombre);
});

setUsuarios(lista);



const { data: solicitudesData, error: solicitudesError } =
  await supabase
    .from("vacaciones_con_usuario")
    .select("*");

console.log(JSON.stringify(solicitudesData?.[0], null, 2));

if (solicitudesError) {

} else {
  setSolicitudes(solicitudesData || []);

}

}

  return (
      <main className="min-h-screen bg-slate-100 p-6 pb-24">

   <h1 className="mb-6 text-3xl font-bold">
      🧮 Excel
    </h1>

      {/* CENTRAR TODO */}

      <div className="w-full overflow-x-auto">

        {/* TARJETA */}

        

<div className="mx-auto w-max rounded-3xl bg-white p-2 shadow-xl">
  
 <div className="mb-3">

  {/* AÑO */}

  <div className="mb-4 flex items-center justify-center gap-3">

    <button
      onClick={() => setAnio(anio - 1)}
      className="h-8 w-8 rounded-full bg-slate-100 shadow hover:bg-slate-200"
    >
      ◀
    </button>

    <span className="min-w-[70px] text-center text-lg font-bold text-slate-700">
      {anio}
    </span>

    <button
      onClick={() => setAnio(anio + 1)}
      className="h-8 w-8 rounded-full bg-slate-100 shadow hover:bg-slate-200"
    >
      ▶
    </button>

    <button
  onClick={() => setMostrarLeyenda(true)}
  className="ml-2 h-8 w-8 rounded-full bg-blue-100 shadow hover:bg-blue-200"
>
  ℹ️
</button>

  </div>

  {/* MES + CICLO */}

  <div className="flex justify-center gap-3">

    <select
      value={mes}
      onChange={(e) => setMes(Number(e.target.value))}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm"
    >
      {meses.map((nombre, i) => (
        <option key={i} value={i}>
          {nombre}
        </option>
      ))}
    </select>

<select
  value={ciclo}
  onChange={(e) => setCiclo(Number(e.target.value))}
  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm"
>

  {bloques.map((_, i) => (

    <option
      key={i}
      value={i + 1}
    >
      {i + 1}º ciclo
    </option>

  ))}

</select>

  </div>

</div>


<div className="mb-6">

  <div className="w-full rounded-xl bg-slate-800 py-2 text-center text-[11px] font-bold tracking-[0.25em] text-white">

    {tituloBloque}

  </div>

</div>
          {/* TABLA */}

          <div
  className="grid gap-1"
  style={{
    gridTemplateColumns: "max-content repeat(6,42px)",
  }}
>

            {/* ESQUINA */}

            <div></div>

            {/* DÍAS */}

            {bloque.map((fecha, i) => (

              <div
                key={fecha.toISOString()}
                className="flex h-[42px] w-[42px] flex-col items-center justify-center rounded-lg bg-slate-100"
              >

                <span className="text-[8px] text-slate-500">
                  {["L","M","X","J","V","S","D"][(fecha.getDay()+6)%7]}
                </span>

                <span className="text-[10px] font-bold">
                  {fecha.getDate()}
                </span>

              </div>

            ))}

            {/* USUARIOS */}

            {usuarios.map((usuario) => (



  <React.Fragment key={usuario.id}>

    <div
                  key={usuario.id}
                 className="flex h-[42px] items-center whitespace-nowrap rounded-lg bg-slate-100 px-1 text-[9px] font-semibold"
                >
                  {nombreCorto(usuario.nombre)}
                </div>

               {bloque.map((fecha) => {

  const incidencia = obtenerIncidencia(
    usuario.id,
    fecha,
    obtenerTurno(fecha)
  );

let color = "bg-white";

if (fecha.getMonth() !== mes) {
  color = "bg-slate-200";
}

switch (incidencia) {

  case "VAC":
    color = "bg-teal-500";
    break;

  case "AP":
    color = "bg-sky-500";
    break;

  case "SS":
    color = "bg-violet-500";
    break;

  case "NAV":
    color = "bg-indigo-500";
    break;

  case "CH":
   color = "bg-slate-600";
    break;

  case "OT":
    color = "bg-fuchsia-500";
    break;

}

  const fechaTexto = [
  fecha.getFullYear(),
  String(fecha.getMonth() + 1).padStart(2, "0"),
  String(fecha.getDate()).padStart(2, "0"),
].join("-");

return (
  <button
    key={usuario.id + fecha.toISOString()}
    onClick={() => router.push(`/tabla/${fechaTexto}`)}
    className={`
      h-[42px]
      w-[42px]
      rounded-lg
      text-[10px]
      font-bold
      shadow-sm
      ring-1
      ring-slate-200
      transition
      hover:scale-105
      cursor-pointer
      ${color}
      ${
        color === "bg-white" || color === "bg-slate-200"
          ? "text-slate-700"
          : "text-white"
      }
    `}
  >
    {incidencia}
  </button>
);

})}

              </React.Fragment>

            ))}

          </div>

        </div>

      </div>
{mostrarLeyenda && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

    <div className="w-80 rounded-2xl bg-white p-6 shadow-2xl">

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Leyenda
        </h2>

        <button
          onClick={() => setMostrarLeyenda(false)}
          className="rounded-full bg-slate-200 px-3 py-1"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-sm">

        <div className="flex items-center gap-3">
         <div className="h-5 w-5 rounded bg-teal-500"></div>
          Vacaciones
        </div>

        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded bg-sky-500"></div>
          AP
        </div>

        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded bg-violet-500"></div>
          Semana Santa
        </div>

        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded bg-indigo-500"></div>
          Navidad
        </div>

        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded bg-slate-600"></div>
          Compensación horaria
        </div>

        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded bg-fuchsia-500"></div>
          Otros permisos
        </div>

      </div>

    </div>

  </div>
)}
      <BottomNav />

    </main>
  );
}