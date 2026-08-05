"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const { usuario } = useUser();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex border-t bg-white px-1 py-2 shadow">

      <Link
        href="/inicio"
        className="flex-1"
      >
        <div
          className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
            pathname === "/inicio"
              ? "bg-slate-200 text-slate-900 font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[10px]">Inicio</span>
        </div>
      </Link>

      <Link
        href="/calendario"
        className="flex-1"
      >
        <div
          className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
            pathname.startsWith("/calendario")
              ? "bg-slate-200 text-slate-900 font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="text-xl">📅</span>
          <span className="text-[10px]">Calendario</span>
        </div>
      </Link>

      <Link
        href="/tabla"
        className="flex-1"
      >
        <div
          className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
            pathname.startsWith("/tabla")
              ? "bg-slate-200 text-slate-900 font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="text-xl">🧮</span>
          <span className="text-[10px]">Excel</span>
        </div>
      </Link>

      <Link
        href="/solicitudes"
        className="flex-1"
      >
        <div
          className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
            pathname.startsWith("/solicitudes")
              ? "bg-slate-200 text-slate-900 font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="text-xl">📝</span>
          <span className="text-[10px]">Solicitudes</span>
        </div>
      </Link>

      <Link
        href="/estadisticas"
        className="flex-1"
      >
        <div
          className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
            pathname.startsWith("/estadisticas")
              ? "bg-slate-200 text-slate-900 font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="text-xl">📊</span>
          <span className="text-[10px]">Estadísticas</span>
        </div>
      </Link>

      {usuario?.rol === "admin" && (
        <Link
          href="/usuarios"
          className="flex-1"
        >
          <div
            className={`flex flex-col items-center justify-center rounded-xl py-2 transition ${
              pathname.startsWith("/usuarios")
                ? "bg-slate-200 text-slate-900 font-semibold"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span className="text-[10px]">Admin</span>
          </div>
        </Link>
      )}

    </nav>
  );
}