"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddUserForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");

  const [mostrarPuestos, setMostrarPuestos] = useState(false);

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
        "Usuario creado. Clave inicial: 123456"
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
        error.message
      );
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="flex items-center gap-2 text-xl font-bold">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <circle cx="9" cy="8" r="3.5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 20a6 6 0 0 1 12 0"
          />
          <path
            strokeLinecap="round"
            d="M18 11v6M15 14h6"
          />
        </svg>

        Nuevo Usuario
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

  <div className="relative mt-2">
    <button
      type="button"
      onClick={() =>
        setMostrarPuestos(!mostrarPuestos)
      }
      className="
        flex
        w-full
        items-center
        justify-between
        rounded-xl
        border
        border-slate-200
        bg-white
        p-3
        text-left
        transition
        hover:border-slate-300
      "
    >
      <span className="flex items-center gap-3">
        {puesto === "gac" && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 14h14l-1-5H6l-1 5Z"
            />
            <path
              strokeLinecap="round"
              d="M7 14v3M17 14v3M8 9l1-3h6l1 3"
            />
            <circle cx="8" cy="17" r="1.5" />
            <circle cx="16" cy="17" r="1.5" />
          </svg>
        )}

        {puesto === "seguridad" && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3 20 6v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 12 2 2 4-4"
            />
          </svg>
        )}

        {puesto === "sala" && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="13"
              rx="2"
            />
            <path
              strokeLinecap="round"
              d="M8 21h8M12 17v4"
            />
          </svg>
        )}

        <span className="font-medium text-slate-800">
          {puesto === "gac" && "G.A.C"}
          {puesto === "seguridad" && "Seguridad"}
          {puesto === "sala" && "Sala"}
        </span>
      </span>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`h-5 w-5 text-slate-400 transition ${
          mostrarPuestos ? "rotate-180" : ""
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m6 9 6 6 6-6"
        />
      </svg>
    </button>

    {mostrarPuestos && (
      <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

        <button
          type="button"
          onClick={() => {
            setPuesto("gac");
            setMostrarPuestos(false);
          }}
          className="flex w-full items-center gap-3 p-3 text-left hover:bg-slate-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 14h14l-1-5H6l-1 5Z"
            />
            <path
              strokeLinecap="round"
              d="M7 14v3M17 14v3M8 9l1-3h6l1 3"
            />
            <circle cx="8" cy="17" r="1.5" />
            <circle cx="16" cy="17" r="1.5" />
          </svg>

          <span className="font-medium">
            G.A.C
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setPuesto("seguridad");
            setMostrarPuestos(false);
          }}
          className="flex w-full items-center gap-3 border-t border-slate-100 p-3 text-left hover:bg-slate-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3 20 6v5c0 5-3.3 8.5-8 10-4.7-1.5-8-5-8-10V6l8-3Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m9 12 2 2 4-4"
            />
          </svg>

          <span className="font-medium">
            Seguridad
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setPuesto("sala");
            setMostrarPuestos(false);
          }}
          className="flex w-full items-center gap-3 border-t border-slate-100 p-3 text-left hover:bg-slate-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="13"
              rx="2"
            />
            <path
              strokeLinecap="round"
              d="M8 21h8M12 17v4"
            />
          </svg>

          <span className="font-medium">
            Sala
          </span>
        </button>

      </div>
    )}
  </div>
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
          flex
          w-full
          items-center
          justify-center
          gap-2
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
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle cx="9" cy="8" r="3.5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 20a6 6 0 0 1 12 0"
          />
          <path
            strokeLinecap="round"
            d="M18 11v6M15 14h6"
          />
        </svg>

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