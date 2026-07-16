"use client";

import { useState } from "react";


function calcularTurno(fecha: Date) {

  const inicio = new Date("2026-07-16");

  const diferencia = Math.floor(
    (fecha.getTime() - inicio.getTime()) /
    (1000 * 60 * 60 * 24)
  );


  const ciclo = ((diferencia % 12) + 12) % 12;


  if (ciclo === 0 || ciclo === 1) return "🌅";
  if (ciclo === 2 || ciclo === 3) return "🌆";
  if (ciclo === 4 || ciclo === 5) return "🌙";

  return "⚪";
}


export default function CalendarioTurnos() {


  const hoy = new Date();


  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());


  function cambiarMes(valor:number) {

    let nuevoMes = mes + valor;
    let nuevoAnio = anio;


    if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio++;
    }


    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio--;
    }


    setMes(nuevoMes);
    setAnio(nuevoAnio);

  }



  const nombreMes = new Date(anio, mes)
    .toLocaleString("es-ES", {
      month:"long"
    });


  const diasMes = new Date(
    anio,
    mes + 1,
    0
  ).getDate();



  const primerDia = new Date(
    anio,
    mes,
    1
  ).getDay();


  const huecos = primerDia === 0 ? 6 : primerDia - 1;



  return (

    <div>


      <p className="mt-2 text-slate-500 capitalize">
        {nombreMes} {anio}
      </p>


      <div className="mt-5 flex justify-between">

        <button
          onClick={()=>cambiarMes(-1)}
          className="rounded-xl bg-white px-4 py-2 shadow"
        >
          ◀
        </button>


        <button
          onClick={()=>cambiarMes(1)}
          className="rounded-xl bg-white px-4 py-2 shadow"
        >
          ▶
        </button>

      </div>



      <div className="mt-6 grid grid-cols-7 gap-2">


        {Array.from({length:huecos}).map((_,i)=>
          <div key={i}></div>
        )}



        {Array.from({length:diasMes}).map((_,i)=>{


          const dia = i + 1;


          const fecha = new Date(
            anio,
            mes,
            dia
          );


          return (

            <div
              key={dia}
              className="rounded-xl bg-white p-3 text-center shadow"
            >

              <div className="font-bold">
                {dia}
              </div>


              <div className="mt-2 text-xl">
                {calcularTurno(fecha)}
              </div>

            </div>

          )


        })}


      </div>


    </div>

  );

}