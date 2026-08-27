"use client";

import { useRouter } from "next/navigation";

export default function DeleteUserButton({
  id,
  currentUserId,
}: {
  id: string;
  currentUserId: string;
}) {
  const router = useRouter();

  // No permitir eliminar el propio usuario
  if (id === currentUserId) {
    return null;
  }

  async function eliminar() {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?\n\nEsta acción no se puede deshacer."
    );

    if (!confirmar) return;

    const respuesta = await fetch("/api/usuarios/eliminar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      alert(resultado.error);
      return;
    }

    alert("Usuario eliminado correctamente.");

    router.refresh();
  }

  return (
    <button
      onClick={eliminar}
      className="
        flex
        h-full
        w-full
        items-center
        justify-center
        gap-1.5
        bg-rose-100
        px-2
        text-sm
        font-bold
        text-rose-700
        transition
        hover:bg-rose-200
        active:bg-rose-200
      "
    >
      {/* Icono vectorial de papelera */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M4 7h16" />
        <path d="M10 11v5" />
        <path d="M14 11v5" />
        <path d="M6 7l1 13h10l1-13" />
        <path d="M9 7V4h6v3" />
      </svg>

      Eliminar
    </button>
  );
}