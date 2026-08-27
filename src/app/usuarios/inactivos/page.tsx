import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import BottomNav from "@/components/navigation/BottomNav";
import DeleteUserButton from "@/components/DeleteUserButton";

type IconProps = {
  className?: string;
};

const Icon = ({
  children,
  className = "h-5 w-5",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

function IconCandado({ className }: IconProps) {
  return (
    <Icon className={className}>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v3" />
    </Icon>
  );
}

function IconEstrella({ className }: IconProps) {
  return (
    <Icon className={className ?? "h-4 w-4 text-amber-400"}>
      <path
        fill="currentColor"
        stroke="none"
        d="M12 2.8l2.8 5.7 6.3.9-4.55 4.45 1.07 6.28L12 17.17 6.38 20.13l1.07-6.28L2.9 9.4l6.3-.9L12 2.8z"
      />
    </Icon>
  );
}

function IconPlaca({ className }: IconProps) {
  return (
    <Icon className={className ?? "h-4 w-4 text-slate-500"}>
      <path d="M12 3l7 3v5c0 4.7-2.9 8.1-7 10-4.1-1.9-7-5.3-7-10V6l7-3z" />
      <path d="M9 11h6" />
      <path d="M10 14h4" />
    </Icon>
  );
}

function IconCoche({ className }: IconProps) {
  return (
    <Icon className={className ?? "h-4 w-4 text-slate-500"}>
      <path d="M5 17h14" />
      <path d="M6 17l1-5h10l1 5" />
      <path d="M8 12l1.5-3h5L16 12" />
      <circle cx="8" cy="17" r="1.5" />
      <circle cx="16" cy="17" r="1.5" />
    </Icon>
  );
}

function IconEscudo({ className }: IconProps) {
  return (
    <Icon className={className ?? "h-4 w-4 text-slate-500"}>
      <path d="M12 3l7 3v5c0 4.7-2.9 8.1-7 10-4.1-1.9-7-5.3-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </Icon>
  );
}

function IconPC({ className }: IconProps) {
  return (
    <Icon className={className ?? "h-4 w-4 text-slate-500"}>
      <rect x="4" y="4" width="16" height="11" rx="1.5" />
      <path d="M9 20h6" />
      <path d="M12 15v5" />
    </Icon>
  );
}

function IconActivar({ className }: IconProps) {
  return (
    <Icon className={className ?? "h-4 w-4"}>
      <path d="M20 6v5h-5" />
      <path d="M18.3 11a7 7 0 1 0 1.2 4" />
    </Icon>
  );
}

function IconFlecha({ className }: IconProps) {
  return (
    <Icon className={className ?? "h-4 w-4"}>
      <path d="M19 12H5" />
      <path d="M11 18l-6-6 6-6" />
    </Icon>
  );
}

export default async function UsuariosInactivos() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("*")
    .eq("activo", false);

  function obtenerIniciales(nombre: string) {
    const partes = nombre
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const quitarTildes = (texto: string) =>
      texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (partes.length >= 3) {
      return (
        quitarTildes(partes[0][0]) +
        quitarTildes(partes[1][0]) +
        quitarTildes(partes[2][0])
      ).toUpperCase();
    }

    if (partes.length === 2) {
      return (
        quitarTildes(partes[0][0]) +
        quitarTildes(partes[1][0])
      ).toUpperCase();
    }

    return quitarTildes(
      partes[0]?.substring(0, 2) || "US"
    ).toUpperCase();
  }

  function obtenerPuesto(puesto: string) {
    if (puesto === "gac") {
      return (
        <span className="inline-flex items-center gap-1.5">
          <IconCoche className="h-4 w-4 text-slate-500" />
          G.A.C
        </span>
      );
    }

    if (puesto === "seguridad") {
      return (
        <span className="inline-flex items-center gap-1.5">
          <IconEscudo className="h-4 w-4 text-slate-500" />
          Seguridad
        </span>
      );
    }

    if (puesto === "sala") {
      return (
        <span className="inline-flex items-center gap-1.5">
          <IconPC className="h-4 w-4 text-slate-500" />
          Sala
        </span>
      );
    }

    return "—";
  }

  function obtenerCategoria(categoria: string | null) {
    if (categoria === "oficial") {
      return (
        <span className="inline-flex items-center gap-1.5">
          <IconEstrella className="h-4 w-4 text-amber-400" />
          Oficial de Policía
        </span>
      );
    }

    if (categoria === "policia") {
      return (
        <span className="inline-flex items-center gap-1.5">
          <IconPlaca className="h-4 w-4 text-slate-500" />
          Policía
        </span>
      );
    }

    return "—";
  }

  const usuariosOrdenados = [...(usuarios || [])].sort(
    (a, b) => {
      if (
        a.categoria === "oficial" &&
        b.categoria !== "oficial"
      ) {
        return -1;
      }

      if (
        a.categoria !== "oficial" &&
        b.categoria === "oficial"
      ) {
        return 1;
      }

      return (a.nombre || "").localeCompare(
        b.nombre || ""
      );
    }
  );

  return (
    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      {/* CABECERA */}

      <div className="flex items-center justify-between">

        <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-800">
          <IconCandado className="h-7 w-7" />
          Usuarios inactivos
        </h1>

        <div
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-slate-800
            text-sm
            font-bold
            text-white
          "
        >
          {usuariosOrdenados.length}
        </div>

      </div>

      <p className="mt-2 text-slate-500">
        Usuarios bloqueados temporalmente.
      </p>

      {/* LISTADO */}

      <div className="mt-8 space-y-4">

        {usuariosOrdenados.map((usuario) => (

          <div
            key={usuario.id}
            className="
              flex
              min-h-[88px]
              overflow-hidden
              rounded-2xl
              bg-white
              shadow
            "
          >

            {/* INICIALES */}

            <div
              className="
                flex
                w-[76px]
                shrink-0
                items-center
                justify-center
              "
            >

              <div
                className={`
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  text-lg
                  font-bold
                  ${
                    usuario.sexo === "mujer"
                      ? "bg-pink-100 text-pink-600"
                      : "bg-blue-100 text-blue-600"
                  }
                `}
              >
                {obtenerIniciales(
                  usuario.nombre || "Usuario"
                )}
              </div>

            </div>

            {/* INFORMACIÓN */}

            <div
              className="
                min-w-0
                flex-1
                py-3
                pr-3
              "
            >

              <h3
                className="
                  truncate
                  text-lg
                  font-bold
                  text-slate-800
                "
              >
                {usuario.nombre || "Sin nombre"}
              </h3>

              <div
                className="
                  mt-1
                  flex
                  flex-wrap
                  gap-x-3
                  gap-y-1
                  text-sm
                  text-slate-500
                "
              >

                <span>
                  {obtenerCategoria(
                    usuario.categoria
                  )}
                </span>

                <span>
                  {obtenerPuesto(
                    usuario.puesto
                  )}
                </span>

              </div>

            </div>

            {/* ACCIONES */}

            <div
              className="
                flex
                w-[110px]
                shrink-0
                flex-col
              "
            >

              {/* ACTIVAR */}

              <Link
                href={`/usuarios/activar/${usuario.id}`}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-1.5
                  bg-emerald-100
                  px-2
                  text-sm
                  font-bold
                  text-emerald-700
                  transition
                  hover:bg-emerald-200
                "
              >
                <IconActivar className="h-4 w-4" />
                Activar
              </Link>

              {/* ELIMINAR */}

              <div
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  bg-rose-100
                "
              >
                <DeleteUserButton
                  id={usuario.id}
                  currentUserId={user?.id || ""}
                />
              </div>

            </div>

          </div>

        ))}

        {/* SIN USUARIOS */}

        {usuariosOrdenados.length === 0 && (

          <div
            className="
              rounded-2xl
              bg-white
              p-5
              text-center
              text-slate-500
              shadow
            "
          >
            No hay usuarios inactivos.
          </div>

        )}

      </div>

      {/* VOLVER */}

      <div className="mt-8">

        <Link
          href="/usuarios/gestion"
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-slate-800
            py-3
            font-semibold
            text-white
            shadow-md
            transition
            hover:bg-slate-700
            active:scale-[0.98]
          "
        >
          <IconFlecha className="h-4 w-4" />
          Volver a usuarios
        </Link>

      </div>

      <BottomNav />

    </main>
  );
}