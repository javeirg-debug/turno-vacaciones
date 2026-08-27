"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/navigation/BottomNav";
import { supabase } from "@/lib/supabase";
import { obtenerAvisoActivo } from "@/services/avisos";
import { obtenerConflictosUsuario } from "@/services/conflictos";
import { eliminarSolicitud } from "@/services/solicitudes";

import {
  IconUser,
  IconPencil,
  IconInfo,
  IconCrown,
  IconPolice,
  IconCar,
  IconClock,
  IconAlert,
  IconAlertTriangle,
  IconUsers,
  IconCalendar,
  IconTrash,
  IconKey,
  IconLogout,
  IconSunrise,
  IconSun,
  IconMoon,
  IconFree,
  IconApp,
  IconShield,
  IconMonitor,
  IconX,
  IconSmartphone,
} from "@/components/icons/Icons";

const inicioTurno = new Date(2026, 6, 16);

function obtenerTurnoHoy() {
  const hoy = new Date();

  const diferencia = Math.floor(
    (hoy.getTime() - inicioTurno.getTime()) /
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

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

type Usuario = {
  id: string;
  nombre: string;
  rol: string;
  sexo: string;
  categoria: string | null;
  puesto: string;
};

type Solicitud = {
  id: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  motivo: string | null;
};

type Aviso = {
  texto: string;
  creado_en: string;
  creado_por: string;

  usuarios: {
    nombre: string;
  } | null;
};

type FechaConflictiva = {
  fecha: string;
  gac: number;
  seguridad: number;
  sala: number;
};

export default function Inicio() {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [solicitudes, setSolicitudes] =
    useState<Solicitud[]>([]);

  const [solicitudesVista, setSolicitudesVista] =
    useState<any[]>([]);

  const [aviso, setAviso] =
    useState<Aviso | null>(null);

  const [fechasConflictivas, setFechasConflictivas] =
    useState<FechaConflictiva[] | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [mostrarInfo, setMostrarInfo] =
    useState(false);

  useEffect(() => {
    async function cargar() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: perfil } =
        await supabase
          .from("usuarios")
          .select(
            "id,nombre,rol,sexo,categoria,puesto"
          )
          .eq("id", user.id)
          .single();

      setUsuario(perfil);

      const hoy =
        new Date()
          .toISOString()
          .split("T")[0];

      const { data } =
        await supabase
          .from("vacaciones")
          .select(
            "id,tipo,fecha_inicio,fecha_fin,motivo"
          )
          .eq("usuario_id", user.id)
          .gte("fecha_fin", hoy)
          .order("fecha_inicio");

      const lista = data || [];

      const agrupadas: any[] = [];

      lista.forEach((s) => {
        if (
          s.tipo === "🎄 Navidad" ||
          s.tipo === "✝️ Semana Santa"
        ) {
          const grupo = agrupadas.find(
            (x) => x.tipo === s.tipo
          );

          if (grupo) {
            grupo.dias.push({
              id: s.id,
              fecha: s.fecha_inicio,
            });
          } else {
            agrupadas.push({
              ...s,
              dias: [
                {
                  id: s.id,
                  fecha: s.fecha_inicio,
                },
              ],
            });
          }
        } else {
          agrupadas.push(s);
        }
      });

      setSolicitudes(lista);
      setSolicitudesVista(agrupadas);

      const conflictos =
        await obtenerConflictosUsuario(user.id);

      console.log(conflictos);

      setFechasConflictivas(conflictos);

      const avisoActivo =
        await obtenerAvisoActivo();

      setAviso(avisoActivo);

      setCargando(false);
    }

    cargar();
  }, [router]);

  const partesNombre =
    usuario?.nombre?.trim().split(/\s+/) || [];

  const nombrePrimero =
    partesNombre.length > 0
      ? partesNombre[0]
      : "Usuario";

  const nombreSegundo =
    partesNombre.length > 1
      ? partesNombre[1]
      : "";

  const nombreTercero =
    partesNombre.length > 2
      ? partesNombre.slice(2).join(" ")
      : "";

  async function cerrarSesion() {
    await supabase.auth.signOut();

    router.replace("/login");
  }

  async function borrar(id: string) {
    const confirmar = confirm(
      "¿Quieres borrar esta solicitud?"
    );

    if (!confirmar) return;

    await eliminarSolicitud(id);

    window.location.reload();
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-100">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-sm text-slate-500">
            Cargando...
          </div>
        </div>

        <BottomNav />
      </main>
    );
  }

  const turnoHoy = obtenerTurnoHoy();

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-24 pt-6">

      {/* =========================
          TARJETA PERFIL
      ========================= */}

      <div className="relative mx-auto w-full max-w-xl rounded-3xl bg-white p-5 shadow-lg">

        {/* INFORMACIÓN */}

        <button
          onClick={() => setMostrarInfo(true)}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          aria-label="Información"
        >
          <IconInfo className="h-5 w-5" />
        </button>

        {/* CONTENIDO */}

        <div className="flex items-center justify-start gap-7 px-2">

          {/* =========================
              AVATAR
          ========================= */}

          <div className="relative shrink-0">

            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400 ring-1 ring-slate-200">

              <IconUser className="h-20 w-20" />

            </div>

            {/* BOTÓN EDITAR */}

            <button
              onClick={() => {
                console.log("Editar avatar");
              }}
              className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg ring-4 ring-white transition hover:bg-slate-700"
              aria-label="Editar avatar"
            >
              <IconPencil className="h-5 w-5" />
            </button>

          </div>

          {/* =========================
              INFORMACIÓN USUARIO
          ========================= */}

          <div className="min-w-0 text-left">

            {/* NOMBRE COMPLETO */}

            <div className="mb-3">

              <h1 className="text-2xl font-bold leading-[1.05] text-slate-800">
                {nombrePrimero} {nombreSegundo}
              </h1>

              {nombreTercero && (
                <h1 className="text-2xl font-bold leading-[1.05] text-slate-800">
                  {nombreTercero}
                </h1>
              )}

            </div>

            {/* ADMINISTRADOR */}

            {usuario?.rol === "admin" && (
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-600">

                <IconCrown className="h-4 w-4 shrink-0" />

                <span>
                  Administrador
                </span>

              </div>
            )}

            {/* POLICÍA + PUESTO */}

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">

              {/* CATEGORÍA */}

              <div className="flex items-center gap-2">

                <IconPolice className="h-4 w-4 shrink-0" />

                <span className="font-medium">
                  {usuario?.categoria === "oficial"
                    ? "Oficial de Policía"
                    : usuario?.categoria === "policia"
                    ? "Policía"
                    : "—"}
                </span>

              </div>

              {/* PUESTO */}

              <div className="flex items-center gap-2">

                <IconCar className="h-4 w-4 shrink-0" />

                <span className="font-medium">
                  {usuario?.puesto === "gac"
                    ? "G.A.C"
                    : usuario?.puesto === "seguridad"
                    ? "Seguridad"
                    : usuario?.puesto === "sala"
                    ? "Sala"
                    : "—"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          TURNO DE HOY
      ========================= */}

      <div className="mt-4 rounded-3xl bg-white p-5 shadow">

        <h2 className="flex items-center gap-2 text-xl font-bold">
          <IconClock className="h-5 w-5" />
          Turno de hoy
        </h2>

        <div className="mt-4 flex items-center gap-3 text-3xl font-bold">

          {turnoHoy.icono === "sunrise" && (
            <IconSunrise className="h-8 w-8 shrink-0" />
          )}

          {turnoHoy.icono === "sun" && (
            <IconSun className="h-8 w-8 shrink-0" />
          )}

          {turnoHoy.icono === "moon" && (
            <IconMoon className="h-8 w-8 shrink-0" />
          )}

          {turnoHoy.icono === "free" && (
            <IconFree className="h-8 w-8 shrink-0" />
          )}

          <span>
            {turnoHoy.texto}
          </span>

        </div>

      </div>

      {/* =========================
          AVISOS
      ========================= */}

      <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow">

        <h2 className="flex items-center gap-2 text-xl font-bold text-amber-900">
          <IconAlert className="h-5 w-5" />
          Avisos
        </h2>

        {aviso ? (
          <>
            <p className="mt-3 text-amber-800">
              {aviso.texto}
            </p>

            <p className="mt-4 text-sm italic text-amber-700">
              Creado por {aviso.usuarios?.nombre}
              <br />
              {formatearFecha(aviso.creado_en)}
            </p>
          </>
        ) : (
          <p className="mt-3 text-amber-800">
            No hay avisos actualmente.
          </p>
        )}

      </div>

      {/* =========================
          FECHAS CONFLICTIVAS
      ========================= */}

      <div
        className={`mt-4 rounded-3xl p-4 shadow ${
          fechasConflictivas === null
            ? "border border-slate-200 bg-white"
            : fechasConflictivas.length > 0
            ? "border border-red-200 bg-red-50"
            : "border border-green-200 bg-green-50"
        }`}
      >

        <h2
          className={`mb-3 flex items-center gap-2 text-lg font-bold ${
            fechasConflictivas === null
              ? "text-slate-800"
              : fechasConflictivas.length > 0
              ? "text-red-900"
              : "text-green-900"
          }`}
        >
          <IconAlertTriangle className="h-5 w-5" />
          Fechas conflictivas
        </h2>

        {fechasConflictivas === null ? (

          <p className="text-sm text-slate-500">
            Comprobando ocupación...
          </p>

        ) : fechasConflictivas.length > 0 ? (

          <>
            <p className="mb-2 text-sm text-slate-700">
              Tienes coincidencias en fechas de alta ocupación:
            </p>

            <div className="space-y-2">

              {fechasConflictivas.map((f) => (

                <button
                  key={f.fecha}
                  onClick={() =>
                    router.push(
                      `/calendario/${f.fecha}`
                    )
                  }
                  className="
                    w-full
                    rounded-2xl
                    bg-red-100
                    p-3
                    shadow-sm
                    transition
                    active:scale-95
                  "
                >

                  <div
                    className="
                      border-y
                      border-red-200
                      py-1
                      text-center
                    "
                  >

                    <div className="flex items-center justify-center gap-2">

                      <p className="text-sm font-bold text-slate-800">
                        {new Date(f.fecha).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>

                      <IconUsers className="h-4 w-4 text-slate-700" />

                      <p className="text-sm font-bold text-slate-800">
                        {f.gac +
                          f.seguridad +
                          f.sala}
                      </p>

                    </div>

                  </div>

                  <div
                    className="
                      mt-2
                      grid
                      grid-cols-3
                      text-center
                    "
                  >

                    <div>
                      <p className="text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <IconCar className="h-3.5 w-3.5" />
                          G.A.C.:
                        </span>{" "}
                        <span className="font-bold text-slate-800">
                          {f.gac}
                        </span>
                      </p>
                    </div>

                    <div className="border-x border-red-200">
                      <p className="text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <IconShield className="h-3.5 w-3.5" />
                          Seguridad:
                        </span>{" "}
                        <span className="font-bold text-slate-800">
                          {f.seguridad}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <IconMonitor className="h-3.5 w-3.5" />
                          Sala:
                        </span>{" "}
                        <span className="font-bold text-slate-800">
                          {f.sala}
                        </span>
                      </p>
                    </div>

                  </div>

                </button>

              ))}

            </div>
          </>

        ) : (

          <p className="text-sm text-green-800">
            No tienes coincidencias en días de alta ocupación.
          </p>

        )}

      </div>

      {/* =========================
          PRÓXIMOS PERMISOS
      ========================= */}

      <div className="mt-4 rounded-3xl bg-white p-5 shadow">

        <h2 className="flex items-center gap-2 text-xl font-bold">
          <IconCalendar className="h-5 w-5" />
          Próximos permisos
        </h2>

        {cargando ? (

          <p className="mt-4">
            Cargando...
          </p>

        ) : solicitudes.length === 0 ? (

          <p className="mt-4 text-slate-500">
            No tienes permisos pendientes.
          </p>

        ) : (

          <div className="mt-4 space-y-3">

            {solicitudesVista.map((solicitud) => {

              const tipo = solicitud.tipo;

              let abreviatura = "OT";
              let color = "bg-slate-500";

              switch (tipo) {

                case "🌴 Vacaciones":
                  abreviatura = "VAC";
                  color = "bg-teal-500";
                  break;

                case "🟢 AP":
                  abreviatura = "AP";
                  color = "bg-sky-500";
                  break;

                case "⏰ Compensación horaria":
                  abreviatura = "CH";
                  color = "bg-slate-600";
                  break;

                case "🤒 Indisposición":
                  abreviatura = "IND";
                  color = "bg-red-500";
                  break;

                case "🎄 Navidad":
                  abreviatura = "NAV";
                  color = "bg-indigo-500";
                  break;

                case "✝️ Semana Santa":
                  abreviatura = "SS";
                  color = "bg-violet-500";
                  break;

                case "👶 Paternidad":
                  abreviatura = "PAT";
                  color = "bg-blue-500";
                  break;

                case "🤰 Maternidad":
                  abreviatura = "MAT";
                  color = "bg-pink-500";
                  break;

                case "🍼 Lactancia":
                  abreviatura = "LAC";
                  color = "bg-amber-500";
                  break;

                case "📄 Otros permisos":
                  abreviatura = "OT";
                  color = "bg-fuchsia-500";
                  break;

                case "🚨 Permiso urgente":
                  abreviatura = "URG";
                  color = "bg-orange-500";
                  break;
              }

              return (

                <div
                  key={solicitud.id}
                  className="
                    rounded-2xl
                    bg-white
                    px-3
                    py-3
                    shadow-md
                    border
                    border-slate-200
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-[11px]
                        font-extrabold
                        text-white
                        ${color}
                      `}
                    >
                      {abreviatura}
                    </div>

                    <button
                      onClick={() =>
                        router.push("/solicitudes")
                      }
                      className="
                        min-w-0
                        flex-1
                        text-left
                      "
                    >

                      <p
                        className="
                          text-base
                          font-bold
                          leading-tight
                          text-slate-800
                        "
                      >
                        {tipo}
                      </p>

                      {!solicitud.dias && (

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >

                          <span className="inline-flex items-center gap-1">
                            📅{" "}
{formatearFecha(solicitud.fecha_inicio)}
                          </span>

                          {solicitud.fecha_inicio !==
                            solicitud.fecha_fin && (
                            <>
                              {" → "}
                              {formatearFecha(
                                solicitud.fecha_fin
                              )}
                            </>
                          )}

                        </p>

                      )}

                      {!solicitud.dias &&
                        solicitud.motivo && (

                          <p
                            className="
                              mt-1
                              text-xs
                              italic
                              text-slate-500
                            "
                          >
                            Observaciones:{" "}
                            {solicitud.motivo}
                          </p>

                        )}

                    </button>

                    {!solicitud.dias && (

                      <button
                        type="button"
                        onClick={() =>
                          borrar(
                            solicitud.id
                          )
                        }
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-red-100
                          text-base
                          transition
                          hover:bg-red-200
                          active:scale-95
                        "
                        aria-label="Eliminar solicitud"
                      >
                        <IconTrash className="h-4 w-4 text-red-600" />
                      </button>

                    )}

                  </div>

                  {solicitud.dias && (

                    <div
                      className="
                        mt-3
                        ml-[68px]
                        space-y-2
                      "
                    >

                      {[...solicitud.dias]
                        .sort(
                          (
                            a: any,
                            b: any
                          ) =>
                            new Date(
                              a.fecha
                            ).getTime() -
                            new Date(
                              b.fecha
                            ).getTime()
                        )
                        .map(
                          (
                            dia: any,
                            index: number
                          ) => (

                            <div
                              key={dia.id}
                              className="
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                bg-slate-50
                                px-3
                                py-2
                              "
                            >

                              <div className="min-w-0">

                                <p
  className="
    text-xs
    text-slate-600
  "
>
  <span className="inline-flex items-center gap-1">
    📅{" "}
    {formatearFecha(dia.fecha)}
  </span>
</p>

                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  borrar(
                                    dia.id
                                  )
                                }
                                className="
                                  ml-3
                                  flex
                                  h-8
                                  w-8
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-red-100
                                  text-sm
                                  transition
                                  hover:bg-red-200
                                  active:scale-95
                                "
                                aria-label="Eliminar día"
                              >
                                <IconTrash className="h-4 w-4 text-red-600" />
                              </button>

                            </div>

                          )
                        )}

                      {solicitud.motivo && (
                        <p
                          className="
                            mt-2
                            text-xs
                            italic
                            text-slate-500
                          "
                        >
                          Observaciones:{" "}
                          {solicitud.motivo}
                        </p>
                      )}

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        )}

      </div>

      {/* =========================
          CUENTA
      ========================= */}

      <div className="mt-4 rounded-3xl bg-white p-5 shadow">

        <h2 className="flex items-center gap-2 text-xl font-bold">
          <IconUser className="h-5 w-5" />
          Cuenta
        </h2>

        <div className="mt-5 flex gap-3">

          <button
            onClick={() =>
              router.push(
                "/cambiar-clave"
              )
            }
            className="
              flex-1
              rounded-xl
              bg-amber-500
              py-3
              font-semibold
              text-white
            "
          >
            <span className="flex items-center justify-center gap-2">
              <IconKey className="h-4 w-4" />
              Cambiar clave
            </span>
          </button>

          <button
            onClick={cerrarSesion}
            className="
              flex-1
              rounded-xl
              bg-slate-800
              py-3
              font-semibold
              text-white
            "
          >
            <span className="flex items-center justify-center gap-2">
              <IconLogout className="h-4 w-4" />
              Salir
            </span>
          </button>

        </div>

      </div>

      {/* =========================
          INFORMACIÓN
      ========================= */}

      {mostrarInfo && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-6
          "
        >

          <div
            className="
              w-full
              max-w-2xl
              rounded-3xl
              bg-white
              p-6
              shadow-xl
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <h2
                className="
                  text-xl
                  font-bold
                  text-blue-900
                "
              >
                <span className="flex items-center gap-2">
                  <IconInfo className="h-5 w-5" />
                  Información de la aplicación
                </span>
              </h2>

              <button
                onClick={() =>
                  setMostrarInfo(false)
                }
                className="
                  text-xl
                  text-slate-400
                "
                aria-label="Cerrar"
              >
                <IconX className="h-5 w-5" />
              </button>

            </div>

            <div
              className="
                mt-6
                max-h-[60vh]
                space-y-5
                overflow-y-auto
                text-sm
                leading-7
                text-slate-700
              "
            >

              <div>

                <h3
                  className="
                    mb-2
                    text-lg
                    font-bold
                    text-blue-900
                  "
                >
                  <span className="flex items-center gap-2">
                    <IconSmartphone className="h-5 w-5" />
                    Sobre la aplicación
                  </span>
                </h3>

                <p>
                  Esta aplicación ha sido desarrollada de manera completamente altruista,
                  con el único objetivo de facilitar la organización y coordinación de los
                  turnos de vacaciones entre los funcionarios.
                </p>

                <p className="mt-3">
                  Se trata de una herramienta de apoyo para mejorar la comunicación y la
                  planificación interna,{" "}
                  <strong>
                    sin sustituir en ningún caso los procedimientos oficiales ni las
                    autorizaciones correspondientes.
                  </strong>
                </p>

                <p className="mt-3">
                  Cualquier permiso o incidencia deberá seguir tramitándose por los canales
                  oficiales establecidos.
                </p>

                <p className="mt-3">
                  Gracias a todos los compañeros por utilizarla y contribuir a una mejor
                  coordinación del servicio.
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                setMostrarInfo(false)
              }
              className="
                mt-6
                w-full
                rounded-xl
                bg-blue-900
                py-3
                font-bold
                text-white
              "
            >
              Entendido
            </button>

          </div>

        </div>

      )}

      <BottomNav />

    </main>
  );
}