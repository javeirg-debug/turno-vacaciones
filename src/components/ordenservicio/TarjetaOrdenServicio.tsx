
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

  if (partes.length <= 1) return nombre;

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

  if (
    esPoliciaPracticas(
      usuario.nombre
    )
  ) {
    return (
      <div
        className={
          grande
            ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-500 shadow-sm"
            : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-500 shadow-sm"
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-4 w-4"
        >
          <circle
            cx="11"
            cy="8"
            r="3"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.5 20a6.5 6.5 0 0 1 13 0"
          />

          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 11a2.5 2.5 0 1 0-1.5-4.5"
          />
        </svg>
      </div>
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
/* ESTRELLA                                                                   */
/* -------------------------------------------------------------------------- */

function EstrellaResponsable() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0 text-slate-700"
    >
      <path d="M12 2.5l2.82 5.72 6.31.92-4.57 4.46 1.08 6.29L12 16.92l-5.64 2.97 1.08-6.29-4.57-4.46 6.31-.92L12 2.5z" />
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

        /*
         * GAC + PICO
         *
         * PICO se integra como un indicativo más.
         * Solo se añade si existe realmente una persona
         * definida para PICO.
         */
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

        gacRows.forEach(
          (persona) => {
            /*
             * Si es PICO y no hay nombre/persona,
             * no se muestra.
             */
            if (
              persona.funcion ===
                "pico" &&
              !persona.nombre?.trim()
            ) {
              return;
            }

            /*
             * PICO puede no tener indicativo en la base.
             * En ese caso se muestra visualmente como PICO.
             */
            const indicativo =
              persona.funcion ===
              "pico"
                ? "PICO"
                : persona.indicativo?.trim();

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
              fila.orden === null ||
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

        const gac =
          Array.from(
            gacMap.values()
          ).sort((a, b) => {
            /*
             * PICO siempre queda después
             * de los indicativos numéricos.
             */
            if (
              a.indicativo === "PICO"
            ) {
              return 1;
            }

            if (
              b.indicativo === "PICO"
            ) {
              return -1;
            }

            return (
              numeroIndicativo(
                a.indicativo
              ) -
              numeroIndicativo(
                b.indicativo
              )
            );
          });

        const creador =
          ordenData.creada_por
            ? usuariosMap.get(
                ordenData.creada_por
              ) ?? null
            : null;

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
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.07)]">

          {/* CABECERA + CALENDARIO */}

          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
            <div className="min-w-0">
              {!orden ? (
                <span className="block truncate text-base font-semibold text-slate-700">
                  No hay orden de servicio del{" "}
                  <span className="font-bold text-slate-900">
                    {formatearFecha(
                      fecha
                    )}
                  </span>
                </span>
              ) : (
                <span className="block text-[17px] font-bold tracking-tight text-slate-800">
                  Orden de Servicio
                </span>
              )}
            </div>

            <div className="relative shrink-0">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-600">
                <IconoCalendario />
              </div>

              <input
                type="date"
                value={fecha}
                onChange={(e) =>
                  setFecha(
                    e.target.value
                  )
                }
                className="h-10 w-[142px] cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-[11px] font-semibold text-slate-700 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />

              <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-slate-600">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-3.5 w-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.5 7.5 10 12l4.5-4.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {!orden ? null : (
            <>
              <div className="space-y-3.5 px-3.5 py-4 sm:px-5">

                {/* RESPONSABLE */}

                <div className="flex items-center justify-center py-1">
                  {orden.responsable ? (
                    <div className="flex items-center gap-2">
                      <EstrellaResponsable />

                      <div className="flex flex-col leading-tight">
                        <span className="text-[13px] font-bold text-slate-800">
                          {
                            orden
                              .responsable
                              .nombre
                          }
                        </span>

                        <span className="mt-0.5 text-[10px] font-medium text-slate-500">
                          Responsable principal
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Sin responsable
                    </span>
                  )}
                </div>

               {/* SALA */}

<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
  <div className="px-3.5 py-3.5">
    <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700">
      Sala
    </div>

    <div className="flex min-h-[40px] items-center">
      {orden.sala ? (
        <div className="flex min-w-0 items-center gap-1.5">
          <Avatar
            usuario={orden.sala}
            onAmpliar={setFotoAmpliada}
          />

          <span className="min-w-0 truncate text-[10px] font-semibold leading-tight text-slate-700">
            {nombreCorto(orden.sala.nombre)}
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

{/* SEGURIDAD */}

<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
  <div className="px-3.5 py-3.5">
    <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700">
      Seguridad
    </div>

    <div className="flex min-h-[40px] w-full items-center justify-between gap-3">
      {orden.seguridad.length ? (
        orden.seguridad.map(
          (usuario, index) => (
            <div
              key={`${usuario.id}-${index}`}
              className="flex min-w-0 flex-1 items-center gap-1.5"
            >
              <Avatar
                usuario={usuario}
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
                    <div className="px-2.5 py-3 sm:px-3.5">
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
                                (
                                  persona
                                ) =>
                                  !esPoliciaPracticas(
                                    persona
                                      .usuario
                                      .nombre
                                  )
                              );

                            const practicas =
                              fila.personal.filter(
                                (
                                  persona
                                ) =>
                                  esPoliciaPracticas(
                                    persona
                                      .usuario
                                      .nombre
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
                                key={`${fila.indicativo}-${index}`}
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
                                          izquierda
                                            .usuario
                                            .nombre
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
                                          derecha
                                            .usuario
                                            .nombre
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

              {/* FOOTER */}

              <div className="border-t border-slate-200 px-4 py-3 text-center">
                <span className="text-[10px] leading-none text-slate-500">
                  Creada por{" "}
                  <span className="font-medium text-slate-600">
                    {orden.creador
                      ? nombreCorto(
                          orden
                            .creador
                            .nombre
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