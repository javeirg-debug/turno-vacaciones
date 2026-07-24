"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";

export default function BottomNav() {

  const { usuario } = useUser();
  console.log("USUARIO:", usuario);

  return (

    <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t bg-white p-4">

      <Link href="/inicio" className="text-center">
        🏠
        <span className="block text-xs">
          Inicio
        </span>
      </Link>

      <Link href="/calendario" className="text-center">
        📅
        <span className="block text-xs">
          Calendario
        </span>
      </Link>

      <Link href="/solicitudes" className="text-center">
        📝
        <span className="block text-xs">
          Solicitudes
        </span>
      </Link>

      <Link href="/estadisticas" className="text-center">
        📊
        <span className="block text-xs">
          Estadísticas
        </span>
      </Link>

      {usuario?.rol === "admin" && (

        <Link href="/usuarios" className="text-center">
          ⚙️
          <span className="block text-xs">
            Administración
          </span>
        </Link>

      )}

    </nav>

  );

}