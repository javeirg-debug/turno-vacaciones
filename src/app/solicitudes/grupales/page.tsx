"use client";

import BottomNav from "@/components/navigation/BottomNav";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { iconosPermisos } from "@/components/icons/Icons";
import { useRouter } from "next/navigation";
import {
  obtenerSolicitudes,
  eliminarSolicitud,
} from "@/services/solicitudes";

type IconProps = {
  className?: string;
};

/* =========================================================
   ICONOS DE TURNOS
========================================================= */

function IconSunrise({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="4.5"
        fill="#FACC15"
      />

      <path
        d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"
        stroke="#FACC15"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSun({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M7 15a5 5 0 0 1 10 0"
        fill="#F97316"
      />

      <path
        d="M12 3v4M5.64 5.64l2.83 2.83M18.36 5.64l-2.83 2.83"
        stroke="#F97316"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M3 17h18"
        stroke="#64748B"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M6 20h12"
        stroke="#64748B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMoon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 15.5A8.5 8.5 0 0 1 8.5 4.2
           A8.5 8.5 0 1 0 20 15.5Z"
        fill="#1E3A8A"
        stroke="#172554"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <circle
        cx="7"
        cy="8"
        r="0.8"
        fill="#93C5FD"
      />
    </svg>
  );
}

function IconFree({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="white"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/* =========================================================
   TURNO
========================================================= */

const inicioTurno = new Date(2026, 6, 16);

function obtenerTurno(fechaTexto: string) {
  const fecha = new Date(fechaTexto);

  const diferencia = Math.floor(
    (fecha.getTime() - inicioTurno.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const ciclo = ((diferencia % 12) + 12) % 12;

  const turnos = [
    { texto: "Mañana", icono: "sunrise" },
    { texto: "Mañana", icono: "sunrise" },

    { texto: "Tarde", icono: "sun" },
    { texto: "Tarde", icono: "sun" },

    { texto: "Noche", icono: "moon" },
    { texto: "Noche", icono: "moon" },

    { texto: "Libre", icono: "free" },
    { texto: "Libre", icono: "free" },
    { texto: "Libre", icono: "free" },
    { texto: "Libre", icono: "free" },
    { texto: "Libre", icono: "free" },
    { texto: "Libre", icono: "free" },
  ];

  return turnos[ciclo];
}

/* =========================================================
   TIPOS
========================================================= */

type Usuario = {
  id: string;
  nombre: string;
  sexo: string | null;
  avatar_url: string | null;
  categoria: string | null;
  puesto: string | null;
  activo: boolean | null;
};

type Permiso = {
  id: string;
  usuario_id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
  estado: string | null;
  created_at: string | null;

  usuario: Usuario | null;
};

type PermisoAgrupado = {
  id: string;
  usuario_id: string;
  tipo: string;
  usuario: Usuario | null;
  motivo: string | null;
  estado: string | null;
  created_at: string | null;

  dias: {
    id: string;
    fecha: string;
  }[];
};

/* =========================================================
   FECHAS
========================================================= */

function formatearFecha(fecha: string) {
  return new Date(fecha + "Z").toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* =========================================================
   VISUAL DEL PERMISO
========================================================= */

function obtenerVisual(tipo: string) {
  const icono =
    iconosPermisos[
      tipo as keyof typeof iconosPermisos
    ];

  switch (tipo) {
    case "Vacaciones":
      return {
        icono,
        abreviatura: "VAC",
        color: "bg-teal-500",
      };

    case "Asunto propio":
      return {
        icono,
        abreviatura: "AP",
        color: "bg-sky-500",
      };

    case "Compensación horaria":
      return {
        icono,
        abreviatura: "CH",
        color: "bg-slate-600",
      };

    case "Indisposición":
      return {
        icono,
        abreviatura: "IND",
        color: "bg-red-500",
      };

    case "Navidad":
      return {
        icono,
        abreviatura: "NAV",
        color: "bg-indigo-500",
      };

    case "Semana Santa":
      return {
        icono,
        abreviatura: "SS",
        color: "bg-violet-500",
      };

    case "Paternidad":
      return {
        icono,
        abreviatura: "PAT",
        color: "bg-blue-500",
      };

    case "Maternidad":
      return {
        icono,
        abreviatura: "MAT",
        color: "bg-pink-500",
      };

    case "Lactancia":
      return {
        icono,
        abreviatura: "LAC",
        color: "bg-amber-500",
      };

    case "Otros permisos":
      return {
        icono,
        abreviatura: "OT",
        color: "bg-fuchsia-500",
      };

    case "Permiso urgente":
      return {
        icono,
        abreviatura: "URG",
        color: "bg-orange-500",
      };

    default:
      return {
        icono: iconosPermisos["Otros permisos"],
        abreviatura: "OT",
        color: "bg-slate-500",
      };
  }
}

/* =========================================================
   CATEGORÍA
========================================================= */

function obtenerCategoria(categoria: string | null) {
  if (categoria === "oficial") {
    return (
      <div className="flex items-center gap-1.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 text-amber-500"
          aria-hidden="true"
        >
          <path d="m12 3 2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7L12 3Z" />
        </svg>

        <span>Oficial de Policía</span>
      </div>
    );
  }

  if (categoria === "policia") {
    return (
      <div className="flex items-center gap-1.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Z" />
          <path d="M9 11h6" />
          <path d="M12 8v6" />
        </svg>

        <span>Policía</span>
      </div>
    );
  }

  return <span>--</span>;
}

/* =========================================================
   PUESTO
========================================================= */

function obtenerPuesto(puesto: string | null) {
  if (puesto === "gac") {
    return (
      <div className="flex items-center justify-end gap-1.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <path d="M5 17h14l-1-7H6Z" />
          <path d="M7 10 9 5h6l2 5" />
          <circle cx="8" cy="17" r="1.5" />
          <circle cx="16" cy="17" r="1.5" />
        </svg>

        <span>G.A.C</span>
      </div>
    );
  }

  if (puesto === "seguridad") {
    return (
      <div className="flex items-center justify-end gap-1.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Z" />
        </svg>

        <span>Seguridad</span>
      </div>
    );
  }

  if (puesto === "sala") {
    return (
      <div className="flex items-center justify-end gap-1.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="4"
            width="18"
            height="13"
            rx="2"
          />
          <path d="M8 21h8M12 17v4" />
        </svg>

        <span>Sala</span>
      </div>
    );
  }

  return <span>—</span>;
}

/* =========================================================
   AGRUPAR PERMISOS
========================================================= */

// 👈 AQUÍ: esta función crea los grupos de Navidad
// y Semana Santa.
function agruparPermisos(permisos: Permiso[]) {
  const resultado: (Permiso | PermisoAgrupado)[] = [];

  permisos.forEach((permiso) => {
    const esAgrupable =
      permiso.tipo === "Navidad" ||
      permiso.tipo === "Semana Santa";

    // 👈 AQUÍ: los permisos normales NO se agrupan
    if (!esAgrupable) {
      resultado.push(permiso);
      return;
    }

    // 👈 AQUÍ: buscamos un grupo del mismo usuario
    // y del mismo tipo.
    const grupo = resultado.find(
      (item) =>
        "dias" in item &&
        item.usuario_id === permiso.usuario_id &&
        item.tipo === permiso.tipo
    ) as PermisoAgrupado | undefined;

    // 👈 AQUÍ: si no existe, creamos el grupo
    if (!grupo) {
      resultado.push({
        id: permiso.id,
        usuario_id: permiso.usuario_id,
        tipo: permiso.tipo,
        usuario: permiso.usuario,
        motivo: permiso.motivo,
        estado: permiso.estado,
        created_at: permiso.created_at,

        dias: [
          {
            id: permiso.id,
            fecha: permiso.fecha_inicio,
          },
        ],
      });

      return;
    }

    // 👈 AQUÍ: comprobamos las fechas del grupo
    const fechas = grupo.dias.map(
      (dia) => new Date(dia.fecha + "T00:00:00")
    );

    fechas.push(
      new Date(
        permiso.fecha_inicio + "T00:00:00"
      )
    );

    const primeraFecha = Math.min(
      ...fechas.map((fecha) => fecha.getTime())
    );

    const ultimaFecha = Math.max(
      ...fechas.map((fecha) => fecha.getTime())
    );

    const diferenciaDias =
      (ultimaFecha - primeraFecha) /
      (1000 * 60 * 60 * 24);

    // 👈 AQUÍ: máximo 30 días entre las fechas
    if (diferenciaDias <= 30) {
      grupo.dias.push({
        id: permiso.id,
        fecha: permiso.fecha_inicio,
      });
    } else {
      // 👈 AQUÍ: si está a más de 30 días,
      // empieza otro grupo.
      resultado.push({
        id: permiso.id,
        usuario_id: permiso.usuario_id,
        tipo: permiso.tipo,
        usuario: permiso.usuario,
        motivo: permiso.motivo,
        estado: permiso.estado,
        created_at: permiso.created_at,

        dias: [
          {
            id: permiso.id,
            fecha: permiso.fecha_inicio,
          },
        ],
      });
    }
  });

  // 👈 AQUÍ: ordenamos las fechas de cada grupo
  resultado.forEach((item) => {
    if ("dias" in item) {
      item.dias.sort((a, b) =>
        a.fecha.localeCompare(b.fecha)
      );
    }
  });

  return resultado;
}

/* =========================================================
   PÁGINA
========================================================= */


export default function PermisosPage() {
  const router = useRouter();

  const [permisos, setPermisos] =
    useState<Permiso[]>([]);

  // 👈 AQUÍ: permisosVista puede contener
  // permisos normales O permisos agrupados.
  const [permisosVista, setPermisosVista] =
    useState<(Permiso | PermisoAgrupado)[]>([]);

  const [cargando, setCargando] = useState(true);
  const [usuarioConectadoId, setUsuarioConectadoId] =
  useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [fotoAmpliada, setFotoAmpliada] =
    useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
const [filtroTipo, setFiltroTipo] = useState("Todos");
  useEffect(() => {
    async function cargarPermisos() {
      try {
        setCargando(true);
        setError(null);

        const { data, error } = await supabase
          .from("vacaciones")
          .select(`
            *,
            usuario:usuarios (
              id,
              nombre,
              sexo,
              avatar_url,
              categoria,
              puesto,
              activo
            )
          `)
          .order("fecha_inicio", {
            ascending: true,
          });

        if (error) {
          throw error;
        }

const lista = (data || []) as Permiso[];

// Solo permisos de hoy en adelante
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

const listaFutura = lista.filter((permiso) => {
  const fechaInicio = new Date(
    permiso.fecha_inicio + "T00:00:00"
  );

  return fechaInicio >= hoy;
});

setPermisos(listaFutura);

setPermisosVista(
  agruparPermisos(listaFutura)
);
      } catch (err) {
        console.error(
          "Error cargando permisos:",
          err
        );

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "No se pudieron cargar los permisos."
          );
        }
      } finally {
        setCargando(false);
      }
    }

   async function cargarUsuarioConectado() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      setUsuarioConectadoId(user.id);
    }
  }

  cargarUsuarioConectado();
  cargarPermisos();
}, []);

  async function borrar(id: string) {
    const confirmar = confirm(
      "¿Quieres borrar esta solicitud?"
    );

    if (!confirmar) return;

    try {
      await eliminarSolicitud(id);

      // Recargamos la lista después de borrar
      window.location.reload();
    } catch (error) {
      console.error("Error al borrar solicitud:", error);
    }
  }
    const permisosFiltrados = permisosVista.filter((permiso) => {
    const texto = busqueda.toLowerCase().trim();
if (
  filtroTipo !== "Todos" &&
  permiso.tipo !== filtroTipo
) {
  return false;
}
    if (!texto) {
      return true;
    }

    const visual = obtenerVisual(permiso.tipo);

    const fechas =
      "dias" in permiso
        ? permiso.dias
            .map((dia) => dia.fecha)
            .join(" ")
        : `${permiso.fecha_inicio} ${permiso.fecha_fin}`;

    const contenido = `
      ${permiso.tipo}
      ${visual.abreviatura}
      ${fechas}
      ${permiso.motivo || ""}
      ${permiso.usuario?.nombre || ""}
    `.toLowerCase();

    return contenido.includes(texto);
  });

  return (
<main className="min-h-screen bg-slate-100 px-4 pb-24 pt-5">
      <div className="mx-auto max-w-3xl">


      {/* =========================
          CABECERA
      ========================= */}

      <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-7 w-7"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 4h6m-7 4h8m-8 4h5m-5 4h4M6 3h9l3 3v15H6V3z"
    />
  </svg>
  Solicitudes Grupales
</h1>


      <button
        onClick={() => {
          window.location.href =
            "/solicitudes/nueva";
        }}
        className="
  mt-6
  w-full
  rounded-2xl
  bg-slate-800
  py-3
  text-lg
  font-semibold
  text-white
  transition
  hover:bg-slate-700
  active:scale-[0.98]
"
      >
  <span className="flex items-center justify-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 5v14M5 12h14"
      />
    </svg>
    Nueva solicitud
  </span>
</button>




{/* =========================
    BUSCADOR + FILTRO
========================= */}

<div className="mt-4 flex gap-2">

  {/* BUSCADOR */}
  <div className="relative flex-1">

    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="
        absolute
        left-4
        top-1/2
        h-5
        w-5
        -translate-y-1/2
        text-slate-400
      "
      aria-hidden="true"
    >
      <path
        d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>

    <input
      type="text"
      value={busqueda}
      onChange={(e) =>
        setBusqueda(e.target.value)
      }
      placeholder="Buscar solicitud..."
      className="
        w-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        py-3
        pl-12
        pr-10
        text-sm
        text-slate-800
        shadow-sm
        outline-none
        placeholder:text-slate-400
        focus:border-slate-400
        focus:ring-2
        focus:ring-slate-200
      "
    />

    {busqueda && (
      <button
        type="button"
        onClick={() => setBusqueda("")}
        className="
          absolute
          right-3
          top-1/2
          flex
          h-7
          w-7
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          text-slate-400
          hover:bg-slate-100
          hover:text-slate-600
        "
        aria-label="Borrar búsqueda"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6 6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    )}

  </div>

  {/* FILTRO */}
  <select
    value={filtroTipo}
    onChange={(e) =>
      setFiltroTipo(e.target.value)
    }
    className="
      min-w-[140px]
      rounded-2xl
      border
      border-slate-200
      bg-white
      px-3
      py-3
      text-sm
      font-semibold
      text-slate-700
      shadow-sm
      outline-none
      focus:border-slate-400
      focus:ring-2
      focus:ring-slate-200
    "
    aria-label="Filtrar por tipo de permiso"
  >
    <option value="Todos">
      Todos
    </option>

    <option value="Vacaciones">
      Vacaciones
    </option>

    <option value="Asunto propio">
      Asunto propio
    </option>

    <option value="Compensación horaria">
      Compensación horaria
    </option>

    <option value="Indisposición">
      Indisposición
    </option>

    <option value="Navidad">
      Navidad
    </option>

    <option value="Semana Santa">
      Semana Santa
    </option>

    <option value="Paternidad">
      Paternidad
    </option>

    <option value="Maternidad">
      Maternidad
    </option>

    <option value="Lactancia">
      Lactancia
    </option>


    <option value="Permiso urgente">
      Permiso urgente
    </option>

       <option value="Otros permisos">
      Otros permisos
    </option>

  </select>

</div>
        
        {/* =================================================
            CARGANDO
        ================================================= */}

        {cargando && (
          <div className="mt-6 rounded-3xl bg-white p-7 text-center shadow-md">
            <p className="text-sm text-slate-500">
              Cargando permisos...
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!cargando && error && (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5">
            <p className="font-semibold text-red-700">
              Error al cargar los permisos
            </p>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            SIN PERMISOS
        ================================================= */}

        {!cargando &&
          !error &&
          permisos.length === 0 && (
            <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-md">
              <div className="bg-slate-200 px-4 py-3 text-center">
                <h2 className="text-lg font-bold text-slate-800">
                  Personal de permiso
                </h2>
              </div>

              <div className="px-4 py-8 text-center">
                <div className="flex justify-center text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-8 w-8"
                  >
                    <path
                      d="M4 5.5C4 4.67 4.67 4 5.5 4H18.5C19.33 4 20 4.67 20 5.5V15.5C20 16.33 19.33 17 18.5 17H15L13 20H11L9 17H5.5C4.67 17 4 16.33 4 15.5V5.5Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="mt-2 font-semibold text-slate-600">
                  No hay permisos
                </p>
              </div>
            </div>
          )}

        {/* =================================================
            LISTADO DE TODOS LOS PERMISOS
        ================================================= */}

        {!cargando &&
          !error &&
          permisos.length > 0 && (
            <div className="mt-6 space-y-4">

              {/* 👈 AQUÍ: usamos permisosVista,
                  NO permisos */}
{permisosFiltrados.map((permiso) => {
                /* =================================================
                   👈 AQUÍ: SI ES AGRUPADO
                   Navidad / Semana Santa
                ================================================= */

                if ("dias" in permiso) {
                  const visual = obtenerVisual(
                    permiso.tipo
                  );

                  const IconoPermiso =
                    visual.icono;

                  const usuario =
                    permiso.usuario;

                  const avatarUrl =
                    usuario?.avatar_url
                      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${usuario.avatar_url}`
                      : null;

                  return (
                    <div
                      key={permiso.id}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md"
                    >

                      {/* PARTE SUPERIOR */}

                      <div
                        className={`
                          px-4
                          py-4
                          ${
                            usuario?.sexo === "mujer"
                              ? "bg-pink-50"
                              : "bg-blue-50"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between gap-3">

                          {/* AVATAR + NOMBRE */}

                          <div className="flex min-w-0 flex-1 items-center gap-2.5">

                            {usuario?.activo !== false ? (
                              <>
                                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-1 ring-slate-300">

                                  {avatarUrl ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setFotoAmpliada(
                                          avatarUrl
                                        )
                                      }
                                      className="h-full w-full cursor-pointer"
                                      aria-label={`Ampliar foto de ${
                                        usuario?.nombre ||
                                        "usuario"
                                      }`}
                                    >
                                      <img
                                        src={avatarUrl}
                                        alt={`Foto de ${
                                          usuario?.nombre ||
                                          "usuario"
                                        }`}
                                        className="h-full w-full object-cover transition hover:scale-105"
                                      />
                                    </button>
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                      <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-5 w-5 text-slate-400"
                                      >
                                        <circle
                                          cx="12"
                                          cy="7"
                                          r="4"
                                        />
                                        <path d="M4 21a8 8 0 0 1 16 0" />
                                      </svg>
                                    </div>
                                  )}

                                </div>

                                <p className="min-w-0 truncate text-base font-bold text-slate-800">
                                  {usuario?.nombre ||
                                    "Usuario"}
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-600 ring-1 ring-slate-400">
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-5 w-5"
                                  >
                                    <rect
                                      x="5"
                                      y="10"
                                      width="14"
                                      height="10"
                                      rx="2"
                                    />
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                  </svg>
                                </div>

                                <p className="min-w-0 truncate text-base font-bold text-slate-500">
                                  Usuario inactivo
                                </p>
                              </>
                            )}

                          </div>

                          {/* CATEGORÍA + PUESTO */}

                          <div className="shrink-0 text-right">

                            <p className="text-xs font-semibold text-slate-500">
                              {obtenerCategoria(
                                usuario?.categoria ||
                                  null
                              )}
                            </p>

                            <div className="mt-1 text-xs font-semibold text-slate-500">
                              {obtenerPuesto(
                                usuario?.puesto ||
                                  null
                              )}
                            </div>

                          </div>

                        </div>
                      </div>

                      {/* PARTE INFERIOR */}

                      <div className="relative px-4 py-4">

                        <div className="ml-[68px] mr-[52px]">

                          {/* TIPO */}

                          <p className="flex items-center gap-2 text-base font-bold leading-tight text-slate-800">

                            {IconoPermiso && (
                              <IconoPermiso
                                className="
                                  h-5
                                  w-5
                                  shrink-0
                                  text-slate-700
                                "
                              />
                            )}

                            {permiso.tipo}

                          </p>

                          {/* 👈 AQUÍ: DÍAS AGRUPADOS */}

                          <div className="mt-3 space-y-2">

{permiso.dias.map(
  (dia, index) => (
    <div
      key={dia.id}
      className="flex items-center justify-between"
    >
      <p className="flex items-center gap-1.5 text-sm font-bold text-slate-700">

        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-3.5 w-3.5 shrink-0"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <path
            d="M3 10H21"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <path
            d="M8 3V7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <path
            d="M16 3V7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        Día {index + 1}:{" "}

        {new Date(
          dia.fecha
        ).toLocaleDateString(
          "es-ES",
          {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }
        )}

      </p>
 {/* PAPELERA — SOLO PARA EL USUARIO CONECTADO */}
      {usuarioConectadoId === permiso.usuario_id && (
        <button
        onClick={() => borrar(dia.id)}
          type="button"
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-red-100
            text-red-600
            transition
            hover:bg-red-200
            active:scale-95
          "
          aria-label={`Eliminar Día ${index + 1}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 6h18"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 6V4h8v2"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 6l-1 14H6L5 6"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 11v5m4-5v5"
            />
          </svg>
        </button>
      )}

    </div>
  )
)}

      
                          </div>

                          {permiso.motivo && (
                            <p className="mt-2 text-xs italic leading-5 text-slate-500">
                              Observaciones:{" "}
                              {permiso.motivo}
                            </p>
                          )}

                          {permiso.created_at && (
                            <p className="mt-3 text-xs text-slate-400">
                              <span className="inline-flex items-center gap-1.5">

                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="h-4 w-4 shrink-0"
                                >
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="8.5"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                  />

                                  <path
                                    d="M12 7.5V12L15 14"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>

                                {formatearFecha(
                                  permiso.created_at
                                )}

                              </span>
                            </p>
                          )}

                        </div>



                        {/* CÍRCULO */}

                        <div
                          className={`
                            absolute
                            left-4
                            top-1/2
                            flex
                            h-14
                            w-14
                            -translate-y-1/2
                            items-center
                            justify-center
                            rounded-full
                            ${visual.color}
                            text-[11px]
                            font-extrabold
                            text-white
                            shadow-sm
                          `}
                        >
                          {visual.abreviatura}
                        </div>

                      </div>

                    </div>
                  );
                }

                /* =================================================
                   👈 AQUÍ: SI NO ES AGRUPADO
                   ESTA ES LA TARJETA NORMAL
                ================================================= */

                const visual = obtenerVisual(
                  permiso.tipo
                );

                const IconoPermiso =
                  visual.icono;

                const usuario =
                  permiso.usuario;

                const avatarUrl =
                  usuario?.avatar_url
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${usuario.avatar_url}`
                    : null;

                return (
                  <div
                    key={permiso.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md"
                  >

                    {/* PARTE SUPERIOR */}

                    <div
                      className={`
                        px-4
                        py-4
                        ${
                          usuario?.sexo === "mujer"
                            ? "bg-pink-50"
                            : "bg-blue-50"
                        }
                      `}
                    >

                      <div className="flex items-center justify-between gap-3">

                        {/* AVATAR + NOMBRE */}

                        <div className="flex min-w-0 flex-1 items-center gap-2.5">

                          {usuario?.activo !== false ? (
                            <>
                              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-1 ring-slate-300">

                                {avatarUrl ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setFotoAmpliada(
                                        avatarUrl
                                      )
                                    }
                                    className="h-full w-full cursor-pointer"
                                    aria-label={`Ampliar foto de ${
                                      usuario?.nombre ||
                                      "usuario"
                                    }`}
                                  >
                                    <img
                                      src={avatarUrl}
                                      alt={`Foto de ${
                                        usuario?.nombre ||
                                        "usuario"
                                      }`}
                                      className="h-full w-full object-cover transition hover:scale-105"
                                    />
                                  </button>
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <svg
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-5 w-5 text-slate-400"
                                    >
                                      <circle
                                        cx="12"
                                        cy="7"
                                        r="4"
                                      />
                                      <path d="M4 21a8 8 0 0 1 16 0" />
                                    </svg>
                                  </div>
                                )}

                              </div>

                              <p className="min-w-0 truncate text-base font-bold text-slate-800">
                                {usuario?.nombre ||
                                  "Usuario"}
                              </p>
                            </>
                          ) : (
                            <>
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-300 text-slate-600 ring-1 ring-slate-400">
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-5 w-5"
                                >
                                  <rect
                                    x="5"
                                    y="10"
                                    width="14"
                                    height="10"
                                    rx="2"
                                  />
                                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                </svg>
                              </div>

                              <p className="min-w-0 truncate text-base font-bold text-slate-500">
                                Usuario inactivo
                              </p>
                            </>
                          )}

                        </div>

                        {/* CATEGORÍA + PUESTO */}

                        <div className="shrink-0 text-right">

                          <p className="text-xs font-semibold text-slate-500">
                            {obtenerCategoria(
                              usuario?.categoria ||
                                null
                            )}
                          </p>

                          <div className="mt-1 text-xs font-semibold text-slate-500">
                            {obtenerPuesto(
                              usuario?.puesto ||
                                null
                            )}
                          </div>

                        </div>

                      </div>
                    </div>

                    {/* PARTE INFERIOR */}

                    <div className="relative px-4 py-4">

                      <div className="ml-[68px] mr-[52px]">

                        {/* TIPO */}

                        <p className="flex items-center gap-2 text-base font-bold leading-tight text-slate-800">

                          {IconoPermiso && (
                            <IconoPermiso
                              className="
                                h-5
                                w-5
                                shrink-0
                                text-slate-700
                              "
                            />
                          )}

                          {permiso.tipo}

                        </p>

                        {/* FECHA */}

                        <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-slate-700">

                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-3.5 w-3.5 shrink-0"
                          >
                            <rect
                              x="3"
                              y="5"
                              width="18"
                              height="16"
                              rx="3"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />

                            <path
                              d="M3 10H21"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />

                            <path
                              d="M8 3V7"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />

                            <path
                              d="M16 3V7"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>

                          {new Date(
                            permiso.fecha_inicio
                          ).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )}

                          {permiso.fecha_inicio !==
                            permiso.fecha_fin && (
                            <>
                              {" → "}

                              {new Date(
                                permiso.fecha_fin
                              ).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "2-digit",
                                }
                              )}
                            </>
                          )}

                        </p>

                        {/* OBSERVACIONES */}

                        {permiso.motivo && (
                          <p className="mt-2 text-xs italic leading-5 text-slate-500">
                            Observaciones:{" "}
                            {permiso.motivo}
                          </p>
                        )}

                        {/* REGISTRO */}

                        {permiso.created_at && (
                          <p className="mt-3 text-xs text-slate-400">
                            <span className="inline-flex items-center gap-1.5">

                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-4 w-4 shrink-0"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="8.5"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />

                                <path
                                  d="M12 7.5V12L15 14"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>

                              {formatearFecha(
                                permiso.created_at
                              )}

                            </span>
                          </p>
                        )}

{/* PAPELERA */}
{usuarioConectadoId === permiso.usuario_id && (

<button
onClick={() => borrar(permiso.id)}
  type="button"
  className="
    absolute
    bottom-4
    right-4
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-full
    bg-red-100
    text-red-600
    transition
    hover:bg-red-200
    active:scale-95
  "
  aria-label="Eliminar solicitud"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 6h18"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 6V4h8v2"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 6l-1 14H6L5 6"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 11v5m4-5v5"
    />
  </svg>
</button>

)}
                      </div>

                      {/* CÍRCULO */}

                      <div
                        className={`
                          absolute
                          left-4
                          top-1/2
                          flex
                          h-14
                          w-14
                          -translate-y-1/2
                          items-center
                          justify-center
                          rounded-full
                          ${visual.color}
                          text-[11px]
                          font-extrabold
                          text-white
                          shadow-sm
                        `}
                      >
                        {visual.abreviatura}
                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

      </div>

      
     {/* =========================
    HISTORIAL
========================= */}

<button
  type="button"
  onClick={() => router.push("/solicitudes/grupales/historial")}
  className="
    mt-4
    w-full
    rounded-2xl
    bg-slate-800
    py-3
    text-lg
    font-semibold
    text-white
    transition
    hover:bg-slate-700
    active:scale-[0.98]
  "
>
  <span className="flex items-center justify-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7h6l2 2h10v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
      />
    </svg>

    Historial de peticiones
  </span>
</button>


      {/* =================================================
          FOTO AMPLIADA
      ================================================= */}

      {fotoAmpliada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5"
          onClick={() =>
            setFotoAmpliada(null)
          }
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl bg-white p-2 shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <img
              src={fotoAmpliada}
              alt="Foto ampliada"
              className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain"
            />

            <button
              type="button"
              onClick={() =>
                setFotoAmpliada(null)
              }
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-xl font-bold text-white"
              aria-label="Cerrar foto"
            >
              ×
            </button>
          </div>
        </div>
      )}



<BottomNav />
    </main>

    
  );
}