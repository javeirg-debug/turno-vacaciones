"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

export default function GenerarIndicativos() {
  const [abierto, setAbierto] = useState(false);

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

    // Si el policía que estamos poniendo en el Z
    // era el PICO, deja de ser PICO.
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

      // Un policía no puede estar en dos Z
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
        // El seleccionado actualmente siempre debe aparecer
        if (usuario.id === valorActual) {
          return true;
        }

        // El PICO no puede aparecer como opción de Z
        if (usuario.id === pico) {
          return false;
        }

        // Si ya está en otro coche, no aparece
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

    // Si se selecciona un policía como PICO,
    // lo quitamos de cualquier Z.
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
  //
  // AQUÍ ESTÁ LA CLAVE:
  //
  // Solo aparecen policías del GAC que NO están
  // asignados a ningún Z.
  //
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
        // El que ya está seleccionado como PICO
        // debe seguir apareciendo.
        if (usuario.id === pico) {
          return true;
        }

        // Si está en cualquier Z, no es sobrante.
        if (
          asignadosAIndicativo.has(
            usuario.id
          )
        ) {
          return false;
        }

        // Por tanto, este es un compañero
        // GAC sobrante/no asignado.
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

      // Z-400 ... Z-406
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

      // PICO
      if (pico) {
        indicativoPorUsuario.set(
          pico,
          "PICO"
        );
      }

      // ACTUALIZAR TODOS LOS USUARIOS GAC
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
    <>
      {/* BOTÓN */}
      <button
        type="button"
        onClick={() =>
          setAbierto(true)
        }
        className="mt-6 w-full rounded-2xl bg-slate-800 py-3 text-lg font-semibold text-white"
      >
        Generar indicativos
      </button>

      {/* MODAL */}
      {abierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() =>
            setAbierto(false)
          }
        >
          <div
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-slate-100 p-5 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* CABECERA */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Indicativos
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Personal fijo del GAC
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAbierto(false)
                }
                className="rounded-full bg-white px-3 py-1 text-slate-500 shadow-sm"
              >
                ✕
              </button>
            </div>

            {cargando ? (
              <div className="rounded-xl bg-white p-4 text-sm text-slate-500 shadow-sm">
                Cargando personal del GAC...
              </div>
            ) : (
              <>
                {/* ================================= */}
                {/* INDICATIVOS Z                      */}
                {/* ================================= */}

                <div className="space-y-2">
                  {indicativos.map(
                    (indicativo) => (
                      <div
                        key={indicativo}
                        className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"
                      >
                        <span className="w-14 shrink-0 text-center text-sm font-bold text-slate-800">
                          {indicativo}
                        </span>

                        <div className="flex-1 space-y-2">
                          {/* POLICÍA 1 */}
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
                            className="w-full rounded-lg bg-slate-100 px-3 py-2 text-sm outline-none"
                          >
                            <option value="">
                              —
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

                          {/* POLICÍA 2 */}
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
                            className="w-full rounded-lg bg-slate-100 px-3 py-2 text-sm outline-none"
                          >
                            <option value="">
                              —
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
                      </div>
                    )
                  )}
                </div>

                {/* ================================= */}
                {/* PICO                               */}
                {/* ================================= */}

                <div className="mt-2 flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                  <span className="w-14 shrink-0 text-center text-sm font-bold text-slate-800">
                    PICO
                  </span>

                  <div className="flex-1">
                    <select
                      value={pico}
                      onChange={(event) =>
                        cambiarPico(
                          event.target.value
                        )
                      }
                      className="w-full rounded-lg bg-slate-100 px-3 py-2 text-sm outline-none"
                    >
                      <option value="">
                        —
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

                {/* ================================= */}
                {/* SUSTITUTOS DE SALA                */}
                {/* ================================= */}

                <h3 className="mt-6 mb-2 text-lg font-bold text-slate-800">
                  Sustitutos de sala
                </h3>

                <div className="space-y-2">
                  <select
                    value={sustitutos[0]}
                    onChange={(event) =>
                      cambiarSustituto(
                        0,
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl bg-white px-3 py-3 text-sm shadow-sm outline-none"
                  >
                    <option value="">
                      —
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

                  <select
                    value={sustitutos[1]}
                    onChange={(event) =>
                      cambiarSustituto(
                        1,
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl bg-white px-3 py-3 text-sm shadow-sm outline-none"
                  >
                    <option value="">
                      —
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

                {/* ================================= */}
                {/* RESPONSABLES                       */}
                {/* ================================= */}

                <h3 className="mt-6 mb-2 text-lg font-bold text-slate-800">
                  Responsables de turno
                </h3>

                {[0, 1, 2].map(
                  (posicion) => (
                    <div
                      key={posicion}
                      className="mb-2 flex items-center gap-2"
                    >
                      <span className="w-7 text-right text-sm font-bold text-slate-700">
                        {posicion + 1} -
                      </span>

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
                        className="min-w-0 flex-1 rounded-xl bg-white px-3 py-3 text-sm shadow-sm outline-none"
                      >
                        <option value="">
                          —
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
                  )
                )}

                {/* MENSAJE */}
                {mensaje && (
                  <p className="mt-4 rounded-xl bg-slate-200 px-3 py-2 text-sm text-slate-700">
                    {mensaje}
                  </p>
                )}

                {/* GUARDAR */}
                <button
                  type="button"
                  onClick={guardar}
                  disabled={
                    cargando ||
                    guardando
                  }
                  className="mt-6 w-full rounded-2xl bg-slate-800 py-3 text-lg font-semibold text-white disabled:opacity-50"
                >
                  {guardando
                    ? "Guardando..."
                    : "Guardar"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}