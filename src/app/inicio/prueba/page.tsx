"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const CAP = 2;

type DB = { usado_gb: number };
type Tabla = { tabla: string; mb: number; porcentaje: number };
type Storage = {
  bucket_id: string;
  archivos: number;
  usado_mb: number;
  usado_gb: number;
};

function Info({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-semibold text-gray-500"
      >
        i
      </button>

      {open && (
        <div className="absolute right-0 top-7 z-20 w-56 rounded-lg border bg-white p-3 text-[11px] leading-4 text-gray-600 shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
}

function Card({
  title,
  value,
  info,
  children,
}: {
  title: string;
  value: string;
  info: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <Info text={info} />
      </div>
      {children}
    </div>
  );
}

export default function MantenimientoPage() {
  const [db, setDb] = useState<DB | null>(null);
  const [tablas, setTablas] = useState<Tabla[]>([]);
  const [storage, setStorage] = useState<Storage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargar = async () => {
    setLoading(true);
    setError("");

    const [a, b, c] = await Promise.all([
      supabase.rpc("obtener_uso_base_datos"),
      supabase.rpc("obtener_tamano_tablas"),
      supabase.rpc("obtener_uso_storage"),
    ]);

    const err = a.error || b.error || c.error;

    if (err) setError(err.message);
    else {
      setDb(a.data?.[0] ?? null);
      setTablas(b.data ?? []);
      setStorage(c.data ?? []);
    }

    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Cargando...</div>;
  }

  const usado = Number(db?.usado_gb || 0);
  const libre = Math.max(CAP - usado, 0);
  const porcentaje = Math.min((usado / CAP) * 100, 100);

  const storageGb = storage.reduce(
    (t, x) => t + Number(x.usado_gb || 0),
    0
  );

  const archivos = storage.reduce(
    (t, x) => t + Number(x.archivos || 0),
    0
  );

  const avatars = storage.find(
    (x) => x.bucket_id.toLowerCase() === "avatars"
  );

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* CABECERA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Mantenimiento</h1>
          <p className="text-xs text-gray-500">Base de datos y Storage</p>
        </div>

        <button
          onClick={cargar}
          className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50"
        >
          ↻ Actualizar
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* RESUMEN */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card
          title="PostgreSQL"
          value={`${usado.toFixed(4)} GB`}
          info={`Uso de PostgreSQL sobre ${CAP} GB de capacidad.`}
        >
          <div className="mt-3 h-2 rounded-full bg-gray-100">
            <div
              className="h-2 rounded-full bg-blue-500"
              style={{ width: `${porcentaje}%` }}
            />
          </div>

          <div className="mt-2 flex justify-between text-[11px] text-gray-500">
            <span>{porcentaje.toFixed(2)}%</span>
            <span>{libre.toFixed(4)} GB libres</span>
          </div>
        </Card>

        <Card
          title="Storage"
          value={`${storageGb.toFixed(4)} GB`}
          info="Espacio ocupado por los archivos de Supabase Storage."
        >
          <p className="mt-3 text-[11px] text-gray-500">
            {archivos} archivos · {storage.length} buckets
          </p>
        </Card>

        <Card
          title="Avatares"
          value={`${Number(avatars?.usado_mb || 0).toFixed(2)} MB`}
          info="Espacio ocupado por los archivos del bucket avatars."
        >
          <p className="mt-3 text-[11px] text-gray-500">
            {avatars?.archivos || 0} archivos
          </p>
        </Card>
      </div>

      {/* STORAGE */}
      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Storage</h2>
          <Info text="Tamaño de los archivos agrupados por bucket." />
        </header>

        {storage.map((x) => (
          <div
            key={x.bucket_id}
            className="flex justify-between border-b px-4 py-2.5 text-xs last:border-0"
          >
            <span className="font-medium">{x.bucket_id}</span>

            <span className="text-gray-500">
              {x.archivos} archivos · {Number(x.usado_mb).toFixed(2)} MB
            </span>
          </div>
        ))}
      </section>

      {/* TABLAS */}
      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Tablas PostgreSQL</h2>
          <Info text="Incluye el tamaño de las tablas y sus índices." />
        </header>

        {tablas.map((x) => (
          <div
            key={x.tabla}
            className="flex justify-between border-b px-4 py-2.5 text-xs last:border-0"
          >
            <span className="font-medium">{x.tabla}</span>

            <span className="text-gray-500">
              {Number(x.mb).toFixed(2)} MB ·{" "}
              {Number(x.porcentaje).toFixed(2)}%
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}