"use client";

import React, { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import CalendarioOrdenServicio from "@/components/ordenservicio/CalendarioOrdenServicio";

const AVATAR_BUCKET = "avatars";

const POLICIA_PRACTICAS = "Policía en Prácticas";

const POLICIA_PRACTICAS_VISUAL = "P.Practicas";

type UsuarioOrden = {
  id: string;
  nombre: string;
  avatar_url?: string | null;
};

type PersonalOrden = {
  id: string;
  orden_id: string;
  usuario_id: string | null;
  nombre: string;
  indicativo: string | null;
  funcion: string;
  orden: number | null;
};

type PersonalGac = {
  usuario: UsuarioOrden;
  orden: number | null;
};

type GacFila = {
  indicativo: string;
  orden: number | null;
  personal: PersonalGac[];
};

type OrdenVisual = {
  responsable: UsuarioOrden | null;
  sala: UsuarioOrden | null;
  seguridad: UsuarioOrden[];
  gac: GacFila[];
  creador: UsuarioOrden | null;
  creadaAt: string | null;
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function obtenerFechaLocal() {
  const ahora = new Date();

  return `${ahora.getFullYear()}-${String(
    ahora.getMonth() + 1
  ).padStart(2, "0")}-${String(
    ahora.getDate()
  ).padStart(2, "0")}`;
}

/*
 * La tarjeta comienza mostrando SIEMPRE el día siguiente.
 */
function obtenerFechaManana() {
  const manana = new Date();

  manana.setDate(manana.getDate() + 1);

  return `${manana.getFullYear()}-${String(
    manana.getMonth() + 1
  ).padStart(2, "0")}-${String(
    manana.getDate()
  ).padStart(2, "0")}`;
}

function esPoliciaPracticas(
  nombre: string | null | undefined
) {
  if (!nombre) return false;

  const normalizado = nombre
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, " ");

  return (
    normalizado === "policia en practicas" ||
    normalizado === "policia ep" ||
    normalizado === "p practicas" ||
    normalizado === "ppracticas"
  );
}

function nombreCorto(nombre: string) {
  if (esPoliciaPracticas(nombre)) {
    return POLICIA_PRACTICAS_VISUAL;
  }

  const partes = nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length <= 1) {
    return nombre;
  }

  return `${partes[0]} ${partes
    .slice(1, 3)
    .map(
      (p) =>
        `${p.charAt(0).toUpperCase()}.`
    )
    .join("")}`;
}

function formatearFecha(fecha: string) {
  const [year, month, day] =
    fecha.split("-");

  if (!year || !month || !day) {
    return fecha;
  }

  return `${day}/${month}/${year}`;
}

function formatearFechaHora(
  fecha: string | null
) {
  if (!fecha) return "";

  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const dia = String(
    date.getDate()
  ).padStart(2, "0");

  const mes = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const year = date.getFullYear();

  const horas = String(
    date.getHours()
  ).padStart(2, "0");

  const minutos = String(
    date.getMinutes()
  ).padStart(2, "0");

  return `${dia}/${mes}/${year} · ${horas}:${minutos}`;
}

function normalizarIndicativo(
  indicativo: string | null | undefined
) {
  if (!indicativo) return "";

  return indicativo
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/-/g, "");
}

function numeroIndicativo(
  indicativo: string
) {
  const numero = Number(
    normalizarIndicativo(
      indicativo
    ).replace("Z", "")
  );

  return Number.isFinite(numero)
    ? numero
    : 9999;
}

/* -------------------------------------------------------------------------- */
/* AVATAR                                                                     */
/* -------------------------------------------------------------------------- */

function obtenerPathAvatar(
  avatarUrl: string | null | undefined
) {
  if (!avatarUrl) return null;

  const valor = avatarUrl.trim();

  if (!valor) return null;

  if (
    /^(https?:\/\/|data:|blob:)/i.test(
      valor
    )
  ) {
    return valor;
  }

  let path = valor;

  const prefijo =
    `${AVATAR_BUCKET}/`;

  if (path.startsWith(prefijo)) {
    path = path.slice(
      prefijo.length
    );
  }

  return path;
}

function Avatar({
  usuario,
  grande = false,
  onAmpliar,
}: {
  usuario: UsuarioOrden;
  grande?: boolean;
  onAmpliar?: (
    url: string
  ) => void;
}) {
  const [imagen, setImagen] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      const raw =
        usuario.avatar_url?.trim();

      if (!raw) {
        if (!cancelado) {
          setImagen(null);
        }

        return;
      }

      if (
        /^(https?:\/\/|data:|blob:)/i.test(
          raw
        )
      ) {
        if (!cancelado) {
          setImagen(raw);
        }

        return;
      }

      const path =
        obtenerPathAvatar(raw);

      if (!path) {
        if (!cancelado) {
          setImagen(null);
        }

        return;
      }

      const {
        data: publicData,
      } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(path);

      const publicUrl =
        publicData?.publicUrl ??
        null;

      if (publicUrl) {
        if (!cancelado) {
          setImagen(publicUrl);
        }

        return;
      }

      const {
        data: signedData,
      } = await supabase.storage
        .from(AVATAR_BUCKET)
        .createSignedUrl(
          path,
          3600
        );

      if (!cancelado) {
        setImagen(
          signedData?.signedUrl ??
            null
        );
      }
    }

    cargar();

    return () => {
      cancelado = true;
    };
  }, [usuario.avatar_url]);

  if (esPoliciaPracticas(usuario.nombre)) {
    const tamaño = grande
      ? "h-9 w-9"
      : "h-8 w-8";

    return (
      <button
        type="button"
        onClick={() =>
          onAmpliar?.("/avatars/practicas.jpg")
        }
        className={`${tamaño} shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm`}
        aria-label={`Ampliar foto de ${usuario.nombre}`}
      >
        <img
          src="/avatars/practicas.jpg"
          alt="Policía en Prácticas"
          className="h-full w-full object-cover transition hover:scale-105"
        />
      </button>
    );
  }

  const tamaño = grande
    ? "h-9 w-9"
    : "h-8 w-8";

  if (imagen) {
    return (
      <button
        type="button"
        onClick={() => {
          if (onAmpliar) {
            onAmpliar(imagen);
          }
        }}
        className={`${tamaño} shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-sm`}
        aria-label={`Ampliar foto de ${usuario.nombre}`}
      >
        <img
          src={imagen}
          alt={`Foto de ${usuario.nombre}`}
          className="h-full w-full object-cover transition hover:scale-105"
          onError={() =>
            setImagen(null)
          }
        />
      </button>
    );
  }

  return (
    <div
      className={`${tamaño} flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-500 shadow-sm`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-4 w-4"
      >
        <circle
          cx="12"
          cy="8"
          r="3.2"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.5 20a6.5 6.5 0 0 1 13 0"
        />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PERSONA                                                                    */
/* -------------------------------------------------------------------------- */

function Persona({
  usuario,
  grande = false,
  onAmpliar,
}: {
  usuario: UsuarioOrden;
  grande?: boolean;
  onAmpliar?: (
    url: string
  ) => void;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Avatar
        usuario={usuario}
        grande={grande}
        onAmpliar={onAmpliar}
      />

      <span className="min-w-0 truncate text-[12px] font-semibold leading-tight text-slate-700">
        {nombreCorto(
          usuario.nombre
        )}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ESTRELLA RESPONSABLE                                                       */
/* -------------------------------------------------------------------------- */

function EstrellaResponsable() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0 text-yellow-400"
      aria-hidden="true"
    >
      <path d="M12 2.2l2.86 5.8 6.4.93-4.63 4.52 1.09 6.38L12 16.82l-5.72 3.01 1.09-6.38-4.63-4.52 6.4-.93L12 2.2z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* ICONO CALENDARIO                                                           */
/* -------------------------------------------------------------------------- */

function IconoCalendario() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2.5"
      />

      <path
        strokeLinecap="round"
        d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* CREAR USUARIO                                                              */
/* -------------------------------------------------------------------------- */

function crearUsuarioVisual(
  usuarioId: string | null,
  nombre: string,
  usuariosMap: Map<
    string,
    UsuarioOrden
  >
): UsuarioOrden {
  if (usuarioId) {
    const usuario =
      usuariosMap.get(usuarioId);

    if (usuario) {
      return usuario;
    }
  }

  return {
    id:
      usuarioId ??
      `sin-usuario-${nombre}`,
    nombre,
    avatar_url: null,
  };
}

/* -------------------------------------------------------------------------- */
/* COMPONENTE                                                                 */
/* -------------------------------------------------------------------------- */

export default function TarjetaOrdenServicio() {
  const [fecha, setFecha] =
    useState(
      obtenerFechaManana
    );

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [orden, setOrden] =
    useState<OrdenVisual | null>(
      null
    );

  const [fotoAmpliada, setFotoAmpliada] =
    useState<string | null>(null);

  const [mostrarCalendario, setMostrarCalendario] =
    useState(false);

  /* ---------------------------------------------------------------------- */
  /* AÑADIDO: MENÚ EXPORTAR                                                */
  /* ---------------------------------------------------------------------- */

  const [menuExportar, setMenuExportar] =
    useState(false);

  useEffect(() => {
    let cancelado = false;

    async function cargarOrden() {
      setCargando(true);
      setError(null);

      try {
        const {
          data: ordenData,
          error: ordenError,
        } = await supabase
          .from(
            "ordenes_servicio"
          )
          .select(
            `
              id,
              fecha,
              creada_at,
              creada_por
            `
          )
          .eq(
            "fecha",
            fecha
          )
          .order(
            "creada_at",
            {
              ascending: false,
            }
          )
          .limit(1)
          .maybeSingle();

        if (ordenError) {
          throw ordenError;
        }

        if (!ordenData) {
          if (!cancelado) {
            setOrden(null);
          }

          return;
        }

        const {
          data: personalData,
          error: personalError,
        } = await supabase
          .from(
            "ordenes_servicio_personal"
          )
          .select(
            `
              id,
              orden_id,
              usuario_id,
              nombre,
              indicativo,
              funcion,
              orden
            `
          )
          .eq(
            "orden_id",
            ordenData.id
          )
          .order(
            "orden",
            {
              ascending: true,
              nullsFirst: false,
            }
          );

        if (personalError) {
          throw personalError;
        }

        const personal: PersonalOrden[] =
          personalData ?? [];

        const ids =
          Array.from(
            new Set(
              personal
                .map(
                  (persona) =>
                    persona.usuario_id
                )
                .filter(
                  (
                    id
                  ): id is string =>
                    Boolean(id)
                )
            )
          );

        if (
          ordenData.creada_por &&
          !ids.includes(
            ordenData.creada_por
          )
        ) {
          ids.push(
            ordenData.creada_por
          );
        }

        let usuarios: UsuarioOrden[] =
          [];

        if (ids.length > 0) {
          const {
            data: usuariosData,
            error: usuariosError,
          } = await supabase
            .from("usuarios")
            .select(
              `
                id,
                nombre,
                avatar_url
              `
            )
            .in(
              "id",
              ids
            );

          if (usuariosError) {
            throw usuariosError;
          }

          usuarios =
            usuariosData ?? [];
        }

        const usuariosMap =
          new Map<
            string,
            UsuarioOrden
          >();

        usuarios.forEach(
          (usuario) => {
            usuariosMap.set(
              usuario.id,
              usuario
            );
          }
        );

        /* ------------------------------------------------------------------ */
        /* RESPONSABLE                                                        */
        /* ------------------------------------------------------------------ */

        const responsableRow =
          personal.find(
            (persona) =>
              persona.funcion ===
              "responsable"
          );

        const responsable =
          responsableRow
            ? crearUsuarioVisual(
                responsableRow.usuario_id,
                responsableRow.nombre,
                usuariosMap
              )
            : null;

        /* ------------------------------------------------------------------ */
        /* SALA                                                               */
        /* ------------------------------------------------------------------ */

        const salaRow =
          personal.find(
            (persona) =>
              persona.funcion ===
              "sala"
          );

        const sala =
          salaRow
            ? crearUsuarioVisual(
                salaRow.usuario_id,
                salaRow.nombre,
                usuariosMap
              )
            : null;

        /* ------------------------------------------------------------------ */
        /* SEGURIDAD                                                          */
        /* ------------------------------------------------------------------ */

        const seguridad =
          personal
            .filter(
              (persona) =>
                persona.funcion ===
                "seguridad"
            )
            .map(
              (persona) =>
                crearUsuarioVisual(
                  persona.usuario_id,
                  persona.nombre,
                  usuariosMap
                )
            );

        /* ------------------------------------------------------------------ */
        /* GAC + PICO                                                         */
        /* ------------------------------------------------------------------ */

        const gacRows =
          personal.filter(
            (persona) =>
              persona.funcion ===
                "gac" ||
              persona.funcion ===
                "pico"
          );

        const gacMap =
          new Map<
            string,
            GacFila
          >();

        const picoPersonas: PersonalGac[] =
          [];

        gacRows.forEach(
          (persona) => {
            if (
              persona.funcion ===
              "pico"
            ) {
              if (
                !persona.nombre?.trim()
              ) {
                return;
              }

              picoPersonas.push({
                usuario:
                  crearUsuarioVisual(
                    persona.usuario_id,
                    persona.nombre,
                    usuariosMap
                  ),
                orden:
                  persona.orden,
              });

              return;
            }

            const indicativo =
              persona.indicativo?.trim();

            if (!indicativo) {
              return;
            }

            const clave =
              normalizarIndicativo(
                indicativo
              );

            if (
              !gacMap.has(clave)
            ) {
              gacMap.set(
                clave,
                {
                  indicativo,
                  orden:
                    persona.orden,
                  personal: [],
                }
              );
            }

            const fila =
              gacMap.get(
                clave
              )!;

            if (
              fila.orden ===
                null ||
              fila.orden ===
                undefined
            ) {
              fila.orden =
                persona.orden;
            }

            fila.personal.push({
              usuario:
                crearUsuarioVisual(
                  persona.usuario_id,
                  persona.nombre,
                  usuariosMap
                ),
              orden:
                persona.orden,
            });
          }
        );

        const picoRows: GacFila[] =
          picoPersonas
            .slice(0, 2)
            .map(
              (persona, index) => ({
                indicativo:
                  "PICO",
                orden:
                  persona.orden ===
                    1 ||
                  persona.orden ===
                    2
                    ? persona.orden
                    : index + 1,
                personal: [
                  persona,
                ],
              })
            )
            .sort(
              (a, b) =>
                (a.orden ?? 999) -
                (b.orden ?? 999)
            );

        const gacNormales =
          Array.from(
            gacMap.values()
          ).sort((a, b) => {
            return (
              numeroIndicativo(
                a.indicativo
              ) -
              numeroIndicativo(
                b.indicativo
              )
            );
          });

        const gac: GacFila[] = [
          ...gacNormales,
          ...picoRows,
        ];

        /* ------------------------------------------------------------------ */
        /* CREADOR                                                            */
        /* ------------------------------------------------------------------ */

        const creador =
          ordenData.creada_por
            ? usuariosMap.get(
                ordenData.creada_por
              ) ?? null
            : null;

        /* ------------------------------------------------------------------ */
        /* GUARDAR ORDEN VISUAL                                               */
        /* ------------------------------------------------------------------ */

        if (!cancelado) {
          setOrden({
            responsable,
            sala,
            seguridad,
            gac,
            creador,
            creadaAt:
              ordenData.creada_at,
          });
        }
      } catch (err) {
        console.error(
          "Error cargando orden:",
          err
        );

        if (!cancelado) {
          setError(
            "No se ha podido cargar la orden de servicio."
          );

          setOrden(null);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarOrden();

    return () => {
      cancelado = true;
    };
  }, [fecha]);

  /* ---------------------------------------------------------------------- */
  /* COPIAR ORDEN PARA WHATSAPP                                             */
  /* ---------------------------------------------------------------------- */

  const copiarOrden = async () => {
    if (!orden) return;

    const lineas: string[] = [];

    lineas.push("📋 ORDEN DE SERVICIO");
    lineas.push(
      `📅 ${formatearFecha(fecha)}`
    );

    lineas.push("");

    if (orden.responsable) {
      lineas.push(
        `⭐ Responsable: ${orden.responsable.nombre}`
      );

      lineas.push("");
    }

    lineas.push("🎧 SALA");

    if (orden.sala) {
      lineas.push(
        `• ${orden.sala.nombre}`
      );
    } else {
      lineas.push(
        "• Sin personal"
      );
    }

    lineas.push("");

    lineas.push("🛡️ SEGURIDAD");

    if (orden.seguridad.length) {
      orden.seguridad.forEach(
        (persona) => {
          lineas.push(
            `• ${persona.nombre}`
          );
        }
      );
    } else {
      lineas.push(
        "• Sin personal"
      );
    }

    if (orden.gac.length) {
      lineas.push("");
      lineas.push("🚔 GAC");

      orden.gac.forEach(
        (fila) => {
          lineas.push("");

          lineas.push(
            `${fila.indicativo}${
              fila.orden === 1
                ? " · Primeras"
                : fila.orden === 2
                  ? " · Segundas"
                  : ""
            }`
          );

          fila.personal.forEach(
            (persona) => {
              lineas.push(
                `• ${persona.usuario.nombre}`
              );
            }
          );
        }
      );
    }

    lineas.push("");

    lineas.push(
      `Creada por: ${
        orden.creador
          ? nombreCorto(
              orden.creador.nombre
            )
          : "—"
      }`
    );

    if (orden.creadaAt) {
      lineas.push(
        formatearFechaHora(
          orden.creadaAt
        )
      );
    }

    await navigator.clipboard.writeText(
      lineas.join("\n")
    );

    setMenuExportar(false);
  };

  /* ---------------------------------------------------------------------- */
  /* CARGANDO                                                               */
  /* ---------------------------------------------------------------------- */

  if (cargando) {
    return (
      <div className="mx-auto mt-4 w-full max-w-xl">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.06)]">
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-40 rounded-lg bg-slate-200" />
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-10 rounded-xl bg-slate-100" />
            <div className="h-36 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* ERROR REAL                                                             */
  /* ---------------------------------------------------------------------- */

  if (error) {
    return (
      <div className="mx-auto mt-4 w-full max-w-xl">
        <div className="rounded-[28px] border border-slate-300 bg-white p-5 text-center text-sm text-slate-700 shadow-[0_4px_18px_rgba(15,23,42,0.05)]">
          {error}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* VISTA                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      <div className="mx-auto mt-4 w-full max-w-xl">
        <div className="rounded-3xl border border-slate-200 bg-white px-4 pb-0 pt-4 shadow-sm">

          {/* CABECERA + CALENDARIO */}

          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5 shrink-0 text-slate-700"
              >
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  rx="3"
                />

                <path
                  strokeLinecap="round"
                  d="M8 8h8M8 12h5M8 16h3"
                />
              </svg>

              <span className="truncate text-[16px] font-bold tracking-tight text-slate-800">
                Orden de Servicio
              </span>
            </div>

<div className="relative flex shrink-0 items-center gap-1.5">
              {/* BOTÓN CALENDARIO */}

              <button
                type="button"
                onClick={() =>
                  setMostrarCalendario(
                    (valor) => !valor
                  )
                }
                className={`
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  bg-white
                  shadow-sm
                  transition
                  active:scale-95
                  ${
                    mostrarCalendario
                      ? "border-slate-500 bg-slate-100 text-slate-800"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }
                `}
                aria-label="Abrir calendario"
                aria-expanded={
                  mostrarCalendario
                }
              >
                <IconoCalendario />
              </button>
{mostrarCalendario && (
  <>
    <div
      className="fixed inset-0 z-40"
      onClick={() =>
        setMostrarCalendario(false)
      }
    />

<div className="absolute right-0 bottom-12 z-50 w-[320px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">      <CalendarioOrdenServicio
        onSeleccionarFecha={(nuevaFecha) => {
          setFecha(nuevaFecha);
          setMostrarCalendario(false);
        }}
      />
    </div>
  </>
)}
              {/* TRES PUNTOS */}

              {orden ? (
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setMenuExportar(
                        (valor) => !valor
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-xl font-bold text-slate-600 shadow-sm transition hover:bg-slate-50"
                    aria-label="Opciones de exportación"
                  >
                    ⋮
                  </button>

                  {menuExportar ? (
                    <div className="absolute right-0 top-12 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                      <button
                        type="button"
                        onClick={copiarOrden}
                        className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Copiar orden
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>



          {/* SIN ORDEN */}

          {!orden ? (
            <div className="px-1 pb-4 pt-5">
              <p className="text-sm text-slate-600">
                No se ha creado ninguna orden para{" "}
                <span className="font-bold text-slate-800">
                  {formatearFecha(fecha)}
                </span>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="mt-4 space-y-3.5">

                {/* RESPONSABLE */}

                <div className="flex items-center justify-center py-1">
                  {orden.responsable ? (
                    <div className="flex items-center gap-2">
                      <EstrellaResponsable />

                      <span className="text-[13px] font-bold text-slate-800">
                        {orden.responsable.nombre}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Sin responsable
                    </span>
                  )}
                </div>

                {/* SEGURIDAD */}

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div className="px-3.5 pb-2.5 pt-3">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700">
                      Seguridad
                    </div>

                    <div className="flex w-full items-center justify-between gap-3">
                      {orden.seguridad.length ? (
                        orden.seguridad.map(
                          (
                            usuario,
                            index
                          ) => (
                            <div
                              key={`${usuario.id}-${index}`}
                              className="flex min-w-0 flex-1 items-center gap-1.5"
                            >
                              <Avatar
                                usuario={
                                  usuario
                                }
                                onAmpliar={
                                  setFotoAmpliada
                                }
                              />

                              <span className="min-w-0 truncate text-[10px] font-semibold leading-tight text-slate-700">
                                {nombreCorto(
                                  usuario.nombre
                                )}
                              </span>
                            </div>
                          )
                        )
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          Sin personal
                        </span>
                      )}
                    </div>
                  </div>
                </section>

                {/* GAC + PICO */}

                {orden.gac.length ? (
                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="px-2.5 pb-0 pt-3 sm:px-3.5">
                      <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700">
                        GAC
                      </div>

                      <div className="w-full">
                        {orden.gac.map(
                          (
                            fila,
                            index
                          ) => {
                            const esPrimero =
                              fila.orden ===
                              1;

                            const esSegundo =
                              fila.orden ===
                              2;

                            const normales =
                              fila.personal.filter(
                                (persona) =>
                                  !esPoliciaPracticas(
                                    persona.usuario.nombre
                                  )
                              );

                            const practicas =
                              fila.personal.filter(
                                (persona) =>
                                  esPoliciaPracticas(
                                    persona.usuario.nombre
                                  )
                              );

                            const izquierda =
                              normales[0] ??
                              null;

                            const derecha =
                              practicas[0] ??
                              normales[1] ??
                              null;

                            return (
                              <div
                                key={`${fila.indicativo}-${fila.orden}-${index}`}
                                className={`grid min-h-[58px] grid-cols-[54px_minmax(0,1fr)_minmax(0,1fr)_22px] items-center gap-2 ${
                                  index > 0
                                    ? "border-t border-slate-200"
                                    : ""
                                }`}
                              >
                                {/* INDICATIVO */}

                                <span className="flex h-7 min-w-0 items-center justify-center rounded-full bg-slate-700 px-2 text-[9px] font-bold tracking-wide text-white shadow-sm">
                                  {fila.indicativo}
                                </span>

                                {/* PERSONA 1 */}

                                <div className="min-w-0">
                                  {izquierda ? (
                                    <div className="flex min-w-0 items-center gap-1.5">
                                      <Avatar
                                        usuario={
                                          izquierda.usuario
                                        }
                                        onAmpliar={
                                          setFotoAmpliada
                                        }
                                      />

                                      <span className="min-w-0 truncate text-[10px] font-semibold leading-tight text-slate-700">
                                        {nombreCorto(
                                          izquierda.usuario.nombre
                                        )}
                                      </span>
                                    </div>
                                  ) : null}
                                </div>

                                {/* PERSONA 2 */}

                                <div className="min-w-0">
                                  {derecha ? (
                                    <div className="flex min-w-0 items-center gap-1.5">
                                      <Avatar
                                        usuario={
                                          derecha.usuario
                                        }
                                        onAmpliar={
                                          setFotoAmpliada
                                        }
                                      />

                                      <span className="min-w-0 truncate text-[10px] font-semibold leading-tight text-slate-700">
                                        {nombreCorto(
                                          derecha.usuario.nombre
                                        )}
                                      </span>
                                    </div>
                                  ) : null}
                                </div>

                                {/* 1 / 2 */}

                                <div className="flex justify-end">
                                  {esPrimero ||
                                  esSegundo ? (
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700 ring-1 ring-slate-200">
                                      {esPrimero
                                        ? "1"
                                        : "2"}
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </section>
                ) : null}
              </div>

              {/* SALA */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="px-3.5 pb-2.5 pt-3">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700">
                    Sala
                  </div>

                  <div className="flex items-center justify-center">
                    {orden.sala ? (
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Avatar
                          usuario={
                            orden.sala
                          }
                          onAmpliar={
                            setFotoAmpliada
                          }
                        />

                        <span className="min-w-0 truncate text-[10px] font-semibold leading-tight text-slate-700">
                          {nombreCorto(
                            orden.sala.nombre
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500">
                        Sin personal
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* FOOTER */}

              <div className="px-4 pb-2 pt-1 text-center">
                <span className="text-[10px] leading-none text-slate-500">
                  Creada por{" "}

                  <span className="font-medium text-slate-600">
                    {orden.creador
                      ? nombreCorto(
                          orden.creador.nombre
                        )
                      : "—"}
                  </span>

                  {orden.creadaAt
                    ? ` · ${formatearFechaHora(
                        orden.creadaAt
                      )}`
                    : ""}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FOTO AMPLIADA */}

      {fotoAmpliada && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() =>
            setFotoAmpliada(null)
          }
        >
          <div
            className="relative flex max-h-[90vh] max-w-[95vw] items-center justify-center"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <img
              src={fotoAmpliada}
              alt="Foto ampliada"
              className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={() =>
                setFotoAmpliada(null)
              }
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white shadow-lg transition hover:bg-black/80 active:scale-95"
              aria-label="Cerrar foto"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}