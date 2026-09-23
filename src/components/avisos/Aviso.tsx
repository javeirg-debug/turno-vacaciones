"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/lib/supabase";

type Aviso = {
  id: string;
  texto: string;
  activo: boolean;
  creado_en: string;
  creado_por: string;
  usuarios?: {
    nombre: string;
  }[] | null;
};

function formatearFecha(fecha: string) {
  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const año = date.getFullYear();

  const horas = String(date.getHours()).padStart(2, "0");
  const minutos = String(date.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${año} · ${horas}:${minutos}`;
}

function IconAlert({
  className = "h-5 w-5",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10.3 3.5 2.7 17a2 2 0 0 0 1.75 3h15.1a2 2 0 0 0 1.75-3L13.7 3.5a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function IconEdit({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function IconSave({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}

function IconTrash({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 15H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

export default function Aviso() {
  const { usuario } = useUser();

  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [texto, setTexto] = useState("");
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const esAdmin = usuario?.rol === "admin";

  async function cargarAviso() {
    setCargando(true);
    setError("");

    try {
      // 1. CARGAMOS EL AVISO
      const { data, error: avisoError } = await supabase
        .from("avisos")
        .select(
          `
            id,
            texto,
            activo,
            creado_en,
            creado_por
          `
        )
        .eq("activo", true)
        .order("creado_en", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (avisoError) {
        console.error("Error cargando aviso:", avisoError);
        throw new Error("Error cargando el aviso.");
      }

      // No hay aviso activo
      if (!data) {
        setAviso(null);
        setTexto("");
        setEditando(false);
        setCargando(false);
        return;
      }

      // 2. CARGAMOS EL USUARIO QUE CREÓ EL AVISO
      const { data: usuarioCreador, error: usuarioError } = await supabase
        .from("usuarios")
        .select("nombre")
        .eq("id", data.creado_por)
        .maybeSingle();

      if (usuarioError) {
        console.error(
          "Error cargando usuario creador:",
          usuarioError
        );
      }

      // 3. MONTAMOS EL AVISO CON EL USUARIO
      const avisoCompleto: Aviso = {
        id: data.id,
        texto: data.texto,
        activo: data.activo,
        creado_en: data.creado_en,
        creado_por: data.creado_por,
        usuarios: usuarioCreador
          ? [
              {
                nombre: usuarioCreador.nombre,
              },
            ]
          : [],
      };

      setAviso(avisoCompleto);
      setTexto(data.texto);
      setEditando(false);
    } catch (err: unknown) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Error cargando el aviso."
      );

      setAviso(null);
      setTexto("");
      setEditando(false);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarAviso();
  }, []);

  function editarAviso() {
    setError("");
    setTexto(aviso?.texto ?? "");
    setEditando(true);
  }

  async function guardarAviso() {
    setError("");

    if (!texto.trim()) {
      setError("Escribe un aviso antes de guardar.");
      return;
    }

    try {
      setGuardando(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No hay usuario conectado.");
      }

      // Borramos el aviso activo actual
      const { error: borrarError } = await supabase
        .from("avisos")
        .delete()
        .eq("activo", true);

      if (borrarError) {
        throw borrarError;
      }

      // Creamos el nuevo aviso con el usuario actual
      const { error: insertarError } = await supabase
        .from("avisos")
        .insert({
          texto: texto.trim(),
          activo: true,
          creado_por: user.id,
        });

      if (insertarError) {
        throw insertarError;
      }

      await cargarAviso();
    } catch (err: unknown) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Error guardando aviso."
      );
    } finally {
      setGuardando(false);
    }
  }

  async function borrarAviso() {
    setError("");

    const confirmar = confirm(
      "¿Quieres borrar el aviso actual?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const { error } = await supabase
        .from("avisos")
        .delete()
        .eq("activo", true);

      if (error) {
        throw error;
      }

      setAviso(null);
      setTexto("");
      setEditando(false);
    } catch (err: unknown) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Error borrando aviso."
      );
    }
  }

  if (cargando) {
    return null;
  }

  return (
    <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow">
      {/* CABECERA */}

      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-bold text-amber-900">
          <IconAlert className="h-5 w-5" />
          Avisos
        </h2>

        {/* BOTONES ADMIN */}

        {esAdmin && (
          <div className="flex items-center gap-1">
            {/* EDITAR */}

            <button
              type="button"
              onClick={editarAviso}
              disabled={editando || guardando}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Editar aviso"
              title="Editar aviso"
            >
              <IconEdit />
            </button>

            {/* GUARDAR */}

            <button
              type="button"
              onClick={guardarAviso}
              disabled={!editando || guardando}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Guardar aviso"
              title="Guardar aviso"
            >
              <IconSave />
            </button>

            {/* BORRAR */}

            <button
              type="button"
              onClick={borrarAviso}
              disabled={!aviso || editando || guardando}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Borrar aviso"
              title="Borrar aviso"
            >
              <IconTrash />
            </button>
          </div>
        )}
      </div>

      {/* CONTENIDO */}

      {editando ? (
        <>
          {/* CAMPO DE EDICIÓN */}

          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={4}
            autoFocus
            className="mt-4 w-full resize-none rounded-xl border border-amber-300 bg-white p-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
            placeholder="Escribe aquí el aviso..."
          />

          {error && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </>
      ) : (
        <>
          {/* AVISO PUBLICADO */}

          {aviso ? (
            <>
              <p className="mt-3 whitespace-pre-wrap text-amber-800">
                {aviso.texto}
              </p>

              <p className="mt-4 text-sm italic text-amber-700">
                Creado por{" "}
                {aviso.usuarios?.[0]?.nombre ?? "—"}
                <br />
                {formatearFecha(aviso.creado_en)}
              </p>
            </>
          ) : (
            <p className="mt-3 text-amber-800">
              No hay avisos actualmente.
            </p>
          )}

          {error && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
}