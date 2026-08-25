"use client";

import Link from "next/link";
import BottomNav from "@/components/navigation/BottomNav";
import { useState } from "react";

export default function Administracion() {

  const [mostrarInfoUsuarios, setMostrarInfoUsuarios] =
    useState(false);

  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="text-3xl font-bold text-slate-800">
        ⚙️ Administración
      </h1>

      <p className="mt-2 text-slate-500">
        Configuración y gestión de la aplicación.
      </p>


      <div className="mt-8 space-y-5">


        {/* =========================
            GESTIÓN DE USUARIOS
        ========================= */}

        <div className="relative">

          <Link
            href="/usuarios/gestion"
            className="
              block
              rounded-3xl
              bg-white
              p-6
              shadow
              hover:bg-slate-50
            "
          >

            <div className="text-4xl">
              👥
            </div>

            <h2 className="mt-3 text-xl font-bold">
              Gestión de usuarios
            </h2>

            <p className="mt-2 text-slate-500">
              Crear, eliminar, activar y desactivar usuarios.
            </p>

          </Link>


          {/* INFORMACIÓN */}

          <button
            type="button"
            onClick={() =>
              setMostrarInfoUsuarios(true)
            }
            className="
              absolute
              right-3
              top-3
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-blue-100
              text-sm
              font-bold
              text-blue-600
              shadow-sm
              transition
              hover:bg-blue-200
              active:scale-95
            "
            aria-label="Información sobre gestión de usuarios"
          >
            ℹ️
          </button>

        </div>


        {/* =========================
            CONFIGURACIÓN OCUPACIÓN
        ========================= */}

        <Link
          href="/usuarios/ocupacion"
          className="
            block
            rounded-3xl
            bg-white
            p-6
            shadow
            hover:bg-slate-50
          "
        >

          <div className="text-4xl">
            🎨
          </div>

          <h2 className="mt-3 text-xl font-bold">
            Configuración de ocupación
          </h2>

          <p className="mt-2 text-slate-500">
            Configurar colores y niveles del calendario.
          </p>

        </Link>


        {/* =========================
            AVISOS
        ========================= */}

        <Link
          href="/usuarios/avisos"
          className="
            block
            rounded-3xl
            bg-white
            p-6
            shadow
            hover:bg-slate-50
          "
        >

          <div className="text-4xl">
            📢
          </div>

          <h2 className="mt-3 text-xl font-bold">
            Avisos
          </h2>

          <p className="mt-2 text-slate-500">
            Crear, modificar o eliminar el aviso visible para todos los usuarios.
          </p>

        </Link>


      </div>


      {/* =========================
          INFORMACIÓN USUARIOS
      ========================= */}

      {mostrarInfoUsuarios && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-6
          "
        >

          <div
            className="
              w-full
              max-w-lg
              rounded-3xl
              bg-white
              p-6
              shadow-xl
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-xl
                  font-bold
                  text-slate-800
                "
              >
                👥 Gestión de usuarios
              </h2>

              <button
                type="button"
                onClick={() =>
                  setMostrarInfoUsuarios(false)
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-100
                  text-lg
                  text-slate-500
                  transition
                  hover:bg-slate-200
                "
                aria-label="Cerrar información"
              >
                ✕
              </button>

            </div>


            <div
              className="
                mt-5
                space-y-4
                text-sm
                leading-6
                text-slate-600
              "
            >

              <div>

                <p className="font-bold text-slate-800">
                  👤 Gestión de usuarios
                </p>

                <p className="mt-1">
                  Permite crear, modificar, activar y desactivar usuarios.
                </p>

              </div>


              <div>

                <p className="font-bold text-slate-800">
                  🔒 Usuarios inactivos
                </p>

                <p className="mt-1">
                  Los usuarios inactivos dejan de aparecer en los
                  permisos que consultan el resto de usuarios.
                  Se mantiene visible el permiso solicitado,
                  pero sin mostrar el nombre.
                </p>

              </div>


              <div>

                <p className="font-bold text-slate-800">
                  ⚠️ Eliminación
                </p>

                <p className="mt-1">
                  
                    Para eliminar un usuario, primero debe estar
                    en Usuarios inactivos.
                  
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                setMostrarInfoUsuarios(false)
              }
              className="
                mt-6
                w-full
                rounded-xl
                bg-slate-800
                py-3
                font-bold
                text-white
                transition
                hover:bg-slate-700
              "
            >
              Entendido
            </button>

          </div>

        </div>

      )}


      <BottomNav />

    </main>

  );
}