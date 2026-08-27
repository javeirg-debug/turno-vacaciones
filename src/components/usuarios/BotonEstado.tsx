"use client";

import { useRouter } from "next/navigation";
import { cambiarEstadoUsuario } from "@/services/usuarios";

type Props = {
  id: string;
  activo: boolean;
};

export default function BotonEstado({
  id,
  activo,
}: Props) {
  const router = useRouter();

  async function cambiarEstado() {
    try {
      await cambiarEstadoUsuario(id, !activo);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("No se pudo cambiar el estado del usuario.");
    }
  }

  return (
    <button
      onClick={cambiarEstado}
      className={`mt-3 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-white ${
        activo ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {activo ? (
        <>
          {/* Círculo rojo vectorial */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>

          Desactivar
        </>
      ) : (
        <>
          {/* Círculo verde vectorial */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>

          Activar
        </>
      )}
    </button>
  );
}