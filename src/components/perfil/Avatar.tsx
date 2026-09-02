
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AvatarProps = {
  usuarioId: string;
  avatarUrl: string | null;
};

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

function IconUser({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </SvgIcon>
  );
}

function IconPencil({ className }: IconProps) {
  return (
    <SvgIcon className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </SvgIcon>
  );
}

async function comprimirImagen(
  archivo: File,
  maxKB = 75
): Promise<Blob> {
  const imagen = new Image();

  const url = URL.createObjectURL(archivo);

  await new Promise<void>((resolve, reject) => {
    imagen.onload = () => resolve();
    imagen.onerror = reject;
    imagen.src = url;
  });

  URL.revokeObjectURL(url);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No se pudo preparar la imagen.");
  }

  const maxLado = 1000;

  let ancho = imagen.width;
  let alto = imagen.height;

  if (ancho > maxLado || alto > maxLado) {
    if (ancho > alto) {
      alto = Math.round((alto * maxLado) / ancho);
      ancho = maxLado;
    } else {
      ancho = Math.round((ancho * maxLado) / alto);
      alto = maxLado;
    }
  }

  canvas.width = ancho;
  canvas.height = alto;

  ctx.drawImage(imagen, 0, 0, ancho, alto);

  let calidad = 0.8;
  let blob: Blob | null = null;

  while (calidad >= 0.2) {
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", calidad)
    );

    if (blob && blob.size <= maxKB * 1024) {
      return blob;
    }

    calidad -= 0.1;
  }

  if (!blob) {
    throw new Error("No se pudo comprimir la imagen.");
  }

  return blob;
}

export default function Avatar({
  usuarioId,
  avatarUrl,
}: AvatarProps) {
  const [avatar, setAvatar] = useState<string | null>(avatarUrl);
const [avatarCargando, setAvatarCargando] = useState(true);
  const [avatarNombreArchivo, setAvatarNombreArchivo] =
    useState<string | null>(null);

  const [subiendoAvatar, setSubiendoAvatar] = useState(false);
  const [mostrarMenuAvatar, setMostrarMenuAvatar] = useState(false);
  const [mostrarAvatarGrande, setMostrarAvatarGrande] = useState(false);

  /*
   * RECORTADOR
   */
  const [imagenParaRecortar, setImagenParaRecortar] =
    useState<string | null>(null);

  const [zoom, setZoom] = useState(1);

  const [posicion, setPosicion] = useState({
    x: 0,
    y: 0,
  });

  const [arrastrando, setArrastrando] = useState(false);

  const [inicioArrastre, setInicioArrastre] = useState({
    x: 0,
    y: 0,
  });

  const [posicionInicio, setPosicionInicio] = useState({
    x: 0,
    y: 0,
  });

  /*
   * Cargar avatar desde Supabase
   */
  useEffect(() => {
    async function cargarAvatar() {
      if (!usuarioId) return;

      try {
        const { data: perfil, error } = await supabase
          .from("usuarios")
          .select("avatar_url")
          .eq("id", usuarioId)
          .single();

        if (error) {
          console.error(
            "ERROR OBTENIENDO AVATAR DEL PERFIL:",
            error
          );
          return;
        }

        if (!perfil?.avatar_url) {
          setAvatar(null);
          setAvatarNombreArchivo(null);
          return;
        }

        setAvatarNombreArchivo(perfil.avatar_url);

        const {
          data: avatarData,
          error: avatarError,
        } = await supabase.storage
          .from("avatars")
          .createSignedUrl(
            perfil.avatar_url,
            60 * 60
          );

        if (avatarError) {
          console.error(
            "ERROR OBTENIENDO URL DEL AVATAR:",
            avatarError
          );
          return;
        }
setAvatarCargando(true);
        setAvatar(
          `${avatarData.signedUrl}&t=${Date.now()}`
        );
      } catch (error) {
        console.error(
          "ERROR CARGANDO AVATAR:",
          error
        );
      }
    }

    cargarAvatar();
  }, [usuarioId]);

  /*
   * Cuando el usuario selecciona una imagen,
   * NO se sube todavía.
   *
   * Primero abrimos el recortador.
   */
  function seleccionarImagen(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      alert("Selecciona una imagen.");
      e.target.value = "";
      return;
    }

    if (!usuarioId) {
      alert("No se ha encontrado el usuario.");
      e.target.value = "";
      return;
    }

    const url = URL.createObjectURL(archivo);

    setImagenParaRecortar(url);

    /*
     * IMPORTANTE:
     * Empezamos siempre en 1x.
     * La imagen se adapta visualmente al
     * área del recortador mediante object-contain.
     */
    setZoom(1);

    setPosicion({
      x: 0,
      y: 0,
    });

    e.target.value = "";
  }

  /*
   * Confirmar recorte
   */
  async function confirmarRecorte() {
    if (!imagenParaRecortar || !usuarioId) {
      return;
    }

    try {
     setSubiendoAvatar(true);
setAvatarCargando(true);

      const imagen = new Image();

      await new Promise<void>((resolve, reject) => {
        imagen.onload = () => resolve();
        imagen.onerror = reject;
        imagen.src = imagenParaRecortar;
      });

      /*
       * Tamaño final del avatar.
       */
      const tamaño = 400;

      const canvas = document.createElement("canvas");
      canvas.width = tamaño;
      canvas.height = tamaño;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error(
          "No se pudo preparar el recorte."
        );
      }

      /*
       * Calculamos la escala necesaria para
       * cubrir completamente el círculo.
       *
       * Esto evita huecos blancos.
       */
      const escalaBase = Math.max(
        tamaño / imagen.width,
        tamaño / imagen.height
      );

      const escala = escalaBase * zoom;

      const anchoFinal = imagen.width * escala;
      const altoFinal = imagen.height * escala;

      /*
       * Posición centrada + desplazamiento del usuario.
       */
      const x =
        (tamaño - anchoFinal) / 2 +
        posicion.x;

      const y =
        (tamaño - altoFinal) / 2 +
        posicion.y;

      /*
       * Fondo blanco para evitar transparencias
       * extrañas en algunas imágenes.
       */
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, tamaño, tamaño);

      ctx.drawImage(
        imagen,
        x,
        y,
        anchoFinal,
        altoFinal
      );

      /*
       * Crear Blob JPEG.
       */
      const blob = await new Promise<Blob | null>(
        (resolve) =>
          canvas.toBlob(
            resolve,
            "image/jpeg",
            0.9
          )
      );

      if (!blob) {
        throw new Error(
          "No se pudo crear la imagen recortada."
        );
      }

      /*
       * Nombre único.
       */
      const nombreArchivo =
        `${usuarioId}/avatar-${Date.now()}.jpg`;

      /*
       * Foto anterior.
       */
      const avatarAnterior =
        avatarNombreArchivo;

      /*
       * Subimos primero la nueva foto.
       * Así nunca dejamos al usuario sin avatar
       * si la subida nueva falla.
       */
      const {
        error: errorSubida,
      } = await supabase.storage
        .from("avatars")
        .upload(
          nombreArchivo,
          blob,
          {
            upsert: true,
            contentType: "image/jpeg",
          }
        );

      if (errorSubida) {
        console.error(
          "ERROR SUBIENDO AVATAR:",
          errorSubida
        );

        alert(
          "No se ha podido subir la foto."
        );

        return;
      }

      /*
       * Guardar nueva referencia.
       */
      const {
        error: errorPerfil,
      } = await supabase
        .from("usuarios")
        .update({
          avatar_url: nombreArchivo,
        })
        .eq("id", usuarioId);

      if (errorPerfil) {
        console.error(
          "ERROR GUARDANDO AVATAR EN USUARIO:",
          errorPerfil
        );

        await supabase.storage
          .from("avatars")
          .remove([nombreArchivo]);

        alert(
          "La foto se subió, pero no se pudo guardar el perfil."
        );

        return;
      }

      /*
       * Crear URL firmada.
       */
      const {
        data: avatarData,
        error: avatarError,
      } = await supabase.storage
        .from("avatars")
        .createSignedUrl(
          nombreArchivo,
          60 * 60
        );

      if (avatarError) {
        console.error(
          "ERROR OBTENIENDO AVATAR:",
          avatarError
        );

        alert(
          "La foto se guardó, pero no se pudo mostrar."
        );

        return;
      }

      /*
       * Mostrar nueva imagen.
       */
      setAvatar(
        `${avatarData.signedUrl}&t=${Date.now()}`
      );

      setAvatarNombreArchivo(
        nombreArchivo
      );

      /*
       * Ahora sí podemos borrar la anterior.
       */
      if (avatarAnterior) {
        const {
          error: errorBorrando,
        } = await supabase.storage
          .from("avatars")
          .remove([avatarAnterior]);

        if (errorBorrando) {
          console.error(
            "ERROR BORRANDO AVATAR ANTERIOR:",
            errorBorrando
          );
        }
      }

      /*
       * Cerrar recortador.
       */
      URL.revokeObjectURL(
        imagenParaRecortar
      );

      setImagenParaRecortar(null);

      setZoom(1);

      setPosicion({
        x: 0,
        y: 0,
      });
    } catch (error) {
      console.error(
        "ERROR CAMBIANDO AVATAR:",
        error
      );

      alert(
        "Ha ocurrido un error al cambiar la foto."
      );
    } finally {
      setSubiendoAvatar(false);
    }
  }

  /*
   * Cancelar recorte.
   */
  function cancelarRecorte() {
    if (imagenParaRecortar) {
      URL.revokeObjectURL(
        imagenParaRecortar
      );
    }

    setImagenParaRecortar(null);

    setZoom(1);

    setPosicion({
      x: 0,
      y: 0,
    });
  }

  /*
   * Arrastrar imagen.
   */
  function comenzarArrastre(
    e: React.PointerEvent<HTMLDivElement>
  ) {
    e.currentTarget.setPointerCapture(
      e.pointerId
    );

    setArrastrando(true);

    setInicioArrastre({
      x: e.clientX,
      y: e.clientY,
    });

    setPosicionInicio({
      ...posicion,
    });
  }

  function moverImagen(
    e: React.PointerEvent<HTMLDivElement>
  ) {
    if (!arrastrando) return;

    const deltaX =
      e.clientX - inicioArrastre.x;

    const deltaY =
      e.clientY - inicioArrastre.y;

    /*
     * Limitamos el movimiento para que nunca
     * se pueda sacar completamente la imagen.
     */
    const limite = 180;

    const nuevoX = Math.max(
      -limite,
      Math.min(
        limite,
        posicionInicio.x + deltaX
      )
    );

    const nuevoY = Math.max(
      -limite,
      Math.min(
        limite,
        posicionInicio.y + deltaY
      )
    );

    setPosicion({
      x: nuevoX,
      y: nuevoY,
    });
  }

  function terminarArrastre() {
    setArrastrando(false);
  }

  /*
   * Eliminar avatar.
   */
  async function eliminarAvatar() {
    if (!usuarioId) return;

    if (!avatarNombreArchivo) {
      alert(
        "No se ha encontrado la foto actual."
      );
      return;
    }

    try {
      setSubiendoAvatar(true);
      setMostrarMenuAvatar(false);

      const {
        error: errorStorage,
      } = await supabase.storage
        .from("avatars")
        .remove([
          avatarNombreArchivo,
        ]);

      if (errorStorage) {
        console.error(
          "ERROR ELIMINANDO AVATAR:",
          errorStorage
        );

        alert(
          "No se ha podido eliminar la foto."
        );

        return;
      }

      const {
        error: errorPerfil,
      } = await supabase
        .from("usuarios")
        .update({
          avatar_url: null,
        })
        .eq("id", usuarioId);

      if (errorPerfil) {
        console.error(
          "ERROR QUITANDO AVATAR DEL PERFIL:",
          errorPerfil
        );

        alert(
          "La foto se eliminó, pero no se pudo actualizar el perfil."
        );

        return;
      }

      setAvatar(null);
      setAvatarNombreArchivo(null);
    } catch (error) {
      console.error(
        "ERROR ELIMINANDO AVATAR:",
        error
      );

      alert(
        "Ha ocurrido un error al eliminar la foto."
      );
    } finally {
      setSubiendoAvatar(false);
    }
  }

  return (
    <>
      {/* =========================
          AVATAR
      ========================= */}

      <div className="relative shrink-0">

        {/* FOTO / AVATAR */}

        <button
          type="button"
          disabled={!avatar}
          onClick={() => {
            if (avatar) {
              setMostrarAvatarGrande(true);
            }
          }}
         className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400 ring-1 ring-slate-200 transition active:scale-95 disabled:cursor-default"
          aria-label={
            avatar
              ? "Ver foto de perfil"
              : "Sin foto de perfil"
          }
        >
      {avatar ? (
  <>
    {avatarCargando && (
      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-100">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
      </div>
    )}

    <img
      src={avatar}
      alt="Foto de perfil"
      onLoad={() => setAvatarCargando(false)}
      onError={() => setAvatarCargando(false)}
      className={`h-full w-full object-cover ${
        avatarCargando ? "opacity-0" : "opacity-100"
      } transition-opacity duration-200`}
    />
  </>
) : (
  <IconUser className="h-16 w-16" />
)}
        </button>

        {/* =========================
            INPUT OCULTO
        ========================= */}

        <input
          id={`avatar-input-${usuarioId}`}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={subiendoAvatar}
          onChange={seleccionarImagen}
        />

        {/* =========================
            BOTÓN EDITAR
        ========================= */}

        <div className="absolute bottom-0 right-0">

          <button
            type="button"
            disabled={subiendoAvatar}
            onClick={() =>
              setMostrarMenuAvatar(
                !mostrarMenuAvatar
              )
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg ring-4 ring-white transition hover:bg-slate-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Editar avatar"
          >
            <IconPencil className="h-4 w-4" />
          </button>

          {/* =========================
              MENÚ DEL LÁPIZ
          ========================= */}

          {mostrarMenuAvatar && (
            <div className="absolute left-0 top-11 z-50 w-40 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-200">

              <button
                type="button"
                disabled={subiendoAvatar}
                onClick={() => {
                  setMostrarMenuAvatar(false);

                  document
                    .getElementById(
                      `avatar-input-${usuarioId}`
                    )
                    ?.click();
                }}
                className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Añadir foto
              </button>

              {avatar && (
                <button
                  type="button"
                  disabled={subiendoAvatar}
                  onClick={eliminarAvatar}
                  className="flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  Eliminar foto
                </button>
              )}

            </div>
          )}

        </div>
      </div>

      {/* =========================
          RECORTADOR
      ========================= */}

      {imagenParaRecortar && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4">

          <div className="flex w-full max-w-md flex-col rounded-3xl bg-white p-5 shadow-2xl">

            {/* TÍTULO */}

            <div className="mb-4 text-center">
              <h2 className="text-lg font-semibold text-slate-900">
                Ajusta tu foto
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Arrastra la imagen para colocarla
                como quieras dentro del círculo.
              </p>
            </div>

            {/* =========================
                ÁREA DE RECORTE
            ========================= */}

            <div
              className="relative mx-auto h-[min(75vw,360px)] w-[min(75vw,360px)] max-h-[360px] max-w-[360px] overflow-hidden rounded-2xl bg-slate-950 touch-none select-none"
              onPointerDown={comenzarArrastre}
              onPointerMove={moverImagen}
              onPointerUp={terminarArrastre}
              onPointerCancel={terminarArrastre}
              onPointerLeave={() => {
                if (arrastrando) {
                  terminarArrastre();
                }
              }}
            >

              {/* IMAGEN */}

              <img
                src={imagenParaRecortar}
                alt="Imagen para recortar"
                draggable={false}
                className="absolute left-1/2 top-1/2 max-h-full max-w-full select-none object-contain"
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `
                    translate(
                      calc(-50% + ${posicion.x}px),
                      calc(-50% + ${posicion.y}px)
                    )
                    scale(${zoom})
                  `,
                  transformOrigin:
                    "center center",
                  transition: arrastrando
                    ? "none"
                    : "transform 0.15s ease-out",
                }}
              />

              {/* OSCURECER EXTERIOR */}

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at center, transparent 0, transparent 38%, rgba(0,0,0,0.58) 38.5%, rgba(0,0,0,0.58) 100%)",
                }}
              />

              {/* CÍRCULO */}

              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />

              {/* TEXTO */}

              <div className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs font-medium text-white drop-shadow-lg">
                Arrastra para centrar
              </div>
            </div>

            {/* =========================
                ZOOM
            ========================= */}

            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Zoom
                </span>

                <span className="font-semibold text-slate-900">
                  {zoom.toFixed(1)}×
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => {
                  setZoom(
                    Math.min(
                      3,
                      Math.max(
                        1,
                        Number(e.target.value)
                      )
                    )
                  );
                }}
                className="w-full accent-slate-800"
              />

              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>1×</span>
                <span>3×</span>
              </div>
            </div>

            {/* =========================
                BOTONES
            ========================= */}

            <div className="mt-5 flex gap-3">

              <button
                type="button"
                disabled={subiendoAvatar}
                onClick={cancelarRecorte}
                className="flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={subiendoAvatar}
                onClick={confirmarRecorte}
                className="flex-1 rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {subiendoAvatar
                  ? "Guardando..."
                  : "Guardar foto"}
              </button>

            </div>

          </div>
        </div>
      )}

      {/* =========================
          FOTO GRANDE
      ========================= */}

      {mostrarAvatarGrande && avatar && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() =>
            setMostrarAvatarGrande(false)
          }
        >

          <div
            className="relative w-full max-w-md"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* BOTÓN CERRAR */}

            <button
              type="button"
              onClick={() =>
                setMostrarAvatarGrande(false)
              }
              className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-slate-100 active:scale-95"
              aria-label="Cerrar foto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m6 6 12 12" />
                <path d="m18 6-12 12" />
              </svg>
            </button>

            {/* FOTO GRANDE */}

            <div className="aspect-square w-full overflow-hidden rounded-3xl bg-slate-100 shadow-2xl">
              <img
                src={avatar}
                alt="Foto de perfil ampliada"
                className="h-full w-full object-cover"
              />
            </div>

          </div>
        </div>
      )}
    </>
  );
}