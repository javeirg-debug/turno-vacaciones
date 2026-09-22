"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/navigation/BottomNav";

/* =========================================================
   ICONOS
========================================================= */

type IconProps = {
  className?: string;
};

function SvgIcon({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function IconCar({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M5 17h14l-1-7H6Z" />
      <path d="M7 10 9 5h6l2 5" />
      <circle cx="8" cy="17" r="1.5" />
      <circle cx="16" cy="17" r="1.5" />
    </SvgIcon>
  );
}

function IconShield({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6Z" />
    </SvgIcon>
  );
}

function IconMonitor({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </SvgIcon>
  );
}

function IconStar({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3.5 14.6 9l5.9.7-4.4 4.1 1.1 5.8L12 16.8l-5.2 2.8 1.1-5.8-4.4-4.1L9.4 9 12 3.5Z"
        stroke="#D4A017"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
      <circle cx="12" cy="12" r="4.5" fill="#FACC15" />

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
      <path d="M7 15a5 5 0 0 1 10 0" fill="#F97316" />

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
        d="
          M20 15.5A8.5 8.5 0 0 1 8.5 4.2
          A8.5 8.5 0 1 0 20 15.5Z
        "
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
   FECHA
========================================================= */

function formatearFechaGrande(fecha: string) {
  return new Date(
    fecha + "T00:00:00"
  ).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/* =========================================================
   INDICATIVOS
========================================================= */

const indicativos = [
  "Z-400",
  "Z-401",
  "Z-402",
  "Z-403",
  "Z-404",
  "Z-405",
  "Z-406",
];

/* =========================================================
   POLICÍA EN PRÁCTICAS
========================================================= */

const POLICIA_PRACTICAS =
  "__POLICIA_PRACTICAS__";

/* =========================================================
   TIPO DE USUARIO
========================================================= */

type Usuario = {
  id: string;
  nombre: string;
  categoria: string | null;
  orden_responsable: number | null;
  es_sustituto_sala: boolean | null;
  puesto: string | null;
  indicativo: string | null;
};

/* =========================================================
   TIPO PERSONAL GUARDADO
========================================================= */

type PersonalGuardado = {
  id: string;
  usuario_id: string | null;
  nombre: string;
  indicativo: string | null;
  funcion: string;
  orden: number | null;
};

/* =========================================================
   HELPERS
========================================================= */

function normalizar(
  valor: string | null | undefined
) {
  return (valor ?? "").trim().toLowerCase();
}

function normalizarIndicativo(
  valor: string | null | undefined
) {
  return normalizar(valor).replace(
    /[^a-z0-9]/g,
    ""
  );
}

function esPuesto(
  usuario: Usuario,
  puesto: string
) {
  return (
    normalizar(usuario.puesto) ===
    normalizar(puesto)
  );
}

function esPico(usuario: Usuario) {
  return (
    normalizar(usuario.puesto) === "pico" ||
    normalizarIndicativo(
      usuario.indicativo
    ) === "pico"
  );
}

/* =========================================================
   PÁGINA
========================================================= */

export default function OrdenServicioFecha() {
  const params = useParams();
  const router = useRouter();

  const fecha = params.fecha as string;

  const turnoHoy = obtenerTurno(fecha);

  /* =======================================================
     USUARIOS DISPONIBLES
  ======================================================= */

  const [
    usuariosDisponibles,
    setUsuariosDisponibles,
  ] = useState<Usuario[]>([]);

  const [
    cargandoUsuarios,
    setCargandoUsuarios,
  ] = useState(true);

  const propuestaGenerada =
    useRef(false);

  /* =======================================================
     ORDEN EXISTENTE
  ======================================================= */

  const [
    ordenExistenteId,
    setOrdenExistenteId,
  ] = useState<string | null>(null);

  /* =======================================================
     RESPONSABLE
  ======================================================= */

  const [
    responsableSeleccionado,
    setResponsableSeleccionado,
  ] = useState("");

  /* =======================================================
     G.A.C.
  ======================================================= */

  const [
    seleccionesGac,
    setSeleccionesGac,
  ] = useState<string[]>(
    Array(indicativos.length * 2).fill("")
  );

  /* =======================================================
     PICO
  ======================================================= */

  const [
    picoSeleccionado,
    setPicoSeleccionado,
  ] = useState("");

  const [
  ordenEntradaPico,
  setOrdenEntradaPico,
] = useState<
  "primero" | "segundo" | ""
>("");

  /* =======================================================
     SEGURIDAD
  ======================================================= */

  const [
    seleccionesSeguridad,
    setSeleccionesSeguridad,
  ] = useState<string[]>(
    Array(3).fill("")
  );

  /* =======================================================
     PRIMERAS Y SEGUNDAS
  ======================================================= */

  const [
    ordenEntradaGac,
    setOrdenEntradaGac,
  ] = useState<
    ("primero" | "segundo" | "")[]
  >(
    Array(indicativos.length).fill("")
  );

  /* =======================================================
     SALA
  ======================================================= */

  const [
    salaSeleccionado,
    setSalaSeleccionado,
  ] = useState("");

  /* =======================================================
     SUSTITUCIONES DE SALA
  ======================================================= */

  const [
    numeroSustituciones,
    setNumeroSustituciones,
  ] = useState<Record<string, number>>({});

  /* =======================================================
     GUARDAR ORDEN
  ======================================================= */

  const [
    guardandoOrden,
    setGuardandoOrden,
  ] = useState(false);

  /* =======================================================
     CONVERTIR FILA GUARDADA EN SELECCIÓN
  ======================================================= */

  function convertirPersonalASeleccion(
    personal: PersonalGuardado
  ) {
    if (
      !personal.usuario_id &&
      personal.nombre === "Policía en Prácticas"
    ) {
      return POLICIA_PRACTICAS;
    }

    return personal.usuario_id ?? "";
  }

  /* =======================================================
     CARGAR USUARIOS + ORDEN
  ======================================================= */

  useEffect(() => {
    async function cargarUsuariosDisponibles() {
      setCargandoUsuarios(true);

      propuestaGenerada.current = false;

      setOrdenExistenteId(null);

      setSeleccionesGac(
        Array(indicativos.length * 2).fill("")
      );

setPicoSeleccionado("");

setOrdenEntradaPico("");

setSeleccionesSeguridad(
  Array(3).fill("")
);

      setSalaSeleccionado("");

      setResponsableSeleccionado("");

      setOrdenEntradaGac(
        Array(indicativos.length).fill("")
      );

      try {
        /* ---------------------------------------------------
           1. USUARIOS ACTIVOS
        --------------------------------------------------- */

        const {
          data: usuarios,
          error: usuariosError,
        } = await supabase
          .from("usuarios")
          .select(
            "id, nombre, categoria, orden_responsable, es_sustituto_sala, puesto, indicativo"
          )
          .eq("activo", true)
          .order("nombre");

        if (usuariosError) {
          throw usuariosError;
        }

        /* ---------------------------------------------------
           2. VACACIONES
        --------------------------------------------------- */

        const {
          data: vacaciones,
          error: vacacionesError,
        } = await supabase
          .from("vacaciones_con_usuario")
          .select("usuario_id")
          .lte("fecha_inicio", fecha)
          .gte("fecha_fin", fecha);

        if (vacacionesError) {
          throw vacacionesError;
        }

        /* ---------------------------------------------------
           3. IDS DE PERSONAS DE VACACIONES
        --------------------------------------------------- */

        const usuariosDeVacaciones =
          new Set(
            (vacaciones ?? []).map(
              (vacacion) =>
                vacacion.usuario_id
            )
          );

        /* ---------------------------------------------------
           4. USUARIOS DISPONIBLES
        --------------------------------------------------- */

        const disponibles =
          (usuarios ?? []).filter(
            (usuario) =>
              !usuariosDeVacaciones.has(
                usuario.id
              )
          ) as Usuario[];

        setUsuariosDisponibles(
          disponibles
        );

        /* ---------------------------------------------------
           5. SUSTITUCIONES DE SALA
        --------------------------------------------------- */

        const {
          data: sustituciones,
          error: sustitucionesError,
        } = await supabase
          .from("sustituciones_sala")
          .select("usuario_id");

        if (sustitucionesError) {
          throw sustitucionesError;
        }

        const conteo: Record<
          string,
          number
        > = {};

        (
          sustituciones ?? []
        ).forEach((sustitucion) => {
          if (!sustitucion.usuario_id) {
            return;
          }

          if (
            !conteo[
              sustitucion.usuario_id
            ]
          ) {
            conteo[
              sustitucion.usuario_id
            ] = 0;
          }

          conteo[
            sustitucion.usuario_id
          ]++;
        });

        setNumeroSustituciones(
          conteo
        );

        /* ===================================================
           6. BUSCAR ORDEN EXISTENTE
        =================================================== */

        const {
          data: ordenExistente,
          error: errorOrdenExistente,
        } = await supabase
          .from("ordenes_servicio")
          .select(
            "id, fecha, estado, creada_por"
          )
          .eq("fecha", fecha)
          .order("creada_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

        if (errorOrdenExistente) {
          throw errorOrdenExistente;
        }

        /* ===================================================
           7. SI EXISTE, CARGARLA
        =================================================== */

        if (ordenExistente) {
          setOrdenExistenteId(
            ordenExistente.id
          );

          /* -------------------------------------------------
             PERSONAL DE LA ORDEN
          ------------------------------------------------- */

          const {
            data: personalGuardado,
            error: errorPersonalGuardado,
          } = await supabase
            .from("ordenes_servicio_personal")
            .select(
              "id, usuario_id, nombre, indicativo, funcion, orden"
            )
            .eq(
              "orden_id",
              ordenExistente.id
            )
            .order("id");

          if (errorPersonalGuardado) {
            throw errorPersonalGuardado;
          }

          const personal =
            (personalGuardado ??
              []) as PersonalGuardado[];

          /* -------------------------------------------------
             RESPONSABLE
          ------------------------------------------------- */

          const filaResponsable =
            personal.find(
              (fila) =>
                fila.funcion ===
                "responsable"
            );

          setResponsableSeleccionado(
            filaResponsable
              ? convertirPersonalASeleccion(
                  filaResponsable
                )
              : ""
          );

          /* -------------------------------------------------
             GAC
          ------------------------------------------------- */

          const nuevoGac =
            Array(
              indicativos.length * 2
            ).fill("");

          const nuevoOrdenEntradaGac =
            Array<
              "primero" | "segundo" | ""
            >(indicativos.length).fill("");

          const filasGac =
            personal.filter(
              (fila) =>
                fila.funcion === "gac"
            );

          indicativos.forEach(
            (
              indicativo,
              indiceIndicativo
            ) => {
              const claveIndicativo =
                normalizarIndicativo(
                  indicativo
                );

              const filas =
                filasGac.filter(
                  (fila) =>
                    normalizarIndicativo(
                      fila.indicativo
                    ) ===
                    claveIndicativo
                );

const ordenIndicativo =
  filas.some(
    (fila) =>
      fila.orden === 1
  )
    ? "primero"
    : filas.some(
        (fila) =>
          fila.orden === 2
      )
      ? "segundo"
      : "";

filas
  .slice(0, 2)
  .forEach(
    (
      fila,
      posicion
    ) => {
      nuevoGac[
        indiceIndicativo * 2 +
          posicion
      ] =
        convertirPersonalASeleccion(
          fila
        );
    }
  );

nuevoOrdenEntradaGac[
  indiceIndicativo
] = ordenIndicativo;
            }
          );

          setSeleccionesGac(
            nuevoGac
          );

          setOrdenEntradaGac(
            nuevoOrdenEntradaGac
          );

          /* -------------------------------------------------
             PICO
          ------------------------------------------------- */

const filaPico =
  personal.find(
    (fila) =>
      fila.funcion === "pico"
  );

setPicoSeleccionado(
  filaPico
    ? convertirPersonalASeleccion(
        filaPico
      )
    : ""
);

setOrdenEntradaPico(
  filaPico?.orden === 1
    ? "primero"
    : filaPico?.orden === 2
      ? "segundo"
      : ""
);

          /* -------------------------------------------------
             SEGURIDAD
          ------------------------------------------------- */

          const nuevaSeguridad =
            Array(3).fill("");

          const filasSeguridad =
            personal.filter(
              (fila) =>
                fila.funcion ===
                "seguridad"
            );

          filasSeguridad.forEach(
            (fila) => {
              const posicion =
                (fila.orden ?? 0) - 1;

              if (
                posicion >= 0 &&
                posicion < 3
              ) {
                nuevaSeguridad[
                  posicion
                ] =
                  convertirPersonalASeleccion(
                    fila
                  );
              }
            }
          );

          setSeleccionesSeguridad(
            nuevaSeguridad
          );

          /* -------------------------------------------------
             SALA
          ------------------------------------------------- */

          const filaSala =
            personal.find(
              (fila) =>
                fila.funcion === "sala"
            );

          setSalaSeleccionado(
            filaSala
              ? convertirPersonalASeleccion(
                  filaSala
                )
              : ""
          );

          /*
           * Muy importante:
           * no generamos la propuesta automática
           * porque ya tenemos una orden guardada.
           */
          propuestaGenerada.current =
            true;
        } else {
          /* =================================================
             8. NO EXISTE ORDEN -> PROPUESTA AUTOMÁTICA
          ================================================= */

          const usuariosOrdenados =
            [...disponibles].sort(
              (a, b) =>
                a.nombre.localeCompare(
                  b.nombre,
                  "es"
                )
            );

          const usuariosYaColocados =
            new Set<string>();

          /* -------------------------------------------------
             8.1 SALA
          ------------------------------------------------- */

          let salaInicial = "";

          const personaPuestoSala =
            usuariosOrdenados.find(
              (usuario) =>
                esPuesto(
                  usuario,
                  "sala"
                )
            );

          if (personaPuestoSala) {
            salaInicial =
              personaPuestoSala.id;
          } else {
            const sustitutosDisponibles =
              usuariosOrdenados
                .filter(
                  (usuario) =>
                    usuario.es_sustituto_sala ===
                    true
                )
                .sort((a, b) => {
                  const cantidadA =
                    conteo[a.id] ?? 0;

                  const cantidadB =
                    conteo[b.id] ?? 0;

                  if (
                    cantidadA !==
                    cantidadB
                  ) {
                    return (
                      cantidadA -
                      cantidadB
                    );
                  }

                  return a.nombre.localeCompare(
                    b.nombre,
                    "es"
                  );
                });

            if (
              sustitutosDisponibles.length >
              0
            ) {
              salaInicial =
                sustitutosDisponibles[0]
                  .id;
            }
          }

          if (salaInicial) {
            usuariosYaColocados.add(
              salaInicial
            );

            setSalaSeleccionado(
              salaInicial
            );
          }

          /* -------------------------------------------------
             8.2 GAC
          ------------------------------------------------- */

          const nuevoGac = Array(
            indicativos.length * 2
          ).fill("");

          indicativos.forEach(
            (
              indicativo,
              indiceIndicativo
            ) => {
              const claveIndicativo =
                normalizarIndicativo(
                  indicativo
                );

              const personasGac =
                usuariosOrdenados.filter(
                  (usuario) => {
                    if (
                      usuariosYaColocados.has(
                        usuario.id
                      )
                    ) {
                      return false;
                    }

                    if (
                      !esPuesto(
                        usuario,
                        "gac"
                      )
                    ) {
                      return false;
                    }

                    return (
                      normalizarIndicativo(
                        usuario.indicativo
                      ) ===
                      claveIndicativo
                    );
                  }
                );

              personasGac
                .slice(0, 2)
                .forEach(
                  (
                    usuario,
                    posicion
                  ) => {
                    const indice =
                      indiceIndicativo *
                        2 +
                      posicion;

                    nuevoGac[indice] =
                      usuario.id;

                    usuariosYaColocados.add(
                      usuario.id
                    );
                  }
                );
            }
          );

          setSeleccionesGac(
            nuevoGac
          );

          /* -------------------------------------------------
             8.3 PICO
          ------------------------------------------------- */

          const personaPico =
            usuariosOrdenados.find(
              (usuario) => {
                if (
                  usuariosYaColocados.has(
                    usuario.id
                  )
                ) {
                  return false;
                }

                return esPico(usuario);
              }
            );

          if (personaPico) {
            setPicoSeleccionado(
              personaPico.id
            );

            usuariosYaColocados.add(
              personaPico.id
            );
          }

          /* -------------------------------------------------
             8.4 SEGURIDAD
          ------------------------------------------------- */

          const personasSeguridad =
            usuariosOrdenados
              .filter((usuario) => {
                if (
                  usuariosYaColocados.has(
                    usuario.id
                  )
                ) {
                  return false;
                }

                return esPuesto(
                  usuario,
                  "seguridad"
                );
              })
              .slice(0, 3);

          const nuevaSeguridad =
            Array(3).fill("");

          personasSeguridad.forEach(
            (usuario, indice) => {
              nuevaSeguridad[indice] =
                usuario.id;

              usuariosYaColocados.add(
                usuario.id
              );
            }
          );

          setSeleccionesSeguridad(
            nuevaSeguridad
          );

          /*
           * Responsable por defecto para una orden nueva.
           */
          const responsablesParaNuevaOrden =
            [
              ...disponibles.filter(
                (usuario) =>
                  usuario.categoria
                    ?.trim()
                    .toLowerCase() ===
                  "oficial"
              ),
              ...disponibles.filter(
                (usuario) =>
                  usuario.orden_responsable ===
                  1
              ),
              ...disponibles.filter(
                (usuario) =>
                  usuario.orden_responsable ===
                  2
              ),
              ...disponibles.filter(
                (usuario) =>
                  usuario.orden_responsable ===
                  3
              ),
            ].filter(
              (usuario, indice, array) =>
                array.findIndex(
                  (otro) =>
                    otro.id ===
                    usuario.id
                ) === indice
            );

          if (
            responsablesParaNuevaOrden.length >
            0
          ) {
            setResponsableSeleccionado(
              responsablesParaNuevaOrden[0].id
            );
          }

          propuestaGenerada.current =
            true;
        }
      } catch (error) {
        console.error(
          "Error cargando usuarios disponibles:",
          error
        );

        setUsuariosDisponibles(
          []
        );

        setNumeroSustituciones(
          {}
        );

        setOrdenExistenteId(null);
      } finally {
        setCargandoUsuarios(
          false
        );
      }
    }

    cargarUsuariosDisponibles();
  }, [fecha]);

  /* =======================================================
     RESPONSABLES
  ======================================================= */

  const responsables = [
    ...usuariosDisponibles.filter(
      (usuario) =>
        usuario.categoria
          ?.trim()
          .toLowerCase() ===
        "oficial"
    ),

    ...usuariosDisponibles.filter(
      (usuario) =>
        usuario.orden_responsable ===
        1
    ),

    ...usuariosDisponibles.filter(
      (usuario) =>
        usuario.orden_responsable ===
        2
    ),

    ...usuariosDisponibles.filter(
      (usuario) =>
        usuario.orden_responsable ===
        3
    ),
  ];

  const responsablesUnicos =
    responsables.filter(
      (usuario, indice, array) =>
        array.findIndex(
          (otro) =>
            otro.id === usuario.id
        ) === indice
    );

  /* =======================================================
     RESPONSABLE POR DEFECTO
  ======================================================= */

  useEffect(() => {
    if (
      cargandoUsuarios ||
      ordenExistenteId
    ) {
      return;
    }

    if (
      responsablesUnicos.length ===
      0
    ) {
      setResponsableSeleccionado(
        ""
      );
      return;
    }

    setResponsableSeleccionado(
      responsablesUnicos[0].id
    );
  }, [
    usuariosDisponibles,
    ordenExistenteId,
    cargandoUsuarios,
  ]);

  /* =======================================================
     PERSONAS YA UTILIZADAS
  ======================================================= */

  const usuariosSeleccionadosEnOtros =
    new Set(
      [
        ...seleccionesGac,
        picoSeleccionado,
        ...seleccionesSeguridad,
        salaSeleccionado,
      ].filter(
        (valor) =>
          Boolean(valor) &&
          valor !==
            POLICIA_PRACTICAS
      )
    );

  /* =======================================================
     OPCIONES DE USUARIOS
  ======================================================= */

  function obtenerOpcionesUsuarios(
    seleccionActual: string,
    usuariosEnOtrosDesplegables: string[]
  ) {
    const ocupados = new Set(
      usuariosEnOtrosDesplegables.filter(
        (valor) =>
          Boolean(valor) &&
          valor !==
            POLICIA_PRACTICAS &&
          valor !== seleccionActual
      )
    );

    return usuariosDisponibles.filter(
      (usuario) =>
        usuario.id ===
          seleccionActual ||
        !ocupados.has(usuario.id)
    );
  }

  /* =======================================================
     OPCIONES GAC
  ======================================================= */

  function obtenerOpcionesGac(
    indiceActual: number
  ) {
    const otrosGac =
      seleccionesGac.filter(
        (_, indice) =>
          indice !== indiceActual
      );

    return obtenerOpcionesUsuarios(
      seleccionesGac[indiceActual],
      [
        ...otrosGac,
        picoSeleccionado,
        ...seleccionesSeguridad,
        salaSeleccionado,
      ]
    );
  }

  /* =======================================================
     OPCIONES PICO
  ======================================================= */

  function obtenerOpcionesPico() {
    return obtenerOpcionesUsuarios(
      picoSeleccionado,
      [
        ...seleccionesGac,
        ...seleccionesSeguridad,
        salaSeleccionado,
      ]
    );
  }

  /* =======================================================
     OPCIONES SEGURIDAD
  ======================================================= */

  function obtenerOpcionesSeguridad(
    indiceActual: number
  ) {
    const otrasSeguridad =
      seleccionesSeguridad.filter(
        (_, indice) =>
          indice !== indiceActual
      );

    return obtenerOpcionesUsuarios(
      seleccionesSeguridad[
        indiceActual
      ],
      [
        ...seleccionesGac,
        picoSeleccionado,
        ...otrasSeguridad,
        salaSeleccionado,
      ]
    );
  }

  /* =======================================================
     USUARIOS DISPONIBLES PARA SALA
  ======================================================= */

  const usuariosDisponiblesParaSala =
    usuariosDisponibles.filter(
      (usuario) =>
        !seleccionesGac.includes(
          usuario.id
        ) &&
        usuario.id !==
          picoSeleccionado &&
        !seleccionesSeguridad.includes(
          usuario.id
        )
    );

  /* =======================================================
     PUESTO SALA
  ======================================================= */

  const usuarioPuestoSala =
    usuariosDisponiblesParaSala.find(
      (usuario) =>
        usuario.puesto
          ?.trim()
          .toLowerCase() ===
        "sala"
    );

  /* =======================================================
     SUSTITUTOS DE SALA
  ======================================================= */

  const sustitutosSala =
    usuariosDisponiblesParaSala
      .filter(
        (usuario) =>
          usuario.es_sustituto_sala ===
          true
      )
      .sort((a, b) => {
        const sustitucionesA =
          numeroSustituciones[a.id] ??
          0;

        const sustitucionesB =
          numeroSustituciones[b.id] ??
          0;

        if (
          sustitucionesA !==
          sustitucionesB
        ) {
          return (
            sustitucionesA -
            sustitucionesB
          );
        }

        return a.nombre.localeCompare(
          b.nombre,
          "es"
        );
      });

  /* =======================================================
     RESTO DE USUARIOS PARA SALA
  ======================================================= */

  const idsSustitutosSala =
    new Set(
      sustitutosSala.map(
        (usuario) => usuario.id
      )
    );

  const otrosUsuariosSala =
    usuariosDisponiblesParaSala
      .filter(
        (usuario) =>
          usuario.id !==
            usuarioPuestoSala?.id &&
          !idsSustitutosSala.has(
            usuario.id
          )
      )
      .sort((a, b) =>
        a.nombre.localeCompare(
          b.nombre,
          "es"
        )
      );

  /* =======================================================
     OPCIONES COMPLETAS DE SALA
  ======================================================= */

  const opcionesSalaBase = [
    ...(usuarioPuestoSala
      ? [usuarioPuestoSala]
      : []),

    ...sustitutosSala,

    ...otrosUsuariosSala,
  ];

  const opcionesSala =
    opcionesSalaBase.filter(
      (usuario, indice, array) =>
        array.findIndex(
          (otro) =>
            otro.id === usuario.id
        ) === indice
    );

  if (
    salaSeleccionado &&
    salaSeleccionado !==
      POLICIA_PRACTICAS &&
    !opcionesSala.some(
      (usuario) =>
        usuario.id ===
        salaSeleccionado
    )
  ) {
    const usuarioSalaActual =
      usuariosDisponibles.find(
        (usuario) =>
          usuario.id ===
          salaSeleccionado
      );

    if (usuarioSalaActual) {
      opcionesSala.unshift(
        usuarioSalaActual
      );
    }
  }

  /* =======================================================
     GUARDAR ORDEN DE SERVICIO
  ======================================================= */

  async function guardarOrdenServicio() {
    if (guardandoOrden) return;

    try {
      setGuardandoOrden(true);

      /* ---------------------------------------------------
         1. USUARIO AUTENTICADO
      --------------------------------------------------- */

      const {
        data: { user },
        error: usuarioAuthError,
      } = await supabase.auth.getUser();

      if (usuarioAuthError) {
        throw usuarioAuthError;
      }

      if (!user) {
        throw new Error(
          "No hay ningún usuario autenticado."
        );
      }

      /* ---------------------------------------------------
         2. VALIDAR GAC
      --------------------------------------------------- */

      for (
        let indiceIndicativo = 0;
        indiceIndicativo <
        indicativos.length;
        indiceIndicativo++
      ) {
        const indicePersona1 =
          indiceIndicativo * 2;

        const indicePersona2 =
          indiceIndicativo * 2 + 1;

        const persona1 =
          seleccionesGac[
            indicePersona1
          ];

        const persona2 =
          seleccionesGac[
            indicePersona2
          ];

        const ordenEntrada =
          ordenEntradaGac[
            indiceIndicativo
          ];

        if (
          persona1 &&
          persona2 &&
          !ordenEntrada
        ) {
          alert(
            `Selecciona quién entra 1º en ${indicativos[indiceIndicativo]}.`
          );

          return;
        }
      }

      /* ---------------------------------------------------
         3. CREAR O RECUPERAR ORDEN
      --------------------------------------------------- */

      let ordenId =
        ordenExistenteId;

      if (ordenId) {
        /* ================================================
           ORDEN EXISTENTE -> ACTUALIZAR
        ================================================ */

        const {
          error: errorActualizarOrden,
        } = await supabase
          .from("ordenes_servicio")
          .update({
            estado: "confirmada",
            actualizada_at:
              new Date().toISOString(),
          })
          .eq("id", ordenId);

        if (errorActualizarOrden) {
          throw errorActualizarOrden;
        }

        /* -----------------------------------------------
           BORRAR TODO EL PERSONAL ANTERIOR
        ----------------------------------------------- */

        const {
          error: errorBorrarPersonal,
        } = await supabase
          .from(
            "ordenes_servicio_personal"
          )
          .delete()
          .eq("orden_id", ordenId);

        if (errorBorrarPersonal) {
          throw errorBorrarPersonal;
        }

        /* -----------------------------------------------
           BORRAR SOLO LA SUSTITUCIÓN DE ESTA ORDEN
        ----------------------------------------------- */

        const {
          error: errorBorrarSustitucion,
        } = await supabase
          .from("sustituciones_sala")
          .delete()
          .eq("orden_id", ordenId);

        if (errorBorrarSustitucion) {
          throw errorBorrarSustitucion;
        }
      } else {
        /* ================================================
           ORDEN NUEVA -> INSERTAR
        ================================================ */

        const {
          data: ordenCreada,
          error: errorOrden,
        } = await supabase
          .from("ordenes_servicio")
          .insert({
            fecha,
            estado: "confirmada",
            creada_por: user.id,
          })
          .select("id")
          .single();

        if (errorOrden) {
          throw errorOrden;
        }

        ordenId =
          ordenCreada.id;

        setOrdenExistenteId(
          ordenCreada.id
        );
      }

      if (!ordenId) {
        throw new Error(
          "No se ha podido obtener el ID de la orden."
        );
      }

      /* ---------------------------------------------------
         4. PREPARAR PERSONAL
      --------------------------------------------------- */

const personal: {
  orden_id: string;
  usuario_id: string | null;
  nombre: string;
  indicativo: string | null;
  funcion: string;
  orden: number | null;
  fecha_orden: string;
}[] = [];

      function añadirPersonal(
        usuarioId: string,
        indicativo: string | null,
        funcion: string,
        orden: number | null
      ) {
        /* Policía en Prácticas */
        if (
          usuarioId ===
          POLICIA_PRACTICAS
        ) {
personal.push({
  orden_id: ordenId!,
  usuario_id: null,
  nombre:
    "Policía en Prácticas",
  indicativo,
  funcion,
  orden,
  fecha_orden: fecha,
});

          return;
        }

        const usuario =
          usuariosDisponibles.find(
            (u) =>
              u.id === usuarioId
          );

        if (!usuario) return;

personal.push({
  orden_id: ordenId!,
  usuario_id: usuario.id,
  nombre: usuario.nombre,
  indicativo,
  funcion,
  orden,
  fecha_orden: fecha,
});
      }

      /* ---------------------------------------------------
         5. RESPONSABLE
      --------------------------------------------------- */

      if (
        responsableSeleccionado
      ) {
        añadirPersonal(
          responsableSeleccionado,
          null,
          "responsable",
          null
        );
      }

/* ---------------------------------------------------
   6. GAC
--------------------------------------------------- */

indicativos.forEach(
  (indicativo, indiceIndicativo) => {
    const indicePersona1 =
      indiceIndicativo * 2;

    const indicePersona2 =
      indiceIndicativo * 2 + 1;

    const persona1 =
      seleccionesGac[indicePersona1];

    const persona2 =
      seleccionesGac[indicePersona2];

    const ordenEntrada =
      ordenEntradaGac[indiceIndicativo];

    /*
     * El número pertenece al indicativo completo.
     *
     * 1º = los dos componentes entran de Primeras
     * 2º = los dos componentes entran de Segundas
     */

    let orden: number | null = null;

    if (ordenEntrada === "primero") {
      orden = 1;
    } else if (ordenEntrada === "segundo") {
      orden = 2;
    }

    if (persona1) {
      añadirPersonal(
        persona1,
        indicativo,
        "gac",
        orden
      );
    }

    if (persona2) {
      añadirPersonal(
        persona2,
        indicativo,
        "gac",
        orden
      );
    }
  }
);
      /* ---------------------------------------------------
         7. PICO
      --------------------------------------------------- */

if (picoSeleccionado) {
  let ordenPico: number | null = null;

  if (
    ordenEntradaPico ===
    "primero"
  ) {
    ordenPico = 1;
  } else if (
    ordenEntradaPico ===
    "segundo"
  ) {
    ordenPico = 2;
  }

  añadirPersonal(
    picoSeleccionado,
    "PICO",
    "pico",
    ordenPico
  );
}
      /* ---------------------------------------------------
         8. SEGURIDAD
      --------------------------------------------------- */

      seleccionesSeguridad.forEach(
        (usuarioId, indice) => {
          if (!usuarioId) return;

          añadirPersonal(
            usuarioId,
            "SEGURIDAD",
            "seguridad",
            indice + 1
          );
        }
      );

      /* ---------------------------------------------------
         9. SALA
      --------------------------------------------------- */

      if (salaSeleccionado) {
        añadirPersonal(
          salaSeleccionado,
          "SALA",
          "sala",
          null
        );
      }

      /* ---------------------------------------------------
         10. GUARDAR PERSONAL
      --------------------------------------------------- */

      if (personal.length > 0) {
        const {
          error: errorPersonal,
        } = await supabase
          .from(
            "ordenes_servicio_personal"
          )
          .insert(personal);

        if (errorPersonal) {
          throw errorPersonal;
        }
      }

      /* ---------------------------------------------------
         11. GUARDAR SUSTITUCIÓN DE SALA
      --------------------------------------------------- */

      if (
        salaSeleccionado &&
        salaSeleccionado !==
          POLICIA_PRACTICAS
      ) {
        const usuarioSala =
          usuariosDisponibles.find(
            (usuario) =>
              usuario.id ===
              salaSeleccionado
          );

        if (
          usuarioSala?.es_sustituto_sala ===
          true
        ) {
          const {
            error:
              errorSustitucion,
          } = await supabase
            .from(
              "sustituciones_sala"
            )
            .insert({
              orden_id: ordenId,
              usuario_id:
                usuarioSala.id,
              nombre:
                usuarioSala.nombre,
              fecha,
            });

          if (errorSustitucion) {
            throw errorSustitucion;
          }
        }
      }

      /* ---------------------------------------------------
         12. TODO CORRECTO
      --------------------------------------------------- */

      alert(
        ordenExistenteId
          ? "Orden de servicio actualizada correctamente."
          : "Orden de servicio guardada correctamente."
      );

      router.push(
        "/usuarios/ordenservicio"
      );
    } catch (error) {
      console.error(
        "Error guardando la orden de servicio:",
        error
      );

      alert(
        "No se ha podido guardar la orden de servicio."
      );
    } finally {
      setGuardandoOrden(false);
    }
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-28 pt-5">
      <div className="mx-auto w-full max-w-md">

        {/* =================================================
            TURNO
        ================================================= */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-md">

          <div className="bg-slate-200 px-5 py-3 text-center">
            <p className="text-lg font-bold capitalize text-slate-700">
              {formatearFechaGrande(
                fecha
              )}
            </p>
          </div>

          <div className="border-t border-slate-200" />

          <div className="flex items-center justify-center px-5 py-5">
            <div className="flex items-center justify-center gap-3">

              <p className="text-2xl font-bold text-slate-800">
                {turnoHoy.texto ===
                "Libre"
                  ? "Día Libre"
                  : `Turno de ${turnoHoy.texto}`}
              </p>

              {turnoHoy.icono ===
                "sunrise" && (
                <IconSunrise className="h-9 w-9 shrink-0" />
              )}

              {turnoHoy.icono ===
                "sun" && (
                <IconSun className="h-9 w-9 shrink-0" />
              )}

              {turnoHoy.icono ===
                "moon" && (
                <IconMoon className="h-9 w-9 shrink-0" />
              )}

              {turnoHoy.icono ===
                "free" && (
                <IconFree className="h-9 w-9 shrink-0" />
              )}

            </div>
          </div>
        </div>

        {/* =================================================
            RESPONSABLE
        ================================================= */}

        <section className="mt-7">

          <h2 className="mb-2 flex items-center justify-center gap-2 text-lg font-bold text-slate-800">
            <IconStar className="h-5 w-5" />
            <span>
              Responsable
            </span>
          </h2>

          <div className="rounded-xl bg-white p-3 shadow-sm">

            <select
              value={
                responsableSeleccionado
              }
              onChange={(e) =>
                setResponsableSeleccionado(
                  e.target.value
                )
              }
              disabled={
                cargandoUsuarios
              }
              className="
                w-full
                rounded-lg
                bg-slate-100
                px-3
                py-2
                text-sm
                text-slate-700
                outline-none
              "
            >

              <option value="">
                {cargandoUsuarios
                  ? "Cargando..."
                  : responsablesUnicos.length ===
                      0
                    ? "Sin responsable disponible"
                    : "Seleccionar responsable"}
              </option>

              {responsablesUnicos.map(
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
        </section>

        {/* =================================================
            G.A.C.
        ================================================= */}

        <section className="mt-5">

          <h2 className="mb-2 flex items-center justify-center gap-2 text-lg font-bold text-slate-800">
            <IconCar className="h-5 w-5" />
            <span>G.A.C</span>
          </h2>

          <div className="space-y-2">

            {indicativos.map(
              (
                indicativo,
                indiceIndicativo
              ) => {

                const indicePersona1 =
                  indiceIndicativo * 2;

                const indicePersona2 =
                  indiceIndicativo * 2 +
                  1;

                return (
                  <div
                    key={indicativo}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      bg-white
                      p-3
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        flex
                        w-14
                        shrink-0
                        flex-col
                        items-center
                      "
                    >

                      <span
                        className="
                          text-center
                          text-sm
                          font-bold
                          text-slate-800
                        "
                      >
                        {indicativo}
                      </span>

                      <div
                        className="
                          mt-1
                          flex
                          overflow-hidden
                          rounded-md
                          border
                          border-slate-300
                        "
                      >

                        <button
                          type="button"
                          onClick={() => {
                            setOrdenEntradaGac(
                              (actual) => {
                                const nuevo =
                                  [...actual];

                                nuevo[
                                  indiceIndicativo
                                ] =
                                  nuevo[
                                    indiceIndicativo
                                  ] ===
                                  "primero"
                                    ? ""
                                    : "primero";

                                return nuevo;
                              }
                            );
                          }}
                          className={`
                            flex
                            h-6
                            w-7
                            items-center
                            justify-center
                            text-[10px]
                            font-bold
                            ${
                              ordenEntradaGac[
                                indiceIndicativo
                              ] ===
                              "primero"
                                ? "bg-slate-700 text-white"
                                : "bg-slate-100 text-slate-500"
                            }
                          `}
                        >
                          1º
                        </button>

                        <div className="w-px bg-slate-300" />

                        <button
                          type="button"
                          onClick={() => {
                            setOrdenEntradaGac(
                              (actual) => {
                                const nuevo =
                                  [...actual];

                                nuevo[
                                  indiceIndicativo
                                ] =
                                  nuevo[
                                    indiceIndicativo
                                  ] ===
                                  "segundo"
                                    ? ""
                                    : "segundo";

                                return nuevo;
                              }
                            );
                          }}
                          className={`
                            flex
                            h-6
                            w-7
                            items-center
                            justify-center
                            text-[10px]
                            font-bold
                            ${
                              ordenEntradaGac[
                                indiceIndicativo
                              ] ===
                              "segundo"
                                ? "bg-slate-700 text-white"
                                : "bg-slate-100 text-slate-500"
                            }
                          `}
                        >
                          2º
                        </button>

                      </div>
                    </div>

                    <div className="flex-1 space-y-2">

                      <select
                        value={
                          seleccionesGac[
                            indicePersona1
                          ]
                        }
                        onChange={(e) => {
                          const nuevas =
                            [...seleccionesGac];

                          nuevas[
                            indicePersona1
                          ] =
                            e.target.value;

                          setSeleccionesGac(
                            nuevas
                          );
                        }}
                        disabled={
                          cargandoUsuarios
                        }
                        className="
                          w-full
                          rounded-lg
                          bg-slate-100
                          px-3
                          py-2
                          text-sm
                          text-slate-700
                          outline-none
                        "
                      >

                        <option
                          value={
                            POLICIA_PRACTICAS
                          }
                          className="bg-slate-300 text-slate-700"
                        >
                          Policía en Prácticas
                        </option>

                        <option value="">
                          {cargandoUsuarios
                            ? "Cargando..."
                            : "Seleccionar"}
                        </option>

                        {obtenerOpcionesGac(
                          indicePersona1
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
                              {usuario.nombre}
                            </option>
                          )
                        )}

                      </select>

                      <select
                        value={
                          seleccionesGac[
                            indicePersona2
                          ]
                        }
                        onChange={(e) => {
                          const nuevas =
                            [...seleccionesGac];

                          nuevas[
                            indicePersona2
                          ] =
                            e.target.value;

                          setSeleccionesGac(
                            nuevas
                          );
                        }}
                        disabled={
                          cargandoUsuarios
                        }
                        className="
                          w-full
                          rounded-lg
                          bg-slate-100
                          px-3
                          py-2
                          text-sm
                          text-slate-700
                          outline-none
                        "
                      >

                        <option
                          value={
                            POLICIA_PRACTICAS
                          }
                          className="bg-slate-300 text-slate-700"
                        >
                          Policía en Prácticas
                        </option>

                        <option value="">
                          {cargandoUsuarios
                            ? "Cargando..."
                            : "Seleccionar"}
                        </option>

                        {obtenerOpcionesGac(
                          indicePersona2
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
                              {usuario.nombre}
                            </option>
                          )
                        )}

                      </select>

                    </div>
                  </div>
                );
              }
            )}

          </div>

          {/* =================================================
              PICO
          ================================================= */}

          <div
            className="
              mt-2
              flex
              items-center
              gap-3
              rounded-xl
              bg-white
              p-3
              shadow-sm
            "
          >

           <div
  className="
    flex
    w-14
    shrink-0
    flex-col
    items-center
  "
>
  <span
    className="
      text-center
      text-sm
      font-bold
      text-slate-800
    "
  >
    PICO
  </span>

  <div
    className="
      mt-1
      flex
      overflow-hidden
      rounded-md
      border
      border-slate-300
    "
  >
    <button
      type="button"
      onClick={() => {
        setOrdenEntradaPico(
          (actual) =>
            actual ===
            "primero"
              ? ""
              : "primero"
        );
      }}
      className={`
        flex
        h-6
        w-7
        items-center
        justify-center
        text-[10px]
        font-bold
        ${
          ordenEntradaPico ===
          "primero"
            ? "bg-slate-700 text-white"
            : "bg-slate-100 text-slate-500"
        }
      `}
    >
      1º
    </button>

    <div className="w-px bg-slate-300" />

    <button
      type="button"
      onClick={() => {
        setOrdenEntradaPico(
          (actual) =>
            actual ===
            "segundo"
              ? ""
              : "segundo"
        );
      }}
      className={`
        flex
        h-6
        w-7
        items-center
        justify-center
        text-[10px]
        font-bold
        ${
          ordenEntradaPico ===
          "segundo"
            ? "bg-slate-700 text-white"
            : "bg-slate-100 text-slate-500"
        }
      `}
    >
      2º
    </button>
  </div>
</div>

            <div className="flex-1">

              <select
                value={
                  picoSeleccionado
                }
                onChange={(e) =>
                  setPicoSeleccionado(
                    e.target.value
                  )
                }
                disabled={
                  cargandoUsuarios
                }
                className="
                  w-full
                  rounded-lg
                  bg-slate-100
                  px-3
                  py-2
                  text-sm
                  text-slate-700
                  outline-none
                "
              >

                <option
                  value={
                    POLICIA_PRACTICAS
                  }
                  className="bg-slate-300 text-slate-700"
                >
                  Policía en Prácticas
                </option>

                <option value="">
                  {cargandoUsuarios
                    ? "Cargando..."
                    : "Seleccionar"}
                </option>

                {obtenerOpcionesPico().map(
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

        </section>

        {/* =================================================
            SEGURIDAD
        ================================================= */}

        <section className="mt-5">

          <h2 className="mb-2 flex items-center justify-center gap-2 text-lg font-bold text-slate-800">
            <IconShield className="h-5 w-5" />
            <span>
              Seguridad
            </span>
          </h2>

          <div className="space-y-2">

            {[0, 1, 2].map(
              (indice) => (
                <div
                  key={indice}
                  className="
                    rounded-xl
                    bg-white
                    p-3
                    shadow-sm
                  "
                >

                  <select
                    value={
                      seleccionesSeguridad[
                        indice
                      ]
                    }
                    onChange={(e) => {
                      const nuevas =
                        [...seleccionesSeguridad];

                      nuevas[indice] =
                        e.target.value;

                      setSeleccionesSeguridad(
                        nuevas
                      );
                    }}
                    disabled={
                      cargandoUsuarios
                    }
                    className="
                      w-full
                      rounded-lg
                      bg-slate-100
                      px-3
                      py-2
                      text-sm
                      text-slate-700
                      outline-none
                    "
                  >

                    <option
                      value={
                        POLICIA_PRACTICAS
                      }
                      className="bg-slate-300 text-slate-700"
                    >
                      Policía en Prácticas
                    </option>

                    <option value="">
                      {cargandoUsuarios
                        ? "Cargando..."
                        : "Seleccionar"}
                    </option>

                    {obtenerOpcionesSeguridad(
                      indice
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
                          {usuario.nombre}
                        </option>
                      )
                    )}

                  </select>

                </div>
              )
            )}

          </div>
        </section>

        {/* =================================================
            SALA
        ================================================= */}

        <section className="mt-5">

          <h2 className="mb-2 flex items-center justify-center gap-2 text-lg font-bold text-slate-800">
            <IconMonitor className="h-5 w-5" />
            <span>Sala</span>
          </h2>

          <div className="rounded-xl bg-white p-3 shadow-sm">

            <select
              value={
                salaSeleccionado
              }
              onChange={(e) =>
                setSalaSeleccionado(
                  e.target.value
                )
              }
              disabled={
                cargandoUsuarios
              }
              className="
                w-full
                rounded-lg
                bg-slate-100
                px-3
                py-2
                text-sm
                text-slate-700
                outline-none
              "
            >

              <option
                value={
                  POLICIA_PRACTICAS
                }
                className="bg-slate-300 text-slate-700"
              >
                Policía en Prácticas
              </option>

              <option value="">
                {cargandoUsuarios
                  ? "Cargando..."
                  : "Ninguno definido"}
              </option>

              {opcionesSala.map(
                (usuario) => (
                  <option
                    key={usuario.id}
                    value={usuario.id}
                  >
                    {usuario.nombre}

                    {usuario.es_sustituto_sala
                      ? ` (${
                          numeroSustituciones[
                            usuario.id
                          ] ?? 0
                        } ${
                          (
                            numeroSustituciones[
                              usuario.id
                            ] ?? 0
                          ) === 1
                            ? "sustitución"
                            : "sustituciones"
                        })`
                      : ""}
                  </option>
                )
              )}

            </select>

          </div>
        </section>

        {/* =================================================
            CONFIRMAR
        ================================================= */}

        <button
          type="button"
          onClick={
            guardarOrdenServicio
          }
          disabled={guardandoOrden}
          className="
            mt-7
            w-full
            rounded-2xl
            bg-slate-800
            py-3
            text-lg
            font-semibold
            text-white
            shadow-sm
            transition
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {guardandoOrden
            ? "Guardando..."
            : "Confirmar"}
        </button>

        {/* =================================================
            CANCELAR
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            router.push(
              "/usuarios/ordenservicio"
            )
          }
          className="
            mt-3
            w-full
            rounded-2xl
            border
            border-slate-300
            bg-white
            py-3
            text-lg
            font-semibold
            text-slate-700
            shadow-sm
            transition
            active:scale-[0.98]
          "
        >
          Cancelar
        </button>

      </div>

      <BottomNav />
    </main>
  );
}