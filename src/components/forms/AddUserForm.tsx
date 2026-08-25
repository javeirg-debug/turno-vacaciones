"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddUserForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  // Rol = permisos dentro de la aplicación
  const [rol, setRol] = useState("usuario");

  // Categoría = categoría profesional
  const [categoria, setCategoria] = useState("policia");

  const [puesto, setPuesto] = useState("gac");
  const [sexo, setSexo] = useState("hombre");
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
            categoria,
            puesto,
            sexo,
          }),
        }
      );

      const resultado = await respuesta.json();

      if (!resultado.ok) {
        throw new Error(resultado.error);
      }

      setMensaje(
        "✅ Usuario creado. Clave inicial: 123456"
      );

      setNombre("");
      setEmail("");
      setRol("usuario");
      setCategoria("policia");
      setPuesto("gac");
      setSexo("hombre");

    } catch (error: any) {
      console.error(error);

      setMensaje(
        "❌ " + error.message
      );
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="text-xl font-bold">
        ➕ Nuevo Usuario
      </h2>


      {/* NOMBRE */}

      <div className="mt-6">

        <label className="block font-semibold text-slate-700">
          Nombre
        </label>

        <input
          className="mt-2 w-full rounded-xl border border-slate-200 p-3"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
        />

      </div>


      {/* EMAIL */}

      <div className="mt-5">

        <label className="block font-semibold text-slate-700">
          Email
        </label>

        <input
          className="mt-2 w-full rounded-xl border border-slate-200 p-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

      </div>


      {/* ROL */}

      <div className="mt-5">

        <label className="block font-semibold text-slate-700">
          Rol
        </label>

        <select
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3"
          value={rol}
          onChange={(e) =>
            setRol(e.target.value)
          }
        >

          <option value="usuario">
            Usuario
          </option>

          <option value="admin">
            Administrador
          </option>

        </select>

      </div>


      {/* CATEGORÍA */}

      <div className="mt-5">

        <label className="block font-semibold text-slate-700">
          Categoría
        </label>

        <select
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3"
          value={categoria}
          onChange={(e) =>
            setCategoria(e.target.value)
          }
        >

          <option value="policia">
            Policía
          </option>

          <option value="oficial">
            Oficial de Policía
          </option>

        </select>

      </div>


      {/* PUESTO */}

      <div className="mt-5">

        <label className="block font-semibold text-slate-700">
          Puesto
        </label>

        <select
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3"
          value={puesto}
          onChange={(e) =>
            setPuesto(e.target.value)
          }
        >

          <option value="gac">
            🚓 G.A.C
          </option>

          <option value="seguridad">
            🛡️ Seguridad
          </option>

          <option value="sala">
            🖥️ Sala
          </option>

        </select>

      </div>


      {/* SEXO */}

      <div className="mt-5">

        <label className="block font-semibold text-slate-700">
          Sexo
        </label>

        <select
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3"
          value={sexo}
          onChange={(e) =>
            setSexo(e.target.value)
          }
        >

          <option value="hombre">
            Hombre
          </option>

          <option value="mujer">
            Mujer
          </option>

        </select>

      </div>


      {/* CREAR */}

      <button
        onClick={crearUsuario}
        className="
          mt-7
          w-full
          rounded-2xl
          bg-slate-800
          py-3
          font-semibold
          text-white
          shadow-md
          transition
          hover:bg-slate-700
          active:scale-[0.98]
        "
      >
        Crear usuario
      </button>


      {/* MENSAJE */}

      {mensaje && (

        <p className="
          mt-4
          rounded-xl
          bg-slate-100
          p-3
          text-center
          text-sm
        ">
          {mensaje}
        </p>

      )}

    </div>
  );
}