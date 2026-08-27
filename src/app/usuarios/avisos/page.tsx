"use client";

import { useEffect, useState } from "react";
import BottomNav from "@/components/navigation/BottomNav";
import { supabase } from "@/lib/supabase";

export default function Avisos() {
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function cargarAviso() {
    const { data, error } = await supabase
      .from("avisos")
      .select("*")
      .eq("activo", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      setError("Error cargando el aviso.");
    }

    if (data) {
      setTexto(data.texto);
    }

    setCargando(false);
  }

  useEffect(() => {
    cargarAviso();
  }, []);

  async function guardarAviso() {
    setMensaje("");
    setError("");

    if (!texto.trim()) {
      setError("Escribe un aviso antes de guardar.");
      return;
    }

    try {
      setGuardando(true);

      // Obtener usuario conectado
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No hay usuario conectado.");
      }

      // Quitar aviso anterior
      const { error: borrarError } = await supabase
        .from("avisos")
        .delete()
        .eq("activo", true);

      if (borrarError) {
        throw borrarError;
      }

      // Crear nuevo aviso
      const { error: insertarError } = await supabase
        .from("avisos")
        .insert({
          texto: texto,
          activo: true,
          creado_por: user.id,
        });

      if (insertarError) {
        throw insertarError;
      }

      setMensaje("Aviso guardado correctamente.");
    } catch (err: any) {
      console.error(err);

      setError(err.message || "Error guardando aviso.");
    } finally {
      setGuardando(false);
    }
  }

  async function borrarAviso() {
    setMensaje("");
    setError("");

    const confirmar = confirm("¿Quieres borrar el aviso actual?");

    if (!confirmar) return;

    const { error } = await supabase
      .from("avisos")
      .delete()
      .eq("activo", true);

    if (error) {
      setError("Error borrando aviso.");
      return;
    }

    setTexto("");

    setMensaje("Aviso eliminado.");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        Avisos
      </h1>

      <p className="mt-2 text-slate-500">
        Aviso visible para todos los usuarios.
      </p>

      <div className="mt-8 rounded-3xl bg-white p-6 shadow">

        {cargando ? (
          <p>
            Cargando aviso...
          </p>
        ) : (
          <>
            <label className="font-semibold">
              Texto del aviso
            </label>

            <textarea
              value={texto}
              onChange={(e) =>
                setTexto(e.target.value)
              }
              rows={5}
              className="mt-3 w-full rounded-xl border p-3"
              placeholder="Escribe aquí el aviso..."
            />

            {mensaje && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-100 p-3 text-green-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 shrink-0"
                  aria-hidden="true"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>

                {mensaje}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-xl bg-red-100 p-3 text-red-800">
                {error}
              </div>
            )}

            <button
              onClick={guardarAviso}
              disabled={guardando}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-700 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando ? (
                "Guardando..."
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
                    <path d="M17 21v-8H7v8" />
                    <path d="M7 3v5h8" />
                  </svg>

                  Guardar aviso
                </>
              )}
            </button>

            <button
              onClick={borrarAviso}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-semibold text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                <path d="M19 6l-1 15H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>

              Borrar aviso
            </button>
          </>
        )}

      </div>

      <BottomNav />

    </main>
  );
}