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
  activo: boolean;
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

type ConfiguracionOcupacion = {
  minimo: number;
  maximo: number;
  color: string;
};

const [configuracion, setConfiguracion] =
  useState<ConfiguracionOcupacion[]>([]);

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

  case "Vacaciones":
    return "VAC";

  case "Asunto propio":
    return "AP";

  case "Semana Santa":
    return "SS";

  case "Navidad":
    return "NAV";

  case "Compensación horaria":
    return "CH";

  case "Indisposición":
    return "IND";

  case "Paternidad":
    return "PAT";

  case "Maternidad":
    return "MAT";

case "Lactancia":
  return "LAC";

case "Permiso urgente":
  return "URG";

case "Otros permisos":
  return "OT";

  default:
    return turno;

}

}


function colorDia(personas: number) {

  const regla = configuracion.find((c) =>

    personas >= c.minimo &&
    personas <= c.maximo

  );

  if (!regla) {
    return "bg-slate-100";
  }

  if (regla.color === "verde") {
    return "bg-green-200";
  }

  if (regla.color === "amarillo") {
    return "bg-yellow-200";
  }

  if (regla.color === "naranja") {
    return "bg-orange-200";
  }

  if (regla.color === "rojo") {
    return "bg-red-200";
  }

  return "bg-slate-100";

}

function personasFuera(fecha: Date) {

  const fechaTexto = [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, "0"),
    String(fecha.getDate()).padStart(2, "0"),
  ].join("-");

  return solicitudes.filter((s) =>
    fechaTexto >= s.fecha_inicio &&
    fechaTexto <= s.fecha_fin
  );

}


function usuarioDebeAparecer(usuario: Usuario) {

  // Los usuarios activos aparecen siempre
  if (usuario.activo) {
    return true;
  }

  // Los inactivos solo aparecen si tienen
  // algún permiso en uno de los 6 días del ciclo
  return bloque.some((fecha) => {

    const fechaTexto = [
      fecha.getFullYear(),
      String(fecha.getMonth() + 1).padStart(2, "0"),
      String(fecha.getDate()).padStart(2, "0"),
    ].join("-");

    return solicitudes.some((solicitud) => {

      return (
        solicitud.usuario_id === usuario.id &&
        fechaTexto >= solicitud.fecha_inicio &&
        fechaTexto <= solicitud.fecha_fin
      );

    });

  });

}


const [solicitudes, setSolicitudes] =
  useState<any[]>([]);

useEffect(() => {
  cargarUsuarios();
  cargarConfiguracion();

  const hoy = new Date();

  const hoySinHora = new Date(
    hoy.getFullYear(),
    hoy.getMonth(),
    hoy.getDate()
  );

  // Buscamos el día que debemos mostrar:
  // - si hoy estamos de turno → hoy
  // - si estamos libres → avanzamos hasta el próximo turno
  const fechaObjetivo = new Date(hoySinHora);

  while (!esDiaTrabajo(fechaObjetivo)) {
    fechaObjetivo.setDate(fechaObjetivo.getDate() + 1);
  }

  // Si hoy estamos de turno, buscamos el primer día
  // de ese bloque de 6 días.
  while (
    esDiaTrabajo(
      new Date(
        fechaObjetivo.getFullYear(),
        fechaObjetivo.getMonth(),
        fechaObjetivo.getDate() - 1
      )
    )
  ) {
    fechaObjetivo.setDate(fechaObjetivo.getDate() - 1);
  }

  const anioObjetivo = fechaObjetivo.getFullYear();
  const mesObjetivo = fechaObjetivo.getMonth();

  setAnio(anioObjetivo);
  setMes(mesObjetivo);

  const bloquesObjetivo = obtenerBloquesTrabajo(
    anioObjetivo,
    mesObjetivo
  );

  const indice = bloquesObjetivo.findIndex((bloque) =>
    bloque.some(
      (dia) =>
        dia.getFullYear() === fechaObjetivo.getFullYear() &&
        dia.getMonth() === fechaObjetivo.getMonth() &&
        dia.getDate() === fechaObjetivo.getDate()
    )
  );

  if (indice !== -1) {
    setCiclo(indice + 1);
  }
}, []);


async function cargarConfiguracion(){

  const { data } = await supabase
    .from("configuracion_ocupacion")
    .select("*")
    .order("minimo");

  setConfiguracion(data || []);

}

async function cargarUsuarios() {

  const { data, error } = await supabase

.from("usuarios")

.select("id,nombre,activo")

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
      <main className="min-h-screen bg-slate-100 px-3 pt-6 pb-24">

   <div className="mb-6 flex items-center justify-between">

 <h1 className="text-3xl font-bold">
  <svg
    viewBox="0 0 24 24"
    className="mr-2 inline-block h-7 w-7 align-middle text-slate-800"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      x="4"
      y="3"
      width="16"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M8 7H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 11H10M14 11H16M8 15H10M14 15H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 19H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
  Excel
</h1>

  <button
  onClick={() => setMostrarLeyenda(true)}
  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 shadow hover:bg-slate-200"
  aria-label="Información"
>
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 text-slate-600"
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
                className={`flex h-[42px] w-[42px] flex-col items-center justify-center rounded-lg ${colorDia(personasFuera(fecha).length)}`}
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

            {usuarios
  .filter((usuario) => usuarioDebeAparecer(usuario))
  .map((usuario) => (



  <React.Fragment key={usuario.id}>

    <div
                  key={usuario.id}
                 className="flex h-[42px] items-center whitespace-nowrap rounded-lg bg-slate-100 px-1 text-[9px] font-semibold"
                >
                 {usuario.activo ? (
  nombreCorto(usuario.nombre)
) : (
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
    Inactivo
  </span>
)}
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

  case "IND":
    color = "bg-orange-500";
    break;

  case "PAT":
    color = "bg-pink-500";
    break;

  case "MAT":
    color = "bg-rose-500";
    break;

case "LAC":
  color = "bg-cyan-500";
  break;

case "URG":
  color = "bg-red-500";
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
        onClick={() => router.push(`/calendario/${fechaTexto}`)}
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
        El color de cada turno representa la ocupación prevista según el número de Personas de permiso.
      </p>

      <div className="space-y-4 text-sm">

        <div>

          <h3 className="mb-2 font-bold text-slate-700">
            Ocupación del turno
          </h3>

          <div className="space-y-2">

            {configuracion.map((c) => {

              let color = "bg-slate-200";

              if (c.color === "verde") color = "bg-green-200";
              if (c.color === "amarillo") color = "bg-yellow-200";
              if (c.color === "naranja") color = "bg-orange-200";
              if (c.color === "rojo") color = "bg-red-200";

              return (
                <div
                  key={`${c.minimo}-${c.maximo}`}
                  className="flex items-center gap-3"
                >
                  <div className={`h-5 w-5 rounded ${color}`}></div>

                  {c.minimo} - {c.maximo} Personas
                </div>
              );

            })}

          </div>

        </div>

        <div>

          <h3 className="mb-2 font-bold text-slate-700">
            Permisos
          </h3>

          <div className="space-y-2">

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-teal-500"></div>
              Vacaciones
            </div>

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-sky-500"></div>
              Asunto propio
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
              <div className="h-5 w-5 rounded bg-orange-500"></div>
              Indisposición
            </div>

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-pink-500"></div>
              Paternidad
            </div>

            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded bg-rose-500"></div>
              Maternidad
            </div>

<div className="flex items-center gap-3">
  <div className="h-5 w-5 rounded bg-cyan-500"></div>
  Lactancia
</div>

<div className="flex items-center gap-3">
  <div className="h-5 w-5 rounded bg-red-500"></div>
  Permiso urgente
</div>

<div className="flex items-center gap-3">
  <div className="h-5 w-5 rounded bg-fuchsia-500"></div>
  Otros permisos
</div>

          </div>

        </div>

      </div>

    </div>

  </div>
)}
      <BottomNav />

    </main>
  );
}