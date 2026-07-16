"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";

export default function CambiarPasswordUsuario() {

  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [guardando, setGuardando] = useState(false);


  async function cambiarPassword() {

    const confirmar = window.confirm(
      "⚠️ ¿Estás seguro de restablecer la contraseña?\n\nLa contraseña será cambiada a 123456 y el usuario deberá cambiarla al entrar."
    );


    if (!confirmar) {
      return;
    }


    try {

      setGuardando(true);


      const respuesta = await fetch(
        "/api/usuarios/password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        }
      );


      const resultado = await respuesta.json();


      if (!respuesta.ok) {

        alert(resultado.error);
        return;

      }


      alert(
        "✅ Contraseña restablecida.\n\nEl usuario debe cambiarla al iniciar sesión."
      );


      router.push("/usuarios/gestion");


    } catch (error) {

      console.error(error);

      alert(
        "No se pudo restablecer la contraseña."
      );


    } finally {

      setGuardando(false);

    }

  }



  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <div className="rounded-3xl bg-white p-6 shadow">


        <h1 className="text-3xl font-bold">
          🔑 Restablecer contraseña
        </h1>


        <p className="mt-3 text-slate-500">
          La contraseña será cambiada a:
        </p>


        <p className="mt-2 text-xl font-bold">
          123456
        </p>


        <p className="mt-4 text-sm text-slate-500">
          El usuario tendrá que cambiarla obligatoriamente al entrar.
        </p>



        <div className="mt-8 space-y-4">


          <button

            onClick={cambiarPassword}

            disabled={guardando}

            className="w-full rounded-2xl bg-amber-500 py-3 font-semibold text-white"

          >

            {guardando
              ? "Restableciendo..."
              : "🔑 Restablecer contraseña"}

          </button>



          <button

            onClick={() =>
              router.push("/usuarios/gestion")
            }

            className="w-full rounded-2xl bg-slate-600 py-3 font-semibold text-white"

          >

            ↩️ Volver a edición

          </button>


        </div>


      </div>


      <BottomNav />


    </main>

  );

}