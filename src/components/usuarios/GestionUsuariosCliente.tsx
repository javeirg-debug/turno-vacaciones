"use client";

import { useState } from "react";
import Link from "next/link";

type Usuario = {
  id: string;
  nombre: string;
  rol: string;
  puesto: string;
  sexo: string;
  activo: boolean;
};

type Props = {
  usuarios: Usuario[];
};

export default function GestionUsuariosCliente({
  usuarios,
}: Props) {
  const [busqueda, setBusqueda] = useState("");

  function obtenerIniciales(nombre: string) {
    const partes = nombre.trim().split(" ");

    if (partes.length >= 2) {
      return (
        partes[0][0] +
        partes[partes.length - 1][0]
      ).toUpperCase();
    }

    return nombre.substring(0, 2).toUpperCase();
  }

  function obtenerPuesto(puesto: string) {
    return puesto === "gac"
      ? "🚓 G.A.C"
      : puesto === "seguridad"
      ? "🛡️ Seguridad"
      : puesto === "sala"
      ? "🖥️ Sala"
      : "—";
  }

  const usuariosFiltrados = usuarios.filter((usuario) =>
    (usuario.nombre || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const administradores = usuariosFiltrados.filter(
    (usuario) =>
      usuario.rol === "admin" &&
      usuario.activo === true
  );

  const usuariosNormales = usuariosFiltrados.filter(
    (usuario) =>
      usuario.rol !== "admin" &&
      usuario.activo === true
  );

  return (
    <>
      {/* BUSCADOR */}

      <div className="mt-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
          placeholder="🔎 Buscar usuario..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      </div>


      <div className="mt-8 space-y-4">

        {/* ADMINISTRADORES */}

        {administradores.length > 0 && (
          <>
            <h2 className="text-xl font-bold">
              👑 Administradores
            </h2>

            {administradores.map((usuario) => (
              <div
                key={usuario.id}
                className="flex min-h-[88px] overflow-hidden rounded-2xl bg-white shadow"
              >

                {/* INICIALES */}

                <div className="flex w-[76px] shrink-0 items-center justify-center">

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${
                      usuario.sexo === "mujer"
                        ? "bg-pink-100 text-pink-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {obtenerIniciales(
                      usuario.nombre || "Usuario"
                    )}
                  </div>

                </div>


                {/* INFORMACIÓN */}

                <div className="min-w-0 flex-1 py-3">

                  <h3 className="truncate text-lg font-bold text-slate-800">
                    {usuario.nombre || "Sin nombre"}
                  </h3>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">

                    <span>
                      👑 Administrador
                    </span>

                    <span>
                      {obtenerPuesto(usuario.puesto)}
                    </span>

                  </div>

                </div>


                {/* EDITAR */}

                <Link
                  href={`/usuarios/editar/${usuario.id}`}
                  className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full bg-slate-100 text-lg shadow-sm transition hover:bg-slate-200"
                >
                  ✏️
                </Link>

              </div>
            ))}
          </>
        )}


        {/* POLICÍAS */}

        {usuariosNormales.length > 0 && (
          <>
            <h2 className="mt-8 text-xl font-bold">
              🪪 Policías
            </h2>

            {usuariosNormales.map((usuario) => (
              <div
                key={usuario.id}
                className="flex min-h-[88px] overflow-hidden rounded-2xl bg-white shadow"
              >

                {/* INICIALES */}

                <div className="flex w-[76px] shrink-0 items-center justify-center">

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold ${
                      usuario.sexo === "mujer"
                        ? "bg-pink-100 text-pink-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {obtenerIniciales(
                      usuario.nombre || "Usuario"
                    )}
                  </div>

                </div>


                {/* INFORMACIÓN */}

                <div className="min-w-0 flex-1 py-3">

                  <h3 className="truncate text-lg font-bold text-slate-800">
                    {usuario.nombre || "Sin nombre"}
                  </h3>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">

                    <span>
                      {usuario.sexo === "mujer"
                        ? "👮‍♀️ Policía"
                        : "👮‍♂️ Policía"}
                    </span>

                    <span>
                      {obtenerPuesto(usuario.puesto)}
                    </span>

                  </div>

                </div>


                {/* EDITAR */}

                <Link
                  href={`/usuarios/editar/${usuario.id}`}
                  className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full bg-slate-100 text-lg shadow-sm transition hover:bg-slate-200"
                >
                  ✏️
                </Link>

              </div>
            ))}
          </>
        )}


        {/* SIN RESULTADOS */}

        {busqueda.trim() !== "" &&
          administradores.length === 0 &&
          usuariosNormales.length === 0 && (
            <div className="rounded-2xl bg-white p-5 text-center text-slate-500 shadow">
              No se ha encontrado ningún usuario.
            </div>
          )}

      </div>
    </>
  );
}