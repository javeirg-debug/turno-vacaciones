"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/navigation/BottomNav";

export default function CambiarClave() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const obligatorio = searchParams.get("obligatorio") === "true";


  const [guardando, setGuardando] = useState(false);

  const [clave, setClave] = useState("");

  const [repetir, setRepetir] = useState("");

  const [verClave, setVerClave] = useState(false);

  const [verRepetir, setVerRepetir] = useState(false);

  const [mensaje, setMensaje] = useState("");



  async function guardar() {


    if (clave.length < 6) {

      setMensaje(
        "La contraseña debe tener al menos 6 caracteres."
      );

      return;

    }


    if (clave !== repetir) {

      setMensaje(
        "Las contraseñas no coinciden."
      );

      return;

    }



    try {

      setGuardando(true);

      setMensaje("");



      const { error } =
        await supabase.auth.updateUser({

          password: clave,

        });



      if (error) {

        throw error;

      }



      const { data: usuarioAuth } =
        await supabase.auth.getUser();



      if (!usuarioAuth.user) {

        throw new Error(
          "No hay usuario conectado"
        );

      }



      const { error: perfilError } =
        await supabase

          .from("usuarios")

          .update({

            debe_cambiar_clave: false,

          })

          .eq(
            "id",
            usuarioAuth.user.id
          );



      if (perfilError) {

        throw perfilError;

      }



      router.push("/inicio");



    } catch (error: any) {

      setMensaje(error.message);


    } finally {

      setGuardando(false);

    }

  }




  return (

    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6 pb-24">


      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow">


        <h1 className="text-3xl font-bold">

          🔒 Cambiar contraseña

        </h1>



        <p className="mt-3 text-slate-500">

          {obligatorio
            ? "Por seguridad debes cambiar la contraseña temporal antes de continuar."
            : "Cambia tu contraseña cuando lo necesites."}

        </p>



        <div className="mt-6">


          <label className="font-semibold">

            Nueva contraseña

          </label>


          <div className="mt-2 flex">


            <input

              type={verClave ? "text" : "password"}

              value={clave}

              onChange={(e) => setClave(e.target.value)}

              className="flex-1 rounded-l-xl border p-3"

            />


            <button

              type="button"

              onClick={() => setVerClave(!verClave)}

              className="rounded-r-xl border border-l-0 px-4"

            >

              {verClave ? "🙈" : "👁️"}

            </button>


          </div>


        </div>



        <div className="mt-5">


          <label className="font-semibold">

            Repetir contraseña

          </label>


          <div className="mt-2 flex">


            <input

              type={verRepetir ? "text" : "password"}

              value={repetir}

              onChange={(e) => setRepetir(e.target.value)}

              className="flex-1 rounded-l-xl border p-3"

            />


            <button

              type="button"

              onClick={() => setVerRepetir(!verRepetir)}

              className="rounded-r-xl border border-l-0 px-4"

            >

              {verRepetir ? "🙈" : "👁️"}

            </button>


          </div>


        </div>



        {mensaje && (

          <p className="mt-4 text-red-600">

            {mensaje}

          </p>

        )}




        <button

          onClick={guardar}

          disabled={guardando}

          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white"

        >

          {guardando
            ? "Guardando..."
            : "Guardar contraseña"}

        </button>



        {!obligatorio && (

          <button

            onClick={() => router.push("/inicio")}

            className="mt-4 w-full rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700"

          >

            ⬅️ Volver a inicio

          </button>

        )}



      </div>



      {!obligatorio && (

        <BottomNav />

      )}



    </main>

  );

}