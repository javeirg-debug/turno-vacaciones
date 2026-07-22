"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import { supabase } from "@/lib/supabase";
import { obtenerAvisoActivo } from "@/services/avisos";
import { obtenerConflictosUsuario } from "@/services/conflictos";

const inicioTurno = new Date(2026, 6, 16);


function obtenerTurnoHoy() {

  const hoy = new Date();

  const diferencia = Math.floor(
    (hoy.getTime() - inicioTurno.getTime()) /
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



function formatearFecha(fecha: string) {

  return new Date(fecha).toLocaleDateString("es-ES");

}



type Usuario = {
  id: string;
  nombre: string;
  rol: string;
};



type Solicitud = {
  id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
};



type Aviso = {
  texto: string;
  creado_en: string;
  creado_por: string;

  usuarios: {
    nombre: string;
  } | null;
};

type FechaConflictiva = {
  fecha: string;
  personas: number;
};

export default function Inicio() {


  const router = useRouter();



  const [usuario, setUsuario] =
    useState<Usuario | null>(null);



  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>([]);



  const [aviso, setAviso] =
    useState<Aviso | null>(null);

const [fechasConflictivas, setFechasConflictivas] =
  useState<FechaConflictiva[] | null>(null);

  const [cargando, setCargando] =
    useState(true);





  useEffect(() => {


    async function cargar() {



      const {
        data: { user },
      } = await supabase.auth.getUser();



      if (!user) {

        router.replace("/login");

        return;

      }





      const { data: perfil } =
        await supabase
          .from("usuarios")
          .select("id,nombre,rol")
          .eq("id", user.id)
          .single();



      setUsuario(perfil);






      const hoy =
        new Date()
          .toISOString()
          .split("T")[0];






      const { data } =
        await supabase
          .from("vacaciones")
          .select("id,tipo,fecha_inicio,fecha_fin")
          .eq("usuario_id", user.id)
          .gte("fecha_fin", hoy)
          .order("fecha_inicio");





setSolicitudes(data || []);

const conflictos =
  await obtenerConflictosUsuario(user.id);

setFechasConflictivas(conflictos);

const avisoActivo =
  await obtenerAvisoActivo();



      setAviso(avisoActivo);





      setCargando(false);



    }





    cargar();



  }, [router]);










  async function cerrarSesion() {


    await supabase.auth.signOut();


    router.replace("/login");


  }







  function informacion() {

    router.push("/informacion");

  }







  return (


    <main className="min-h-screen bg-slate-100 p-6 pb-24">



      <div className="flex items-start justify-between">


        <div>


          <h1 className="text-3xl font-bold text-slate-800">

            {usuario?.nombre || "Usuario"}

          </h1>



          <p className="mt-2 text-slate-500">

            {usuario?.rol === "admin"
              ? "👑 Administrador"
              : "👤 Usuario"}

          </p>


        </div>




        <button
          onClick={informacion}
          className="rounded-full bg-amber-400 p-3 text-xl font-bold text-white shadow hover:bg-amber-500"
        >
          ⓘ
        </button>


      </div>








      <div className="mt-8 rounded-3xl bg-white p-6 shadow">


        <h2 className="text-xl font-bold">

          🕒 Turno de hoy

        </h2>



        <p className="mt-4 text-3xl font-bold">

          {obtenerTurnoHoy()}

        </p>


      </div>









      <div className="mt-6 rounded-3xl bg-amber-50 border border-amber-200 p-6 shadow">


        <h2 className="text-xl font-bold text-amber-900">

          ⚠️ Avisos

        </h2>





        {aviso ? (

          <>


            <p className="mt-3 text-amber-800">

              {aviso.texto}

            </p>





<p className="mt-4 text-sm italic text-amber-700">

  Creado por {aviso.usuarios?.nombre}

  <br />

  {formatearFecha(aviso.creado_en)}

</p>



          </>



        ) : (


          <p className="mt-3 text-amber-800">

            No hay avisos actualmente.

          </p>


        )}



      </div>


<div
className={`mt-6 rounded-3xl p-6 shadow ${
  fechasConflictivas === null
    ? "border border-slate-200 bg-white"
    : fechasConflictivas.length > 0
    ? "border border-red-200 bg-red-50"
    : "border border-green-200 bg-green-50"
}`}
>

<h2
  className={`text-xl font-bold ${
    fechasConflictivas === null
      ? "text-slate-800"
      : fechasConflictivas.length > 0
      ? "text-red-900"
      : "text-green-900"
  }`}
>
    🚨 Fechas conflictivas
  </h2>


  {fechasConflictivas === null ? (

  <p className="mt-3 text-slate-500">
    Comprobando ocupación...
  </p>

) : fechasConflictivas.length > 0 ? (

  <>
    <p className="mt-3 text-slate-700">
      Tienes coincidencias en días con alta ocupación:
    </p>

    <ul className="mt-3 space-y-2 text-slate-700">

      {fechasConflictivas.map((f) => (

        <li key={f.fecha}>
          • {new Date(f.fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })} ({f.personas} personas)
        </li>

      ))}

    </ul>

  </>

) : (

  <p className="mt-3 text-green-800">
    No tienes coincidencias en días de alta ocupación.
  </p>

)}

</div>


      <div className="mt-6 rounded-3xl bg-white p-6 shadow">


        <h2 className="text-xl font-bold">

          📅 Próximos permisos

        </h2>



        {cargando ? (

          <p className="mt-4">
            Cargando...
          </p>


        ) : solicitudes.length === 0 ? (


          <p className="mt-4 text-slate-500">

            No tienes permisos pendientes.

          </p>


        ) : (


          <div className="mt-4 space-y-3">


            {solicitudes.map((solicitud) => (


              <div
                key={solicitud.id}
                className="rounded-2xl bg-slate-100 p-4"
              >


                <p className="text-lg font-bold">

                  {solicitud.tipo}

                </p>



                <p className="mt-2">

                  📅 {formatearFecha(solicitud.fecha_inicio)}

                  {solicitud.fecha_inicio !== solicitud.fecha_fin &&
                    ` → ${formatearFecha(solicitud.fecha_fin)}`}

                </p>


              </div>


            ))}


          </div>


        )}


      </div>









      <div className="mt-6 rounded-3xl bg-white p-5 shadow">


        <h2 className="text-xl font-bold">

          👤 Cuenta

        </h2>



        <div className="mt-5 flex gap-3">



          <button
            onClick={() =>
              router.push("/cambiar-clave")
            }
            className="flex-1 rounded-xl bg-amber-500 py-3 font-semibold text-white"
          >

            🔑 Cambiar clave

          </button>





          <button
            onClick={cerrarSesion}
            className="flex-1 rounded-xl bg-slate-800 py-3 font-semibold text-white"
          >

            🚪 Salir

          </button>



        </div>


      </div>







      <BottomNav />



    </main>


  );


}