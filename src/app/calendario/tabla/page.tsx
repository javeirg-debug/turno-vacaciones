"use client";

import BottomNav from "@/components/navigation/BottomNav";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";


const dias = ["16", "17", "18", "19", "20", "21"];
const semana = ["J", "V", "S", "D", "L", "M"];

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
  const [anio, setAnio] =
  useState(new Date().getFullYear());

const [mes, setMes] =
  useState(new Date().getMonth());

  const [ciclo, setCiclo] = useState(1);

  const [usuarios, setUsuarios] =
  useState<Usuario[]>([]);

  useEffect(() => {

  cargarUsuarios();

}, []);

async function cargarUsuarios() {

  const { data, error } = await supabase

    .from("usuarios")

    .select("id,nombre")

    .order("nombre");

  if (error) {

    console.error(error);
    return;

  }

  setUsuarios(data || []);

}

  return (
    <main className="min-h-screen bg-slate-100 p-5 pb-24">

      <h1 className="mb-6 text-2xl font-bold text-slate-800">
        Calendario en tabla
      </h1>

      {/* CENTRAR TODO */}

      <div className="w-full overflow-x-auto">

        {/* TARJETA */}

        

<div className="mx-auto w-max rounded-3xl bg-white p-6 shadow-xl">
  
 <div className="mb-6">

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
      <option value={1}>1er ciclo</option>
      <option value={2}>2º ciclo</option>
      <option value={3}>3er ciclo</option>
      <option value={4}>4º ciclo</option>
      <option value={5}>5º ciclo</option>
    </select>

  </div>

</div>


<div className="mb-6">

  <div className="w-full rounded-xl bg-slate-800 py-2 text-center text-[11px] font-bold tracking-[0.25em] text-white">

    JULIO / AGOSTO

  </div>

</div>
          {/* TABLA */}

          <div
  className="grid gap-2"
  style={{
    gridTemplateColumns: "max-content repeat(6,42px)",
  }}
>

            {/* ESQUINA */}

            <div></div>

            {/* DÍAS */}

            {dias.map((dia, i) => (

              <div
                key={dia}
                className="flex h-[42px] w-[42px] flex-col items-center justify-center rounded-lg bg-slate-100"
              >

                <span className="text-[8px] text-slate-500">
                  {semana[i]}
                </span>

                <span className="text-[10px] font-bold">
                  {dia}
                </span>

              </div>

            ))}

            {/* USUARIOS */}

            {usuarios.map((usuario) => (

              <>
                <div
                  key={usuario.id}
                 className="flex h-[42px] items-center whitespace-nowrap rounded-lg bg-slate-100 px-2 text-[9px] font-semibold"
                >
                  {nombreCorto(usuario.nombre)}
                </div>

                {dias.map((dia) => (

                  <button
                    key={usuario.id + dia}
                    className="
                      h-[42px]
                      w-[42px]
                      rounded-lg
                      bg-white
                      shadow-sm
                      ring-1
                      ring-slate-200
                      transition
                      hover:bg-blue-50
                    "
                  />

                ))}

              </>

            ))}

          </div>

        </div>

      </div>

      <BottomNav />

    </main>
  );
}