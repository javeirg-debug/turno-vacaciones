"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const { usuario } = useUser();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t bg-white p-4">

      <Link
        href="/inicio"
        className={`flex flex-col items-center rounded-xl px-3 py-2 transition ${
          pathname === "/inicio"
            ? "bg-slate-200 text-slate-900 font-semibold"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <span>🏠</span>
        <span className="text-xs">Inicio</span>
      </Link>

      <Link
        href="/calendario"
        className={`flex flex-col items-center rounded-xl px-3 py-2 transition ${
          pathname.startsWith("/calendario")
            ? "bg-slate-200 text-slate-900 font-semibold"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <span>📅</span>
        <span className="text-xs">Calendario</span>
      </Link>

      <Link
        href="/tabla"
        className={`flex flex-col items-center rounded-xl px-3 py-2 transition ${
          pathname.startsWith("/tabla")
            ? "bg-slate-200 text-slate-900 font-semibold"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <span>🧮</span>
        <span className="text-xs">Excel</span>
      </Link>

      <Link
        href="/solicitudes"
        className={`flex flex-col items-center rounded-xl px-3 py-2 transition ${
          pathname.startsWith("/solicitudes")
            ? "bg-slate-200 text-slate-900 font-semibold"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <span>📝</span>
        <span className="text-xs">Solicitudes</span>
      </Link>

      <Link
        href="/estadisticas"
        className={`flex flex-col items-center rounded-xl px-3 py-2 transition ${
          pathname.startsWith("/estadisticas")
            ? "bg-slate-200 text-slate-900 font-semibold"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <span>📊</span>
        <span className="text-xs">Estadísticas</span>
      </Link>

      {usuario?.rol === "admin" && (
        <Link
          href="/usuarios"
          className={`flex flex-col items-center rounded-xl px-3 py-2 transition ${
            pathname.startsWith("/usuarios")
              ? "bg-slate-200 text-slate-900 font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span>⚙️</span>
          <span className="text-xs">Admin</span>
        </Link>
      )}

    </nav>
  );
}