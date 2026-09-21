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
  pico: UsuarioOrden | null;
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
  ).padStart(2, "0")}-${String(ahora.getDate()).padStart(
    2,
    "0"
  )}`;
}

/*
 * La tarjeta comienza mostrando SIEMPRE el día siguiente.
 */
function obtenerFechaManana() {
  const manana = new Date();

  manana.setDate(manana.getDate() + 1);

  return `${manana.getFullYear()}-${String(
    manana.getMonth() + 1
  ).padStart(2, "0")}-${String(manana.getDate()).padStart(
    2,
    "0"
  )}`;
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
  const [year, month, day] = fecha.split("-");

  if (!year || !month || !day) return fecha;

  return `${day}/${month}/${year}`;
}

function formatearFechaHora(
  fecha: string | null
) {
  if (!fecha) return "";

  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) return "";

  const dia = String(date.getDate()).padStart(
    2,
    "0"
  );

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

function obtenerAvatarUrl(
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

  const prefijo = `${AVATAR_BUCKET}/`;

  if (path.startsWith(prefijo)) {
    path = path.slice(prefijo.length);
  }

  const { data } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl || null;
}

/* -------------------------------------------------------------------------- */
/* AVATAR                                                                     */
/* -------------------------------------------------------------------------- */

function Avatar({
  usuario,
  grande = false,
  onAmpliar,
}: {
  usuario: UsuarioOrden;
  grande?: boolean;
  onAmpliar?: (url: string) => void;
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

      let path = raw;

      const prefijo = `${AVATAR_BUCKET}/`;

      if (path.startsWith(prefijo)) {
        path = path.slice(
          prefijo.length
        );
      }

      const publicUrl =
        obtenerAvatarUrl(raw);

      if (publicUrl) {
        if (!cancelado) {
          setImagen(publicUrl);
        }

        return;
      }

      const { data } =
        await supabase.storage
          .from(AVATAR_BUCKET)
          .createSignedUrl(
            path,
            3600
          );

      if (!cancelado) {
        setImagen(
          data?.signedUrl ?? null
        );
      }
    }

    cargar();

    return () => {
      cancelado = true;
    };
  }, [usuario.avatar_url]);

  /*
   * Policía en Prácticas.
   *
   * De momento mantiene el icono genérico.
   * Cuando tengas la imagen fija, se cambia aquí.
   */
  if (
    esPoliciaPracticas(
      usuario.nombre
    )
  ) {
    return (
      <div
        className={
          grande
            ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500"
            : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500"
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-3.5 w-3.5"
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
    ? "h-7 w-7"
    : "h-6 w-6";

  if (imagen) {
    return (
      <button
        type="button"
        onClick={() => {
          if (onAmpliar) {
            onAmpliar(imagen);
          }
        }}
        className={`${tamaño} shrink-0 cursor-pointer overflow-hidden rounded-full border border-slate-200 bg-slate-100`}
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
      className={`${tamaño} flex shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-400`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-3.5 w-3.5"
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
  onAmpliar?: (url: string) => void;
}) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-1">
      <Avatar
        usuario={usuario}
        grande={grande}
        onAmpliar={onAmpliar}
      />

      <span className="max-w-[95px] truncate text-[10px] font-medium leading-none text-slate-700">
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
      className="h-3.5 w-3.5 shrink-0 text-amber-500"
    >
      <path d="M12 2.5l2.82 5.72 6.31.92-4.57 4.46 1.08 6.29L12 16.92l-5.64 2.97 1.08-6.29-4.57-4.46 6.31-.92L12 2.5z" />
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
  const [fecha, setFecha] = useState(
    obtenerFechaManana
  );

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [orden, setOrden] =
    useState<OrdenVisual | null>(null);

  /*
   * URL de la fotografía que se está
   * mostrando ampliada.
   */
  const [fotoAmpliada, setFotoAmpliada] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarOrden() {
      setCargando(true);
      setError(null);

      try {
        /* ---------------------------------------------------------------- */
        /* ORDEN                                                             */
        /* ---------------------------------------------------------------- */

        const {
          data: ordenData,
          error: ordenError,
        } = await supabase
          .from("ordenes_servicio")
          .select(
            `
              id,
              fecha,
              creada_at,
              creada_por
            `
          )
          .eq("fecha", fecha)
          .order("creada_at", {
            ascending: false,
          })
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

        /* ---------------------------------------------------------------- */
        /* PERSONAL                                                          */
        /* ---------------------------------------------------------------- */

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
          .order("orden", {
            ascending: true,
            nullsFirst: false,
          });

        if (personalError) {
          throw personalError;
        }

        const personal: PersonalOrden[] =
          personalData ?? [];

        /* ---------------------------------------------------------------- */
        /* USUARIOS                                                          */
        /* ---------------------------------------------------------------- */

        const ids = Array.from(
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
            .in("id", ids);

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

        /* ---------------------------------------------------------------- */
        /* RESPONSABLE                                                       */
        /* ---------------------------------------------------------------- */

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

        /* ---------------------------------------------------------------- */
        /* SALA                                                              */
        /* ---------------------------------------------------------------- */

        const salaRow =
          personal.find(
            (persona) =>
              persona.funcion ===
              "sala"
          );

        const sala = salaRow
          ? crearUsuarioVisual(
              salaRow.usuario_id,
              salaRow.nombre,
              usuariosMap
            )
          : null;

        /* ---------------------------------------------------------------- */
        /* SEGURIDAD                                                         */
        /* ---------------------------------------------------------------- */

        const seguridad =
          personal
            .filter(
              (persona) =>
                persona.funcion ===
                "seguridad"
            )
            .map((persona) =>
              crearUsuarioVisual(
                persona.usuario_id,
                persona.nombre,
                usuariosMap
              )
            );

        /* ---------------------------------------------------------------- */
        /* PICO                                                              */
        /* ---------------------------------------------------------------- */

        const picoRow =
          personal.find(
            (persona) =>
              persona.funcion ===
              "pico"
          );

        const pico = picoRow
          ? crearUsuarioVisual(
              picoRow.usuario_id,
              picoRow.nombre,
              usuariosMap
            )
          : null;

        /* ---------------------------------------------------------------- */
        /* GAC                                                               */
        /* ---------------------------------------------------------------- */

        const gacRows =
          personal.filter(
            (persona) =>
              persona.funcion ===
              "gac"
          );

        const gacMap =
          new Map<
            string,
            GacFila
          >();

        gacRows.forEach(
          (persona) => {
            if (!persona.indicativo)
              return;

            const clave =
              normalizarIndicativo(
                persona.indicativo
              );

            if (!gacMap.has(clave)) {
              gacMap.set(clave, {
                indicativo:
                  persona.indicativo.trim(),
                orden: persona.orden,
                personal: [],
              });
            }

            const fila =
              gacMap.get(clave)!;

            if (
              fila.orden === null ||
              fila.orden === undefined
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

        const gac = Array.from(
          gacMap.values()
        ).sort(
          (a, b) =>
            numeroIndicativo(
              a.indicativo
            ) -
            numeroIndicativo(
              b.indicativo
            )
        );

        /* ---------------------------------------------------------------- */
        /* CREADOR                                                           */
        /* ---------------------------------------------------------------- */

        const creador =
          ordenData.creada_por
            ? usuariosMap.get(
                ordenData.creada_por
              ) ?? null
            : null;

        /* ---------------------------------------------------------------- */
        /* RESULTADO                                                         */
        /* ---------------------------------------------------------------- */

        if (!cancelado) {
          setOrden({
            responsable,
            sala,
            seguridad,
            pico,
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
      <div className="mx-auto w-full max-w-xl p-2">
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-7 rounded bg-slate-100" />
            <div className="h-7 rounded bg-slate-100" />
            <div className="h-28 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* ERROR REAL                                                              */
  /* ---------------------------------------------------------------------- */

  if (error) {
    return (
      <div className="mx-auto w-full max-w-xl p-2">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-xs text-red-700">
          {error}
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* VISTA                                                                   */
  /* ---------------------------------------------------------------------- */

  return (
    <>
      <div className="mx-auto w-full max-w-xl p-2">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">

          {/* ================================================================ */}
          {/* CABECERA + CALENDARIO                                             */}
          {/* ================================================================ */}

          <div className="relative border-b border-slate-100 px-3 py-1.5">

            {!orden ? (
              <div className="flex min-h-[25px] items-center pr-28">
                <span className="truncate text-[10px] text-slate-500">
                  No hay orden de servicio creada para el día{" "}
                  <span className="font-semibold text-slate-700">
                    {formatearFecha(fecha)}
                  </span>
                </span>
              </div>
            ) : (
              <div className="flex min-h-[25px] items-center">
                <span className="text-[11px] font-semibold text-slate-700">
                  Orden de Servicio
                </span>
              </div>
            )}

            {/* CALENDARIO ARRIBA DERECHA */}

            <div className="absolute right-2 top-1.5">
              <input
                type="date"
                value={fecha}
                onChange={(e) =>
                  setFecha(
                    e.target.value
                  )
                }
                className="h-6 rounded border border-slate-200 bg-white px-1.5 text-[10px] text-slate-600 outline-none"
              />
            </div>
          </div>

          {/* ================================================================ */}
          {/* SIN ORDEN                                                         */}
          {/* ================================================================ */}

          {!orden ? null : (
            <>
              <div className="px-2.5 py-1.5">

                {/* RESPONSABLE */}

                <div className="flex h-6 items-center justify-center">
                  {orden.responsable ? (
                    <div className="flex items-center justify-center gap-1">
                      <EstrellaResponsable />

                      <span className="text-[11px] font-bold leading-none text-slate-800">
                        {orden.responsable.nombre}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[9px] text-slate-400">
                      Sin responsable
                    </span>
                  )}
                </div>

                {/* SALA */}

                <section className="mb-2">
                  <div className="mb-0.5 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Sala
                  </div>

                  <div className="flex h-7 items-center justify-center">
                    {orden.sala ? (
                      <Persona
                        usuario={
                          orden.sala
                        }
                        grande
                        onAmpliar={
                          setFotoAmpliada
                        }
                      />
                    ) : (
                      <span className="text-[9px] text-slate-400">
                        Sin personal
                      </span>
                    )}
                  </div>
                </section>

                {/* SEGURIDAD */}

                <section className="mb-2">
                  <div className="mb-0.5 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Seguridad
                  </div>

                  <div className="flex h-7 items-center justify-center gap-4">
                    {orden.seguridad.length ? (
                      orden.seguridad.map(
                        (
                          usuario,
                          index
                        ) => (
                          <Persona
                            key={`${usuario.id}-${index}`}
                            usuario={
                              usuario
                            }
                            grande
                            onAmpliar={
                              setFotoAmpliada
                            }
                          />
                        )
                      )
                    ) : (
                      <span className="text-[9px] text-slate-400">
                        Sin personal
                      </span>
                    )}
                  </div>
                </section>

                {/* GAC */}

                {orden.gac.length ? (
                  <section className="mb-2">
                    <div className="mb-0.5 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
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
                                  persona
                                    .usuario
                                    .nombre
                                )
                            );

                          const practicas =
                            fila.personal.filter(
                              (persona) =>
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
                              className="flex h-8 items-center justify-center"
                            >

                              {/* ORDEN */}

                              <span
                                className={[
                                  "mr-1 flex h-4 min-w-[18px] items-center justify-center rounded px-1 text-[8px] font-bold",
                                  esPrimero
                                    ? "bg-blue-100 text-blue-700"
                                    : esSegundo
                                      ? "bg-slate-600 text-white"
                                      : "bg-slate-200 text-slate-600",
                                ].join(
                                  " "
                                )}
                              >
                                {esPrimero
                                  ? "1º"
                                  : esSegundo
                                    ? "2º"
                                    : ""}
                              </span>

                              {/* INDICATIVO */}

                              <span className="mr-2 w-[39px] shrink-0 text-[9px] font-bold text-slate-700">
                                {
                                  fila.indicativo
                                }
                              </span>

                              {/* AGENTE IZQUIERDO */}

                              <div className="flex min-w-[105px] items-center justify-end gap-1">
                                {izquierda ? (
                                  <>
                                    <span className="max-w-[76px] truncate text-right text-[9px] font-medium leading-none text-slate-700">
                                      {nombreCorto(
                                        izquierda
                                          .usuario
                                          .nombre
                                      )}
                                    </span>

                                    <Avatar
                                      usuario={
                                        izquierda.usuario
                                      }
                                      onAmpliar={
                                        setFotoAmpliada
                                      }
                                    />
                                  </>
                                ) : null}
                              </div>

                              {/* ESPACIO CENTRAL */}

                              <div className="w-2 shrink-0" />

                              {/* AGENTE DERECHO */}

                              <div className="flex min-w-[105px] items-center justify-start gap-1">
                                {derecha ? (
                                  <>
                                    <Avatar
                                      usuario={
                                        derecha.usuario
                                      }
                                      onAmpliar={
                                        setFotoAmpliada
                                      }
                                    />

                                    <span className="max-w-[76px] truncate text-left text-[9px] font-medium leading-none text-slate-700">
                                      {nombreCorto(
                                        derecha
                                          .usuario
                                          .nombre
                                      )}
                                    </span>
                                  </>
                                ) : null}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </section>
                ) : null}

                {/* PICO */}

                {orden.pico ? (
                  <section>
                    <div className="mb-0.5 text-center text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      PICO
                    </div>

                    <div className="flex h-7 items-center justify-center">
                      <Persona
                        usuario={
                          orden.pico
                        }
                        grande
                        onAmpliar={
                          setFotoAmpliada
                        }
                      />
                    </div>
                  </section>
                ) : null}
              </div>

              {/* ============================================================ */}
              {/* FOOTER                                                       */}
              {/* ============================================================ */}

              <div className="border-t border-slate-100 px-2 py-1 text-center">
                <span className="text-[8px] leading-none text-slate-400">
                  Creada por{" "}
                  <span className="font-medium text-slate-500">
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

      {/* ================================================================ */}
      {/* FOTO AMPLIADA                                                     */}
      {/* ================================================================ */}

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
              className="
                absolute
                right-2
                top-2
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-black/60
                text-2xl
                text-white
                shadow-lg
                transition
                hover:bg-black/80
                active:scale-95
              "
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