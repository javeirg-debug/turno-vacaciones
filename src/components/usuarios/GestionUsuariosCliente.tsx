"use client";

import { useState } from "react";
import Link from "next/link";

type Usuario = {
  id: string;
  nombre: string;
  rol: string;
  categoria: string | null;
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
    const partes = nombre
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const quitarTildes = (texto: string) =>
      texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (partes.length >= 3) {
      return (
        quitarTildes(partes[0][0]) +
        quitarTildes(partes[1][0]) +
        quitarTildes(partes[2][0])
      ).toUpperCase();
    }

    if (partes.length === 2) {
      return (
        quitarTildes(partes[0][0]) +
        quitarTildes(partes[1][0])
      ).toUpperCase();
    }

    return quitarTildes(
      partes[0]?.substring(0, 2) || "US"
    ).toUpperCase();
  }

  function IconoPuesto({
    puesto,
  }: {
    puesto: string;
  }) {
    if (puesto === "gac") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4 shrink-0 text-slate-600"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 17h18"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 17V9h9l3 3h2v5"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 9l2-4h5l2 4"
          />

          <circle
            cx="7"
            cy="17"
            r="2"
          />

          <circle
            cx="17"
            cy="17"
            r="2"
          />
        </svg>
      );
    }

    if (puesto === "seguridad") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4 shrink-0 text-slate-600"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9 12 2 2 4-4"
          />
        </svg>
      );
    }

    if (puesto === "sala") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4 shrink-0 text-slate-600"
          aria-hidden="true"
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
      );
    }

    return null;
  }

  function IconoCategoria({
    categoria,
  }: {
    categoria: string | null;
  }) {
    if (categoria === "oficial") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4 shrink-0 text-amber-500"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m12 3 2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7L12 3Z"
          />
        </svg>
      );
    }

    if (categoria === "policia") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4 shrink-0 text-slate-600"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3 5 6v6c0 4.2 2.7 7.2 7 9 4.3-1.8 7-4.8 7-9V6l-7-3Z"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 10h6M9 13h6M10 16h4"
          />
        </svg>
      );
    }

    return null;
  }

  function IconoRol({
    rol,
  }: {
    rol: string;
  }) {
    if (rol === "admin") {
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5 text-amber-500"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 7l4 4 4-7 4 7 4-4-2 11H6L4 7Z"
          />

          <path
            strokeLinecap="round"
            d="M6 21h12"
          />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5 text-slate-600"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="8"
          r="3.5"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5"
        />
      </svg>
    );
  }

  function IconoEditar() {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20h9"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"
        />
      </svg>
    );
  }

  function IconoBuscar() {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle
          cx="11"
          cy="11"
          r="6.5"
        />

        <path
          strokeLinecap="round"
          d="m16 16 4.5 4.5"
        />
      </svg>
    );
  }

  const usuariosFiltrados = usuarios.filter((usuario) =>
    (usuario.nombre || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const administradores = usuariosFiltrados
    .filter(
      (usuario) =>
        usuario.rol === "admin" &&
        usuario.activo === true
    )
    .sort((a, b) => {
      if (
        a.categoria === "oficial" &&
        b.categoria !== "oficial"
      ) {
        return -1;
      }

      if (
        a.categoria !== "oficial" &&
        b.categoria === "oficial"
      ) {
        return 1;
      }

      return a.nombre.localeCompare(b.nombre);
    });

  const usuariosNormales = usuariosFiltrados
    .filter(
      (usuario) =>
        usuario.rol !== "admin" &&
        usuario.activo === true
    )
    .sort((a, b) => {
      if (
        a.categoria === "oficial" &&
        b.categoria !== "oficial"
      ) {
        return -1;
      }

      if (
        a.categoria !== "oficial" &&
        b.categoria === "oficial"
      ) {
        return 1;
      }

      return a.nombre.localeCompare(b.nombre);
    });

  return (
    <>
      {/* =========================
          BUSCADOR
      ========================= */}

      <div className="mt-4 relative">

        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
          <IconoBuscar />
        </div>

        <input
          type="text"
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
          placeholder="Buscar usuario..."
          className="
            w-full
            rounded-2xl
            border
            border-slate-200
            bg-white
            py-3
            pl-12
            pr-5
            text-slate-800
            shadow-sm
            outline-none
            transition
            focus:border-blue-400
            focus:ring-2
            focus:ring-blue-100
          "
        />

      </div>


      <div className="mt-8 space-y-4">

        {/* =========================
            ADMINISTRADORES
        ========================= */}

        {administradores.length > 0 && (
          <>
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6 text-amber-500"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7l4 4 4-7 4 7 4-4-2 11H6L4 7Z"
                  />

                  <path
                    strokeLinecap="round"
                    d="M6 21h12"
                  />
                </svg>

                <h2 className="text-xl font-bold">
                  Administradores
                </h2>

              </div>

              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-800
                  text-sm
                  font-bold
                  text-white
                "
              >
                {administradores.length}
              </div>

            </div>


            {administradores.map((usuario) => (

              <div
                key={usuario.id}
                className="
                  flex
                  min-h-[88px]
                  overflow-hidden
                  rounded-2xl
                  bg-white
                  shadow
                "
              >

                {/* INICIALES */}

                <div
                  className="
                    flex
                    w-[76px]
                    shrink-0
                    items-center
                    justify-center
                  "
                >
                  <div
                    className={`
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      text-lg
                      font-bold
                      ${
                        usuario.sexo === "mujer"
                          ? "bg-pink-100 text-pink-600"
                          : "bg-blue-100 text-blue-600"
                      }
                    `}
                  >
                    {obtenerIniciales(
                      usuario.nombre || "Usuario"
                    )}
                  </div>
                </div>


                {/* INFORMACIÓN */}

                <div
                  className="
                    min-w-0
                    flex-1
                    py-3
                  "
                >

                  <div className="flex items-center gap-2">

                    <IconoRol rol={usuario.rol} />

                    <h3
                      className="
                        truncate
                        text-lg
                        font-bold
                        text-slate-800
                      "
                    >
                      {usuario.nombre || "Sin nombre"}
                    </h3>

                  </div>


                  <div
                    className="
                      mt-1
                      flex
                      flex-wrap
                      gap-x-3
                      gap-y-1
                      text-sm
                      text-slate-500
                    "
                  >

                    <span className="flex items-center gap-1">

                      <IconoCategoria
                        categoria={usuario.categoria}
                      />

                      {usuario.categoria === "oficial"
                        ? "Oficial de Policía"
                        : usuario.categoria === "policia"
                        ? "Policía"
                        : "—"}

                    </span>


                    <span className="flex items-center gap-1">

                      <IconoPuesto
                        puesto={usuario.puesto}
                      />

                      {usuario.puesto === "gac"
                        ? "G.A.C"
                        : usuario.puesto === "seguridad"
                        ? "Seguridad"
                        : usuario.puesto === "sala"
                        ? "Sala"
                        : "—"}

                    </span>

                  </div>

                </div>


                {/* EDITAR */}

                <Link
                  href={`/usuarios/editar/${usuario.id}`}
                  aria-label={`Editar ${usuario.nombre}`}
                  className="
                    mr-3
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    self-center
                    rounded-full
                    bg-slate-100
                    text-slate-600
                    shadow-sm
                    transition
                    hover:bg-slate-200
                  "
                >
                  <IconoEditar />
                </Link>

              </div>

            ))}

          </>
        )}


        {/* =========================
            USUARIOS
        ========================= */}

        {usuariosNormales.length > 0 && (
          <>

            <div
              className="
                mt-8
                flex
                items-center
                justify-between
              "
            >

              <div className="flex items-center gap-2">

                {/* ICONO PERSONAS */}

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-6 w-6 text-slate-700"
                  aria-hidden="true"
                >
                  <circle
                    cx="9"
                    cy="8"
                    r="3"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.5 19c.7-3 2.5-4.5 5.5-4.5S13.8 16 14.5 19"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11a2.5 2.5 0 1 0 0-5"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 14.5c2.3.1 3.8 1.5 4.5 4"
                  />
                </svg>

                <h2 className="text-xl font-bold">
                  Usuarios
                </h2>

              </div>


              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-800
                  text-sm
                  font-bold
                  text-white
                "
              >
                {usuariosNormales.length}
              </div>

            </div>


            {usuariosNormales.map((usuario) => (

              <div
                key={usuario.id}
                className="
                  flex
                  min-h-[88px]
                  overflow-hidden
                  rounded-2xl
                  bg-white
                  shadow
                "
              >

                {/* INICIALES */}

                <div
                  className="
                    flex
                    w-[76px]
                    shrink-0
                    items-center
                    justify-center
                  "
                >

                  <div
                    className={`
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      text-lg
                      font-bold
                      ${
                        usuario.sexo === "mujer"
                          ? "bg-pink-100 text-pink-600"
                          : "bg-blue-100 text-blue-600"
                      }
                    `}
                  >
                    {obtenerIniciales(
                      usuario.nombre || "Usuario"
                    )}
                  </div>

                </div>


                {/* INFORMACIÓN */}

                <div
                  className="
                    min-w-0
                    flex-1
                    py-3
                  "
                >

                  <div className="flex items-center gap-2">

                    <IconoRol rol={usuario.rol} />

                    <h3
                      className="
                        truncate
                        text-lg
                        font-bold
                        text-slate-800
                      "
                    >
                      {usuario.nombre || "Sin nombre"}
                    </h3>

                  </div>


                  <div
                    className="
                      mt-1
                      flex
                      flex-wrap
                      gap-x-3
                      gap-y-1
                      text-sm
                      text-slate-500
                    "
                  >

                    <span className="flex items-center gap-1">

                      <IconoCategoria
                        categoria={usuario.categoria}
                      />

                      {usuario.categoria === "oficial"
                        ? "Oficial de Policía"
                        : usuario.categoria === "policia"
                        ? "Policía"
                        : "—"}

                    </span>


                    <span className="flex items-center gap-1">

                      <IconoPuesto
                        puesto={usuario.puesto}
                      />

                      {usuario.puesto === "gac"
                        ? "G.A.C"
                        : usuario.puesto === "seguridad"
                        ? "Seguridad"
                        : usuario.puesto === "sala"
                        ? "Sala"
                        : "—"}

                    </span>

                  </div>

                </div>


                {/* EDITAR */}

                <Link
                  href={`/usuarios/editar/${usuario.id}`}
                  aria-label={`Editar ${usuario.nombre}`}
                  className="
                    mr-3
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    self-center
                    rounded-full
                    bg-slate-100
                    text-slate-600
                    shadow-sm
                    transition
                    hover:bg-slate-200
                  "
                >
                  <IconoEditar />
                </Link>

              </div>

            ))}

          </>
        )}


        {/* =========================
            SIN RESULTADOS
        ========================= */}

        {busqueda.trim() !== "" &&
          administradores.length === 0 &&
          usuariosNormales.length === 0 && (

            <div
              className="
                rounded-2xl
                bg-white
                p-5
                text-center
                text-slate-500
                shadow
              "
            >
              No se ha encontrado ningún usuario.
            </div>

          )}

      </div>
    </>
  );
}