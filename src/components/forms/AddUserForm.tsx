"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";


export default function AddUserForm() {


  const [nombre, setNombre] = useState("");

  const [email, setEmail] = useState("");

  const [rol, setRol] = useState("usuario");

  const [mensaje, setMensaje] = useState("");





  async function crearUsuario() {


    if (!nombre || !email) {

      setMensaje("Completa nombre y email");

      return;

    }





    try {


const respuesta = await fetch(
  "/api/crear-usuario",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      nombre,
      email,
      rol,
    }),
  }
);



const resultado = await respuesta.json();



if(!resultado.ok){

  throw new Error(
    resultado.error
  );

}







      setMensaje(
        "✅ Usuario creado. Clave inicial: 123456"
      );



      setNombre("");

      setEmail("");

      setRol("usuario");





    } catch (error: any) {


      console.error(error);


      setMensaje(
        "❌ " + error.message
      );


    }


  }







  return (

    <div className="rounded-2xl bg-white p-5 shadow">



      <h2 className="text-xl font-bold">

        ➕ Nuevo Usuario

      </h2>







      <input

        className="mt-4 w-full rounded-xl border p-3"

        placeholder="Nombre"

        value={nombre}

        onChange={(e) =>
          setNombre(e.target.value)
        }

      />







      <input

        className="mt-3 w-full rounded-xl border p-3"

        placeholder="Email"

        type="email"

        value={email}

        onChange={(e) =>
          setEmail(e.target.value)
        }

      />







      <select

        className="mt-3 w-full rounded-xl border p-3"

        value={rol}

        onChange={(e) =>
          setRol(e.target.value)
        }

      >

        <option value="usuario">

          Policía

        </option>



        <option value="admin">

          Administrador

        </option>


      </select>







      <button

        onClick={crearUsuario}

        className="mt-4 w-full rounded-xl bg-black p-3 text-white"

      >

        Crear usuario

      </button>







      {
        mensaje && (

          <p className="mt-3">

            {mensaje}

          </p>

        )
      }





    </div>

  );

}