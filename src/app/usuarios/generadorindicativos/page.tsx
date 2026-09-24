"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/navigation/BottomNav";

// INDICATIVOS DE LOS COCHES
const indicativos = [
  "Z-400",
  "Z-401",
  "Z-402",
  "Z-403",
  "Z-404",
  "Z-405",
  "Z-406",
];

// USUARIO DEL GAC
type UsuarioGac = {
  id: string;
  nombre: string;
  indicativo: string | null;
  es_sustituto_sala: boolean;
  orden_responsable: number | null;
};

function IconoPolicial() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3.25 19 6v5.25c0 4.35-2.7 7.9-7 9.5-4.3-1.6-7-5.15-7-9.5V6l7-2.75Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m12 7.2.9 2.05 2.25.2-1.7 1.45.5 2.2L12 12l-1.95 1.1.5-2.2-1.7-1.45 2.25-.2L12 7.2Z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.3 16.1h5.4"
      />
    </svg>
  );
}

export default function Page() {
  const [usuariosGac, setUsuariosGac] = useState<UsuarioGac[]>(
    []
  );

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // Z-400 ... Z-406
  // Cada uno tiene 2 policías
  const [coches, setCoches] = useState<Record<string, string[]>>(
    Object.fromEntries(
      indicativos.map((indicativo) => [
        indicativo,
        ["", ""],
      ])
    )
  );

  // PICO SOLO TIENE UNA PLAZA
  const [pico, setPico] = useState("");

  // SUSTITUTOS DE SALA
  const [sustitutos, setSustitutos] = useState([
    "",
    "",
  ]);

  // RESPONSABLES
  const [responsables, setResponsables] = useState([
    "",
    "",
    "",
  ]);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select(
          "id, nombre, indicativo, es_sustituto_sala, orden_responsable"
        )
        .eq("puesto", "gac")
        .eq("activo", true)
        .order("nombre");

      if (error) {
        throw error;
      }

      const usuarios = (data || []) as UsuarioGac[];

      // ==============================
      // CARGAR LOS INDICATIVOS
      // ==============================

      const cochesIniciales: Record<string, string[]> =
        Object.fromEntries(
          indicativos.map((indicativo) => [
            indicativo,
            ["", ""],
          ])
        );

      let picoInicial = "";

      usuarios.forEach((usuario) => {
        if (!usuario.indicativo) {
          return;
        }

        // PICO
        if (usuario.indicativo === "PICO") {
          picoInicial = usuario.id;
          return;
        }

        // Z-400 ... Z-406
        if (!cochesIniciales[usuario.indicativo]) {
          return;
        }

        if (!cochesIniciales[usuario.indicativo][0]) {
          cochesIniciales[usuario.indicativo][0] =
            usuario.id;
        } else if (
          !cochesIniciales[usuario.indicativo][1]
        ) {
          cochesIniciales[usuario.indicativo][1] =
            usuario.id;
        }
      });

      // ==============================
      // CARGAR SUSTITUTOS
      // ==============================

      const sustitutosIniciales = usuarios
        .filter(
          (usuario) =>
            usuario.es_sustituto_sala
        )
        .slice(0, 2)
        .map((usuario) => usuario.id);

      while (
        sustitutosIniciales.length < 2
      ) {
        sustitutosIniciales.push("");
      }

      // ==============================
      // CARGAR RESPONSABLES
      // ==============================

      const responsablesIniciales = [
        "",
        "",
        "",
      ];

      usuarios.forEach((usuario) => {
        if (usuario.orden_responsable === 1) {
          responsablesIniciales[0] =
            usuario.id;
        }

        if (usuario.orden_responsable === 2) {
          responsablesIniciales[1] =
            usuario.id;
        }

        if (usuario.orden_responsable === 3) {
          responsablesIniciales[2] =
            usuario.id;
        }
      });

      setUsuariosGac(usuarios);
      setCoches(cochesIniciales);
      setPico(picoInicial);
      setSustitutos(sustitutosIniciales);
      setResponsables(responsablesIniciales);
    } catch (error) {
      console.error(error);

      setMensaje(
        "No se pudo cargar el personal."
      );
    } finally {
      setCargando(false);
    }
  }

  // =====================================================
  // CAMBIAR POLICÍA DE UN Z
  // =====================================================

  function cambiarCoche(
    indicativo: string,
    posicion: number,
    usuarioId: string
  ) {
    setMensaje("");

    if (usuarioId && usuarioId === pico) {
      setPico("");
    }

    setCoches((cochesActuales) => {
      const cochesNuevos: Record<string, string[]> =
        Object.fromEntries(
          indicativos.map((codigo) => [
            codigo,
            [...cochesActuales[codigo]],
          ])
        );

      if (usuarioId) {
        indicativos.forEach((codigo) => {
          cochesNuevos[codigo] =
            cochesNuevos[codigo].map((id) =>
              id === usuarioId
                ? ""
                : id
            );
        });
      }

      cochesNuevos[indicativo][posicion] =
        usuarioId;

      return cochesNuevos;
    });
  }

  // =====================================================
  // POLICÍAS DISPONIBLES PARA LOS Z
  // =====================================================

  function opcionesDisponibles(
    valorActual: string
  ) {
    const ocupadosEnCoches = new Set(
      Object.values(coches)
        .flat()
        .filter(Boolean)
    );

    return usuariosGac.filter(
      (usuario) => {
        if (usuario.id === valorActual) {
          return true;
        }

        if (usuario.id === pico) {
          return false;
        }

        if (
          ocupadosEnCoches.has(usuario.id)
        ) {
          return false;
        }

        return true;
      }
    );
  }

  // =====================================================
  // CAMBIAR PICO
  // =====================================================

  function cambiarPico(
    usuarioId: string
  ) {
    setMensaje("");

    if (usuarioId) {
      setCoches((cochesActuales) => {
        const cochesNuevos: Record<string, string[]> =
          Object.fromEntries(
            indicativos.map((codigo) => [
              codigo,
              cochesActuales[codigo].map(
                (id) =>
                  id === usuarioId
                    ? ""
                    : id
              ),
            ])
          );

        return cochesNuevos;
      });
    }

    setPico(usuarioId);
  }

  // =====================================================
  // OPCIONES PARA PICO
  // =====================================================

  function opcionesPico() {
    const asignadosAIndicativo =
      new Set(
        Object.values(coches)
          .flat()
          .filter(Boolean)
      );

    return usuariosGac.filter(
      (usuario) => {
        if (usuario.id === pico) {
          return true;
        }

        if (
          asignadosAIndicativo.has(
            usuario.id
          )
        ) {
          return false;
        }

        return true;
      }
    );
  }

  // =====================================================
  // SUSTITUTOS DE SALA
  // =====================================================

  function cambiarSustituto(
    posicion: number,
    usuarioId: string
  ) {
    setMensaje("");

    setSustitutos(
      (sustitutosActuales) => {
        const nuevos = [
          ...sustitutosActuales,
        ];

        if (usuarioId) {
          nuevos.forEach(
            (id, indice) => {
              if (
                id === usuarioId &&
                indice !== posicion
              ) {
                nuevos[indice] = "";
              }
            }
          );
        }

        nuevos[posicion] =
          usuarioId;

        return nuevos;
      }
    );
  }

  function opcionesSustitutos(
    valorActual: string
  ) {
    return usuariosGac.filter(
      (usuario) =>
        usuario.id === valorActual ||
        !sustitutos.includes(
          usuario.id
        )
    );
  }

  // =====================================================
  // RESPONSABLES
  // =====================================================

  function cambiarResponsable(
    posicion: number,
    usuarioId: string
  ) {
    setMensaje("");

    setResponsables(
      (responsablesActuales) => {
        const nuevos = [
          ...responsablesActuales,
        ];

        if (usuarioId) {
          nuevos.forEach(
            (id, indice) => {
              if (
                id === usuarioId &&
                indice !== posicion
              ) {
                nuevos[indice] = "";
              }
            }
          );
        }

        nuevos[posicion] =
          usuarioId;

        return nuevos;
      }
    );
  }

  function opcionesResponsables(
    valorActual: string
  ) {
    return usuariosGac.filter(
      (usuario) =>
        usuario.id === valorActual ||
        !responsables.includes(
          usuario.id
        )
    );
  }

  // =====================================================
  // GUARDAR
  // =====================================================

  async function guardar() {
    setGuardando(true);
    setMensaje("");

    try {
      const indicativoPorUsuario =
        new Map<string, string>();

      indicativos.forEach(
        (indicativo) => {
          coches[indicativo].forEach(
            (usuarioId) => {
              if (usuarioId) {
                indicativoPorUsuario.set(
                  usuarioId,
                  indicativo
                );
              }
            }
          );
        }
      );

      if (pico) {
        indicativoPorUsuario.set(
          pico,
          "PICO"
        );
      }

      const resultados =
        await Promise.all(
          usuariosGac.map(
            (usuario) =>
              supabase
                .from("usuarios")
                .update({
                  indicativo:
                    indicativoPorUsuario.get(
                      usuario.id
                    ) || null,

                  es_sustituto_sala:
                    sustitutos.includes(
                      usuario.id
                    ),

                  orden_responsable:
                    responsables[0] ===
                    usuario.id
                      ? 1
                      : responsables[1] ===
                        usuario.id
                      ? 2
                      : responsables[2] ===
                        usuario.id
                      ? 3
                      : null,
                })
                .eq(
                  "id",
                  usuario.id
                )
          )
        );

      const resultadoConError =
        resultados.find(
          (resultado) =>
            resultado.error
        );

      if (
        resultadoConError?.error
      ) {
        throw resultadoConError.error;
      }

      setMensaje(
        "Configuración guardada correctamente."
      );
    } catch (error) {
      console.error(error);

      setMensaje(
        "No se pudieron guardar los cambios."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200 px-4 pb-28 pt-5">
      <div className="mx-auto w-full max-w-md">

        {/* ================================= */}
        {/* CABECERA                          */}
        {/* ================================= */}

        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div className="shrink-0 text-slate-500">
              <IconoPolicial />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Generador Indicativos
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Configuración del personal fijo del GAC
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
            <p className="text-xs leading-5 text-slate-500">
              Configura los indicativos de los vehículos,
              sustitutos de sala y la cadena de
              responsables de turno.
            </p>
          </div>
        </div>

        {cargando ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-48 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ================================= */}
            {/* INDICATIVOS Z + PICO              */}
            {/* ================================= */}

            <section className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Indicativos
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Personal asignado a cada vehículo
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
                    8
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {indicativos.map(
                  (indicativo, indice) => (
                    <div
                      key={indicativo}
                      className="flex items-center gap-3 px-3 py-3 transition hover:bg-slate-50"
                    >
                      <div className="flex w-[62px] shrink-0 items-center justify-center">
                        <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-bold tracking-wide text-white shadow-sm">
                          {indicativo}
                        </span>
                      </div>

                      <div className="flex-1 space-y-2">
                        <select
                          value={
                            coches[
                              indicativo
                            ][0]
                          }
                          onChange={(event) =>
                            cambiarCoche(
                              indicativo,
                              0,
                              event.target.value
                            )
                          }
                          className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                        >
                          <option value="">
                            Seleccionar policía
                          </option>

                          {opcionesDisponibles(
                            coches[
                              indicativo
                            ][0]
                          ).map(
                            (usuario) => (
                              <option
                                key={
                                  usuario.id
                                }
                                value={
                                  usuario.id
                                }
                              >
                                {
                                  usuario.nombre
                                }
                              </option>
                            )
                          )}
                        </select>

                        <select
                          value={
                            coches[
                              indicativo
                            ][1]
                          }
                          onChange={(event) =>
                            cambiarCoche(
                              indicativo,
                              1,
                              event.target.value
                            )
                          }
                          className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                        >
                          <option value="">
                            Seleccionar policía
                          </option>

                          {opcionesDisponibles(
                            coches[
                              indicativo
                            ][1]
                          ).map(
                            (usuario) => (
                              <option
                                key={
                                  usuario.id
                                }
                                value={
                                  usuario.id
                                }
                              >
                                {
                                  usuario.nombre
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <span className="hidden text-[10px] font-medium text-slate-300 sm:block">
                        {String(
                          indice + 1
                        ).padStart(2, "0")}
                      </span>
                    </div>
                  )
                )}

                {/* PICO */}
                <div className="flex items-center gap-3 px-3 py-3 transition hover:bg-slate-50">
                  <div className="flex w-[62px] shrink-0 items-center justify-center">
                    <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-bold tracking-wide text-white shadow-sm">
                      Pico
                    </span>
                  </div>

                  <div className="flex-1">
                    <select
                      value={pico}
                      onChange={(event) =>
                        cambiarPico(
                          event.target.value
                        )
                      }
                      className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                    >
                      <option value="">
                        Seleccionar policía
                      </option>

                      {opcionesPico().map(
                        (usuario) => (
                          <option
                            key={usuario.id}
                            value={usuario.id}
                          >
                            {usuario.nombre}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* ================================= */}
            {/* SUSTITUTOS DE SALA                */}
            {/* ================================= */}

            <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <circle
                        cx="9"
                        cy="8"
                        r="3"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 20a6 6 0 0 1 12 0"
                      />

                      <circle
                        cx="17"
                        cy="9"
                        r="2.5"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 15a5 5 0 0 1 5 5"
                      />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Sustitutos de sala
                    </h2>

                    <p className="text-xs text-slate-500">
                      Dos plazas disponibles
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                  2 PLAZAS
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                    1
                  </span>

                  <select
                    value={sustitutos[0]}
                    onChange={(event) =>
                      cambiarSustituto(
                        0,
                        event.target.value
                      )
                    }
                    className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="">
                      Seleccionar sustituto
                    </option>

                    {opcionesSustitutos(
                      sustitutos[0]
                    ).map((usuario) => (
                      <option
                        key={usuario.id}
                        value={usuario.id}
                      >
                        {usuario.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                    2
                  </span>

                  <select
                    value={sustitutos[1]}
                    onChange={(event) =>
                      cambiarSustituto(
                        1,
                        event.target.value
                      )
                    }
                    className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
                  >
                    <option value="">
                      Seleccionar sustituto
                    </option>

                    {opcionesSustitutos(
                      sustitutos[1]
                    ).map((usuario) => (
                      <option
                        key={usuario.id}
                        value={usuario.id}
                      >
                        {usuario.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* ================================= */}
            {/* RESPONSABLES                      */}
            {/* ================================= */}

            <section className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3.5 19 7v5c0 4.1-2.5 7.3-7 8.5C7.5 19.3 5 16.1 5 12V7l7-3.5Z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6M12 9v6"
                    />
                  </svg>
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Responsables de turno
                  </h2>

                  <p className="text-xs text-slate-500">
                    Cadena de responsabilidad
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {[0, 1, 2].map(
                  (posicion) => (
                    <div
                      key={posicion}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-2"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200">
                        {posicion + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Responsable {posicion + 1}
                        </p>

                        <select
                          value={
                            responsables[
                              posicion
                            ]
                          }
                          onChange={(event) =>
                            cambiarResponsable(
                              posicion,
                              event.target.value
                            )
                          }
                          className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        >
                          <option value="">
                            Seleccionar responsable
                          </option>

                          {opcionesResponsables(
                            responsables[
                              posicion
                            ]
                          ).map(
                            (usuario) => (
                              <option
                                key={
                                  usuario.id
                                }
                                value={
                                  usuario.id
                                }
                              >
                                {
                                  usuario.nombre
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            {/* ================================= */}
            {/* MENSAJE                           */}
            {/* ================================= */}

            {mensaje && (
              <div className="mb-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m6 12 4 4 8-8"
                    />
                  </svg>
                </div>

                <p className="text-sm font-medium leading-6 text-slate-700">
                  {mensaje}
                </p>
              </div>
            )}

            {/* ================================= */}
            {/* GUARDAR                           */}
            {/* ================================= */}

            <button
              type="button"
              onClick={guardar}
              disabled={
                cargando ||
                guardando
              }
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 py-3.5 text-base font-bold text-white shadow-lg shadow-slate-300 transition-all hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-xl active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {guardando ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeOpacity="0.25"
                      strokeWidth="3"
                    />

                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>

                  Guardando configuración...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 4h11l3 3v13H5V4Z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 4v5h7V4M8 16h8"
                    />
                  </svg>

                  Guardar configuración
                </>
              )}
            </button>
          </>
        )}
      </div>

      <BottomNav />
    </main>
  );
}