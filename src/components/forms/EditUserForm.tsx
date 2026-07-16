"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Usuario = {
  id: string;
  nombre: string;
  rol: string;
};

export default function EditUserForm({
  usuario,
}: {
  usuario: Usuario;
}) {

  const [nombre, setNombre] = useState(usuario.nombre);
  const [rol, setRol] = useState(usuario.rol);
  const [guardando, setGuardando] = useState(false);

  async function guardar() {

    try {

      setGuardando(true);

      const { error } = await supabase
        .from("usuarios")
        .update({
          nombre,
          rol,
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

    <div className="rounded-2xl bg-white p-6 shadow">

      <label className="block font-semibold">
        Nombre
      </label>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="mt-2 w-full rounded-xl border p-3"
      />

      <label className="mt-6 block font-semibold">
        Rol
      </label>

      <select
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        className="mt-2 w-full rounded-xl border p-3"
      >
        <option value="admin">
          Administrador
        </option>

        <option value="usuario">
          Policía
        </option>

      </select>

      <div className="mt-8 text-center">

        <button
          onClick={guardar}
          disabled={guardando}
          className="inline-block rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          {guardando
            ? "Guardando..."
            : "💾 Guardar cambios"}
        </button>

      </div>

    </div>

  );

}