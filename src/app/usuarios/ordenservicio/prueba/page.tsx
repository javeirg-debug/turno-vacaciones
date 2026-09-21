"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AVATAR_BUCKET = "avatars";

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

const POLICIA_PRACTICAS = "Policía en Prácticas";

function obtenerFechaLocal() {
  const ahora = new Date();

  const year = ahora.getFullYear();
  const month = String(ahora.getMonth() + 1).padStart(2, "0");
  const day = String(ahora.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function nombreCorto(nombre: string) {
  const partes = nombre
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length <= 1) {
    return nombre;
  }

  const nombrePrincipal = partes[0];

  const iniciales = partes
    .slice(1, 3)
    .map((parte) => `${parte.charAt(0).toUpperCase()}.`)
    .join("");

  return `${nombrePrincipal} ${iniciales}`;
}

function formatearFecha(fecha: string) {
  const [year, month, day] = fecha.split("-");

  if (!year || !month || !day) {
    return fecha;
  }

  return `${day}/${month}/${year}`;
}

function formatearFechaHora(fecha: string | null) {
  if (!fecha) {
    return "";
  }

  const date = new Date(fecha);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const horas = String(date.getHours()).padStart(2, "0");
  const minutos = String(date.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${year} · ${horas}:${minutos}`;
}

function normalizarIndicativo(indicativo: string | null | undefined) {
  if (!indicativo) {
    return "";
  }

  return indicativo
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace("-", "");
}

function numeroIndicativo(indicativo: string) {
  const normalizado = normalizarIndicativo(indicativo);

  const numero = Number(normalizado.replace("Z", ""));

  return Number.isFinite(numero) ? numero : 9999;
}

function obtenerAvatarUrl(avatarUrl: string | null | undefined) {
  if (!avatarUrl) {
    return null;
  }

  const valor = avatarUrl.trim();

  if (!valor) {
    return null;
  }

  // URL completa
  if (/^(https?:\/\/|data:|blob:)/i.test(valor)) {
    return valor;
  }

  let path = valor;

  // Permite guardar:
  // avatars/foto.jpg
  // foto.jpg
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
  size = "sm",
}: {
  usuario: UsuarioOrden;
  size?: "xs" | "sm";
}) {
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarAvatar() {
      const raw = usuario.avatar_url?.trim();

      if (!raw) {
        if (!cancelado) {
          setImagenUrl(null);
        }
        return;
      }

      // Si ya es una URL completa
      if (/^(https?:\/\/|data:|blob:)/i.test(raw)) {
        if (!cancelado) {
          setImagenUrl(raw);
        }
        return;
      }

      let path = raw;

      const prefijo = `${AVATAR_BUCKET}/`;

      if (path.startsWith(prefijo)) {
        path = path.slice(prefijo.length);
      }

      // Primero intentamos URL pública
      const publicUrl = obtenerAvatarUrl(raw);

      if (publicUrl) {
        if (!cancelado) {
          setImagenUrl(publicUrl);
        }
        return;
      }

      // Fallback para buckets privados
      const { data } = await supabase.storage
        .from(AVATAR_BUCKET)
        .createSignedUrl(path, 60 * 60);

      if (!cancelado) {
        setImagenUrl(data?.signedUrl ?? null);
      }
    }

    cargarAvatar();

    return () => {
      cancelado = true;
    };
  }, [usuario.avatar_url]);

  /*
   * Preparado para el futuro icono personalizado de
   * Policía en Prácticas.
   */
  if (usuario.nombre === POLICIA_PRACTICAS) {
    return (
      <div
        className={
          size === "xs"
            ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-600"
            : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-600"
        }
        title={POLICIA_PRACTICAS}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19a4 4 0 0 0-8 0"
          />
          <circle cx="11" cy="8" r="3" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 11a2.5 2.5 0 1 0-1.5-4.5"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 19a3.5 3.5 0 0 0-1.5-3"
          />
        </svg>
      </div>
    );
  }

  const tamaño =
    size === "xs"
      ? "h-7 w-7"
      : "h-8 w-8";

  if (imagenUrl) {
    return (
      <div
        className={`${tamaño} shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100`}
      >
        <img
          src={imagenUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImagenUrl(null)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${tamaño} shrink-0 flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-400`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="3.2" />
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
  avatarSize = "xs",
}: {
  usuario: UsuarioOrden;
  avatarSize?: "xs" | "sm";
}) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Avatar usuario={usuario} size={avatarSize} />

      <span className="truncate text-[12px] font-medium leading-none text-slate-700">
        {nombreCorto(usuario.nombre)}
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
      className="h-4 w-4 shrink-0 text-amber-500"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.82 5.72 6.31.92-4.57 4.46 1.08 6.29L12 16.92l-5.64 2.97 1.08-6.29-4.57-4.46 6.31-.92L12 2.5z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* TITULO SECCION                                                             */
/* -------------------------------------------------------------------------- */

function TituloSeccion({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1.5 flex items-center">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
        {children}
      </h2>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* USUARIO VISUAL                                                             */
/* -------------------------------------------------------------------------- */

function crearUsuarioVisual(
  usuarioId: string | null,
  nombre: string,
  usuariosMap: Map<string, UsuarioOrden>
): UsuarioOrden {
  if (usuarioId) {
    const usuario = usuariosMap.get(usuarioId);

    if (usuario) {
      return usuario;
    }
  }

  return {
    id: usuarioId ?? `sin-usuario-${nombre}`,
    nombre,
    avatar_url: null,
  };
}

/* -------------------------------------------------------------------------- */
/* COMPONENTE PRINCIPAL                                                       */
/* -------------------------------------------------------------------------- */

export default function TarjetaOrdenServicio() {
  const [fecha, setFecha] = useState(obtenerFechaLocal);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orden, setOrden] = useState<OrdenVisual | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function cargarOrden() {
      setCargando(true);
      setError(null);

      try {
        /* ------------------------------------------------------------------ */
        /* ORDEN                                                               */
        /* ------------------------------------------------------------------ */

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

        /* ------------------------------------------------------------------ */
        /* PERSONAL                                                             */
        /* ------------------------------------------------------------------ */

        const {
          data: personalData,
          error: personalError,
        } = await supabase
          .from("ordenes_servicio_personal")
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
          .eq("orden_id", ordenData.id)
          .order("orden", {
            ascending: true,
            nullsFirst: false,
          });

        if (personalError) {
          throw personalError;
        }

        const personal: PersonalOrden[] =
          personalData ?? [];

        /* ------------------------------------------------------------------ */
        /* USUARIOS                                                             */
        /* ------------------------------------------------------------------ */

        const ids = Array.from(
          new Set(
            personal
              .map((persona) => persona.usuario_id)
              .filter(
                (id): id is string => Boolean(id)
              )
          )
        );

        if (
          ordenData.creada_por &&
          !ids.includes(ordenData.creada_por)
        ) {
          ids.push(ordenData.creada_por);
        }

        let usuarios: UsuarioOrden[] = [];

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

          usuarios = usuariosData ?? [];
        }

        const usuariosMap = new Map<string, UsuarioOrden>();

        usuarios.forEach((usuario) => {
          usuariosMap.set(usuario.id, usuario);
        });

        /* ------------------------------------------------------------------ */
        /* RESPONSABLE                                                         */
        /* ------------------------------------------------------------------ */

        const responsableRow = personal.find(
          (persona) => persona.funcion === "responsable"
        );

        const responsable = responsableRow
          ? crearUsuarioVisual(
              responsableRow.usuario_id,
              responsableRow.nombre,
              usuariosMap
            )
          : null;

        /* ------------------------------------------------------------------ */
        /* SALA                                                                */
        /* ------------------------------------------------------------------ */

        const salaRow = personal.find(
          (persona) => persona.funcion === "sala"
        );

        const sala = salaRow
          ? crearUsuarioVisual(
              salaRow.usuario_id,
              salaRow.nombre,
              usuariosMap
            )
          : null;

        /* ------------------------------------------------------------------ */
        /* SEGURIDAD                                                           */
        /* ------------------------------------------------------------------ */

        const seguridadRows = personal.filter(
          (persona) => persona.funcion === "seguridad"
        );

        const seguridad = seguridadRows.map((persona) =>
          crearUsuarioVisual(
            persona.usuario_id,
            persona.nombre,
            usuariosMap
          )
        );

        /* ------------------------------------------------------------------ */
        /* PICO                                                                */
        /* ------------------------------------------------------------------ */

        const picoRow = personal.find(
          (persona) => persona.funcion === "pico"
        );

        const pico = picoRow
          ? crearUsuarioVisual(
              picoRow.usuario_id,
              picoRow.nombre,
              usuariosMap
            )
          : null;

        /* ------------------------------------------------------------------ */
        /* GAC                                                                 */
        /* ------------------------------------------------------------------ */

        const gacRows = personal.filter(
          (persona) => persona.funcion === "gac"
        );

        const gacMap = new Map<string, GacFila>();

        gacRows.forEach((persona) => {
          const indicativo = persona.indicativo?.trim();

          if (!indicativo) {
            return;
          }

          const clave = normalizarIndicativo(indicativo);

          if (!gacMap.has(clave)) {
            gacMap.set(clave, {
              indicativo,
              orden: persona.orden,
              personal: [],
            });
          }

          const fila = gacMap.get(clave)!;

          /*
           * El orden 1º/2º pertenece al INDICATIVO entero,
           * no a cada agente individual.
           */
          if (
            fila.orden === null ||
            fila.orden === undefined
          ) {
            fila.orden = persona.orden;
          }

          fila.personal.push({
            usuario: crearUsuarioVisual(
              persona.usuario_id,
              persona.nombre,
              usuariosMap
            ),
            orden: persona.orden,
          });
        });

        /*
         * IMPORTANTE:
         * Los indicativos SIEMPRE se ordenan numéricamente:
         *
         * Z-400
         * Z-401
         * Z-402
         * ...
         *
         * El 1º/2º no altera este orden.
         */
        const gac = Array.from(gacMap.values()).sort(
          (a, b) =>
            numeroIndicativo(a.indicativo) -
            numeroIndicativo(b.indicativo)
        );

        /* ------------------------------------------------------------------ */
        /* CREADOR                                                             */
        /* ------------------------------------------------------------------ */

        let creador: UsuarioOrden | null = null;

        if (ordenData.creada_por) {
          creador =
            usuariosMap.get(ordenData.creada_por) ?? null;
        }

        if (!creador) {
          const creadorRow = personal.find(
            (persona) =>
              persona.usuario_id === ordenData.creada_por
          );

          if (creadorRow) {
            creador = crearUsuarioVisual(
              creadorRow.usuario_id,
              creadorRow.nombre,
              usuariosMap
            );
          }
        }

        /* ------------------------------------------------------------------ */
        /* RESULTADO                                                           */
        /* ------------------------------------------------------------------ */

        if (!cancelado) {
          setOrden({
            responsable,
            sala,
            seguridad,
            pico,
            gac,
            creador,
            creadaAt: ordenData.creada_at,
          });
        }
      } catch (err) {
        console.error(
          "Error cargando orden de servicio:",
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

  /* ------------------------------------------------------------------------ */
  /* CARGANDO                                                                  */
  /* ------------------------------------------------------------------------ */

  if (cargando) {
    return (
      <div className="mx-auto w-full max-w-2xl p-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="animate-pulse space-y-3">
            <div className="mx-auto h-4 w-40 rounded bg-slate-200" />
            <div className="mx-auto h-3 w-24 rounded bg-slate-200" />

            <div className="h-16 rounded-lg bg-slate-100" />

            <div className="h-20 rounded-lg bg-slate-100" />
            <div className="h-20 rounded-lg bg-slate-100" />
            <div className="h-24 rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* ERROR                                                                     */
  /* ------------------------------------------------------------------------ */

  if (error) {
    return (
      <div className="mx-auto w-full max-w-2xl p-3">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* SIN ORDEN                                                                 */
  /* ------------------------------------------------------------------------ */

  if (!orden) {
    return (
      <div className="mx-auto w-full max-w-2xl p-3">
        <div className="mb-2 flex items-center justify-end">
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-400"
          />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            No hay orden de servicio para esta fecha.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatearFecha(fecha)}
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* VISTA                                                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="mx-auto w-full max-w-2xl p-3">
      {/* FECHA */}

      <div className="mb-2 flex items-center justify-end">
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-400"
        />
      </div>

      {/* TARJETA ÚNICA */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* ---------------------------------------------------------------- */}
        {/* RESPONSABLE                                                       */}
        {/* ---------------------------------------------------------------- */}

        <div className="border-b border-slate-100 px-3 py-3 text-center">
          {orden.responsable ? (
            <div className="flex items-center justify-center gap-1.5">
              <EstrellaResponsable />

              <span className="text-[13px] font-bold leading-tight text-slate-800">
                {orden.responsable.nombre}
              </span>
            </div>
          ) : (
            <span className="text-[12px] text-slate-400">
              Sin responsable
            </span>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* CONTENIDO                                                         */}
        {/* ---------------------------------------------------------------- */}

        <div className="space-y-3 p-3">
          {/* ============================================================= */}
          {/* SALA                                                            */}
          {/* ============================================================= */}

          <section>
            <TituloSeccion>Sala</TituloSeccion>

            <div className="flex min-h-[38px] items-center justify-center rounded-lg bg-slate-50 px-2 py-1.5">
              {orden.sala ? (
                <Persona
                  usuario={orden.sala}
                  avatarSize="sm"
                />
              ) : (
                <span className="text-[11px] text-slate-400">
                  Sin personal
                </span>
              )}
            </div>
          </section>

          {/* ============================================================= */}
          {/* SEGURIDAD                                                       */}
          {/* ============================================================= */}

          <section>
            <TituloSeccion>Seguridad</TituloSeccion>

            <div className="flex min-h-[38px] items-center justify-center gap-5 rounded-lg bg-slate-50 px-2 py-1.5">
              {orden.seguridad.length > 0 ? (
                orden.seguridad.map((usuario, index) => (
                  <Persona
                    key={`${usuario.id}-${index}`}
                    usuario={usuario}
                    avatarSize="sm"
                  />
                ))
              ) : (
                <span className="text-[11px] text-slate-400">
                  Sin personal
                </span>
              )}
            </div>
          </section>

          {/* ============================================================= */}
          {/* GAC                                                             */}
          {/* ============================================================= */}

          {orden.gac.length > 0 && (
            <section>
              <TituloSeccion>GAC</TituloSeccion>

              {/*
               * SIN TARJETAS INDIVIDUALES PARA LOS Z.
               * Cada indicativo es solamente una fila.
               */}

              <div className="overflow-hidden rounded-lg border border-slate-100">
                {orden.gac.map((fila, index) => {
                  const esPrimero = fila.orden === 1;
                  const esSegundo = fila.orden === 2;

                  /*
                   * Prácticas SIEMPRE al final.
                   *
                   * Primero obtenemos los agentes normales
                   * y después los de prácticas.
                   */
                  const personalNormal =
                    fila.personal.filter(
                      (persona) =>
                        persona.usuario.nombre !==
                        POLICIA_PRACTICAS
                    );

                  const personalPracticas =
                    fila.personal.filter(
                      (persona) =>
                        persona.usuario.nombre ===
                        POLICIA_PRACTICAS
                    );

                  const personalOrdenado = [
                    ...personalNormal,
                    ...personalPracticas,
                  ];

                  return (
                    <div
                      key={`${fila.indicativo}-${index}`}
                      className={[
                        "flex min-h-[42px] items-center gap-2 px-2 py-1.5",
                        index > 0
                          ? "border-t border-slate-100"
                          : "",
                        esPrimero
                          ? "bg-blue-50/60"
                          : esSegundo
                            ? "bg-slate-100"
                            : "bg-white",
                      ].join(" ")}
                    >
                      {/* INDICATIVO + ORDEN */}

                      <div className="flex w-[72px] shrink-0 items-center gap-1.5">
                        <span
                          className={[
                            "flex h-5 min-w-5 items-center justify-center rounded px-1 text-[9px] font-bold",
                            esPrimero
                              ? "bg-blue-200 text-blue-800"
                              : esSegundo
                                ? "bg-slate-600 text-white"
                                : "bg-slate-200 text-slate-600",
                          ].join(" ")}
                        >
                          {esPrimero
                            ? "1º"
                            : esSegundo
                              ? "2º"
                              : ""}
                        </span>

                        <span className="text-[11px] font-bold text-slate-700">
                          {fila.indicativo}
                        </span>
                      </div>

                      {/* PERSONAS */}

                      <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
                        {personalOrdenado.map(
                          (persona, personaIndex) => (
                            <Persona
                              key={`${persona.usuario.id}-${personaIndex}`}
                              usuario={persona.usuario}
                              avatarSize="xs"
                            />
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ============================================================= */}
          {/* PICO                                                            */}
          {/* ============================================================= */}

          {orden.pico && (
            <section>
              <TituloSeccion>PICO</TituloSeccion>

              <div className="flex min-h-[38px] items-center justify-center rounded-lg bg-slate-50 px-2 py-1.5">
                <Persona
                  usuario={orden.pico}
                  avatarSize="sm"
                />
              </div>
            </section>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* PIE                                                               */}
        {/* ---------------------------------------------------------------- */}

        <div className="border-t border-slate-100 px-3 py-2 text-center">
          <span className="text-[9px] text-slate-400">
            Creada por{" "}
            <span className="font-medium text-slate-500">
              {orden.creador
                ? nombreCorto(orden.creador.nombre)
                : "—"}
            </span>

            {orden.creadaAt && (
              <>
                {" "}
                · {formatearFechaHora(orden.creadaAt)}
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}