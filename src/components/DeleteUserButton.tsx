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
      "⚠️ ¿Estás seguro de que deseas eliminar este usuario?\n\nEsta acción no se puede deshacer."
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
      className="flex h-full w-full items-center justify-center gap-1 bg-red-500 px-2 text-sm font-bold text-white transition hover:bg-red-600"
    >
      🗑️ Eliminar
    </button>
  );
}