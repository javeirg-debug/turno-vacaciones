"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/navigation/BottomNav";
import { supabase } from "@/lib/supabase";


export default function Avisos() {


  const [texto, setTexto] = useState("");

  const [cargando, setCargando] = useState(true);

  const [guardando, setGuardando] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const [error, setError] = useState("");





  async function cargarAviso() {


    const { data, error } = await supabase

      .from("avisos")

      .select("*")

      .eq("activo", true)

      .limit(1)
      .maybeSingle();




    if (error) {

      console.error(error);

      setError(
        "Error cargando el aviso."
      );

    }



    if (data) {

      setTexto(data.texto);

    }



    setCargando(false);


  }






  useEffect(() => {


    cargarAviso();


  }, []);








  async function guardarAviso() {



    setMensaje("");

    setError("");




    if (!texto.trim()) {


      setError(
        "Escribe un aviso antes de guardar."
      );


      return;

    }






    try {


      setGuardando(true);




      // Obtener usuario conectado

      const {
        data: { user },
      } = await supabase.auth.getUser();





      if (!user) {


        throw new Error(
          "No hay usuario conectado."
        );


      }







      // Quitar aviso anterior

const { error: borrarError } =
  await supabase
    .from("avisos")
    .delete()
    .eq("activo", true);





      if (borrarError) {

        throw borrarError;

      }









      // Crear nuevo aviso

      const { error: insertarError } =

        await supabase

          .from("avisos")

          .insert({

            texto: texto,

            activo: true,

            creado_por: user.id,

          });






      if (insertarError) {


        throw insertarError;


      }






      setMensaje(
        "✅ Aviso guardado correctamente."
      );



    } catch (err: any) {



      console.error(err);



      setError(
        err.message ||
        "Error guardando aviso."
      );



    } finally {


      setGuardando(false);


    }



  }









  async function borrarAviso() {


    setMensaje("");

    setError("");



    const confirmar = confirm(
      "¿Quieres borrar el aviso actual?"
    );



    if (!confirmar) return;






const { error } = await supabase

  .from("avisos")

  .delete()

  .eq("activo", true);





    if (error) {


      setError(
        "Error borrando aviso."
      );


      return;


    }




    setTexto("");



    setMensaje(
      "✅ Aviso eliminado."
    );



  }









  return (


    <main className="min-h-screen bg-slate-100 p-6 pb-24">



      <h1 className="text-3xl font-bold text-slate-800">

        📢 Avisos

      </h1>



      <p className="mt-2 text-slate-500">

        Aviso visible para todos los usuarios.

      </p>






      <div className="mt-8 rounded-3xl bg-white p-6 shadow">



        {cargando ? (


          <p>
            Cargando aviso...
          </p>



        ) : (



          <>


            <label className="font-semibold">

              Texto del aviso

            </label>





            <textarea

              value={texto}

              onChange={(e) =>
                setTexto(e.target.value)
              }

              rows={5}

              className="mt-3 w-full rounded-xl border p-3"

              placeholder="Escribe aquí el aviso..."

            />






            {mensaje && (

              <div className="mt-4 rounded-xl bg-green-100 p-3 text-green-800">

                {mensaje}

              </div>

            )}






            {error && (

              <div className="mt-4 rounded-xl bg-red-100 p-3 text-red-800">

                {error}

              </div>

            )}







            <button

              onClick={guardarAviso}

              disabled={guardando}

              className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white"

            >

              {guardando
                ? "Guardando..."
                : "💾 Guardar aviso"}

            </button>







            <button

              onClick={borrarAviso}

              className="mt-3 w-full rounded-xl bg-red-500 py-3 font-semibold text-white"

            >

              🗑️ Borrar aviso

            </button>




          </>


        )}



      </div>






      <BottomNav />



    </main>


  );


}