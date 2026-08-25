"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Usuario = {
  id: string;
  nombre: string;
  rol: string;
  categoria: string;
  puesto: string;
  sexo: string;
};

export default function EditUserForm({
  usuario,
  protegido,
}: {
  usuario: Usuario;
  protegido: boolean;
}) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [rol, setRol] = useState(usuario.rol);
  const [categoria, setCategoria] = useState(
    usuario.categoria || "policia"
  );
  const [puesto, setPuesto] = useState(usuario.puesto);
  const [sexo, setSexo] = useState(
    usuario.sexo || "hombre"
  );
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    try {
      setGuardando(true);

      const { error } = await supabase
        .from("usuarios")
        .update({
          nombre,
          rol,
          categoria,
          puesto,
          sexo,
        })
        .eq("id", usuario.id);

      if (error) {
        throw error;
      }

      alert("✅ Usuario actualizado correctamente.");
    } catch (e) {
      console.error(e);
      alert("No se pudieron guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow">

      {/* NOMBRE */}

      <label className="block text-sm font-semibold text-slate-700">
        Nombre
      </label>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />


      {/* ROL */}

      <label className="mt-6 block text-sm font-semibold text-slate-700">
        Rol
      </label>

      <select
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
      >
        <option value="admin">
          Administrador
        </option>

        <option value="usuario">
          Usuario
        </option>
      </select>


      {/* CATEGORÍA */}

      <label className="mt-6 block text-sm font-semibold text-slate-700">
        Categoría
      </label>

      <select
        value={categoria}
        onChange={(e) =>
          setCategoria(e.target.value)
        }
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
      >
        <option value="policia">
          Policía
        </option>

        <option value="oficial">
          Oficial de Policía
        </option>
      </select>


      {/* PUESTO */}

      <label className="mt-6 block text-sm font-semibold text-slate-700">
        Puesto
      </label>

      <select
        value={puesto}
        onChange={(e) => setPuesto(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
      >
        <option value="gac">
          G.A.C
        </option>

        <option value="seguridad">
          Seguridad
        </option>

        <option value="sala">
          Sala
        </option>
      </select>


      {/* SEXO */}

      <label className="mt-6 block text-sm font-semibold text-slate-700">
        Sexo
      </label>

      <select
        value={sexo}
        onChange={(e) => setSexo(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
      >
        <option value="hombre">
          Hombre
        </option>

        <option value="mujer">
          Mujer
        </option>
      </select>


      {/* ACCIONES */}

      <div className="mt-8 flex flex-col gap-3">

        {/* GUARDAR */}

        <button
          onClick={guardar}
          disabled={guardando}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 py-3.5 font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-lg">
            ✓
          </span>

          {guardando
            ? "Guardando..."
            : "Guardar cambios"}
        </button>


        {/* RESTABLECER CONTRASEÑA */}

        <a
          href={`/usuarios/password/${usuario.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-400 bg-white py-3.5 font-semibold text-orange-500 transition hover:bg-orange-50"
        >
          <span className="text-lg">
            🔑
          </span>

          Restablecer contraseña
        </a>


        {/* DESACTIVAR */}

        {!protegido && (
          <a
            href={`/usuarios/desactivar/${usuario.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3.5 font-semibold text-red-600 transition hover:bg-red-100"
          >
            <span className="text-lg">
              🔒
            </span>

            Desactivar usuario
          </a>
        )}

      </div>

    </div>
  );
}