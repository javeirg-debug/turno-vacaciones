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
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}



type Usuario = {
  id: string;
  nombre: string;
  rol: string;
  puesto: string;
  sexo: string;
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
  gac: number;
  seguridad: number;
  sala: number;
};

export default function Inicio() {


  const router = useRouter();



  const [usuario, setUsuario] =
    useState<Usuario | null>(null);



  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>([]);

const [solicitudesVista, setSolicitudesVista] =
    useState<any[]>([]);

  const [aviso, setAviso] =
    useState<Aviso | null>(null);

const [fechasConflictivas, setFechasConflictivas] =
  useState<FechaConflictiva[] | null>(null);

  const [cargando, setCargando] =
    useState(true);

const [mostrarInfo, setMostrarInfo] = useState(false);



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
          .select("id,nombre,rol,puesto,sexo")
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





const lista = data || [];

const agrupadas:any[] = [];


lista.forEach((s) => {


  if (
    s.tipo === "🎄 Navidad" ||
    s.tipo === "✝️ Semana Santa"
  ) {


    let grupo = agrupadas.find(
      (x) =>
        x.tipo === s.tipo
    );


    if (grupo) {

      grupo.dias.push(
        s.fecha_inicio
      );


    } else {


      agrupadas.push({

        ...s,

        dias:[
          s.fecha_inicio
        ]

      });


    }


  } else {


    agrupadas.push(s);


  }


});


setSolicitudes(lista);

setSolicitudesVista(agrupadas);

const conflictos =
  await obtenerConflictosUsuario(user.id);
console.log(conflictos);

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
  : usuario?.sexo === "mujer"
  ? "👮‍♀️ Policía"
  : "👮‍♂️ Policía"}

</p>

<p className="mt-1 text-slate-500">

  {usuario?.puesto === "gac"
    ? "🚓 G.A.C"
    : usuario?.puesto === "seguridad"
    ? "🛡️ Seguridad"
    : usuario?.puesto === "sala"
    ? "🖥️ Sala"
    : "—"}

</p>


        </div>




<button
  onClick={() => setMostrarInfo(true)}
  className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 shadow transition hover:bg-blue-200"
>
  ℹ️
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
    🚨 Fechas conflictivas
  </h2>


  {fechasConflictivas === null ? (

    <p className="text-sm text-slate-500">
      Comprobando ocupación...
    </p>


  ) : fechasConflictivas.length > 0 ? (

  <>
      <p className="mb-2 text-sm text-slate-700">
        Tienes coincidencias en fechas de alta ocupación:
      </p>

    <div className="space-y-2">


      {fechasConflictivas.map((f) => (


        <button
          key={f.fecha}
          onClick={() => router.push(`/calendario/${f.fecha}`)}
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
  })}{" "}
  · 👥 {f.gac + f.seguridad + f.sala}
</p>

          </div>



          {/* DATOS */}

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
                🚓 G.A.C.:{" "}
                <span className="font-bold text-slate-800">
                  {f.gac}
                </span>
              </p>

            </div>



            <div className="border-x border-red-200">

              <p className="text-xs text-slate-500">
                🛡️ Seguridad:{" "}
                <span className="font-bold text-slate-800">
                  {f.seguridad}
                </span>
              </p>

            </div>



            <div>

              <p className="text-xs text-slate-500">
                🖥️ Sala:{" "}
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


            {solicitudesVista.map((solicitud) => (

  <button
    key={solicitud.id}
    onClick={() => router.push("/solicitudes")}
    className="w-full rounded-2xl bg-slate-100 p-4 text-left transition active:scale-95"
  >


                <p className="text-lg font-bold">

                  {solicitud.tipo}

                </p>



                {solicitud.dias ? (

<div className="mt-2 space-y-1">

{solicitud.dias.map(
(dia:string,index:number)=>(

<p key={dia}>
📅 Día {index + 1}: {formatearFecha(dia)}
</p>

)

)}

</div>

) : (

<p className="mt-2">

📅 {formatearFecha(solicitud.fecha_inicio)}

{solicitud.fecha_inicio !== solicitud.fecha_fin &&
` → ${formatearFecha(solicitud.fecha_fin)}`}

</p>

)}


              </button>


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



{mostrarInfo && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

    <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-bold text-blue-900">
          ℹ️ Información de la aplicación
        </h2>

        <button
          onClick={() => setMostrarInfo(false)}
          className="text-xl text-slate-400"
        >
          ✕
        </button>

      </div>

<div className="mt-6 max-h-[60vh] space-y-5 overflow-y-auto text-sm leading-7 text-slate-700">

  <div>
    <h3 className="mb-2 text-lg font-bold text-blue-900">
      📱 Sobre la aplicación
    </h3>

    <p>
      Esta aplicación ha sido desarrollada de manera completamente altruista,
      con el único objetivo de facilitar la organización y coordinación de los
      turnos de vacaciones entre los funcionarios.
    </p>

    <p className="mt-3">
      Se trata de una herramienta de apoyo para mejorar la comunicación y la
      planificación interna, <strong>sin sustituir en ningún caso los
      procedimientos oficiales ni las autorizaciones correspondientes.</strong>
    </p>

    <p className="mt-3">
      Cualquier permiso o incidencia deberá seguir tramitándose por los canales
      oficiales establecidos.
    </p>

    <p className="mt-3">
      Gracias a todos los compañeros por utilizarla y contribuir a una mejor
      coordinación del servicio.
    </p>

  </div>

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