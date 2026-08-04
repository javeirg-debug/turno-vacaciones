"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Usuario = {
  id: string;
  nombre: string;
  rol: string;
  puesto: string;
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
  const [puesto, setPuesto] = useState(usuario.puesto);
  const [guardando, setGuardando] = useState(false);

  async function guardar() {

    try {

      setGuardando(true);

      const { error } = await supabase
        .from("usuarios")
        .update({
          nombre,
          rol,
          puesto,
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

<label className="mt-6 block font-semibold">
  Puesto
</label>

<select
  value={puesto}
  onChange={(e) => setPuesto(e.target.value)}
  className="mt-2 w-full rounded-xl border p-3"
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

<div className="mt-8 flex flex-col items-center gap-4">

  <button
    onClick={guardar}
    disabled={guardando}
    className="w-72 rounded-2xl bg-blue-600 py-3 font-semibold text-white"
  >
    {guardando ? "Guardando..." : "💾 Guardar cambios"}
  </button>

  <a
    href={`/usuarios/password/${usuario.id}`}
    className="w-72 rounded-2xl bg-amber-500 py-3 text-center font-semibold text-white"
  >
    🔑 Restablecer contraseña
  </a>

  {!protegido && (
    <a
      href={`/usuarios/desactivar/${usuario.id}`}
      className="w-72 rounded-2xl bg-red-500 py-3 text-center font-semibold text-white"
    >
      🔒 Desactivar usuario
    </a>
  )}

</div>

    </div>

  );

}