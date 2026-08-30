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
  maxKB = 200
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
  const [avatarNombreArchivo, setAvatarNombreArchivo] =
    useState<string | null>(null);

  const [subiendoAvatar, setSubiendoAvatar] = useState(false);
  const [mostrarMenuAvatar, setMostrarMenuAvatar] = useState(false);

  /*
   * Cargar la referencia real del avatar desde el perfil.
   *
   * avatarUrl puede ser:
   * - null
   * - una ruta de Supabase Storage
   * - una URL ya preparada
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

        const { data: avatarData, error: avatarError } =
          await supabase.storage
            .from("avatars")
            .createSignedUrl(perfil.avatar_url, 60 * 60);

        if (avatarError) {
          console.error(
            "ERROR OBTENIENDO URL DEL AVATAR:",
            avatarError
          );
          return;
        }

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

  async function cambiarAvatar(
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

    try {
      setSubiendoAvatar(true);

      /*
       * IMPORTANTE:
       * Guardamos primero el nombre de la foto actual.
       */
      const avatarAnterior = avatarNombreArchivo;

      /*
       * 1. Si existe una foto anterior,
       *    la borramos PRIMERO.
       */
      if (avatarAnterior) {
        const { error: errorBorrando } =
          await supabase.storage
            .from("avatars")
            .remove([avatarAnterior]);

        if (errorBorrando) {
          console.error(
            "ERROR BORRANDO AVATAR ANTERIOR:",
            errorBorrando
          );

          alert(
            "No se ha podido eliminar la foto anterior."
          );

          return;
        }

        /*
         * Quitamos inmediatamente la referencia
         * anterior de la base de datos.
         */
        const { error: errorPerfilAnterior } =
          await supabase
            .from("usuarios")
            .update({
              avatar_url: null,
            })
            .eq("id", usuarioId);

        if (errorPerfilAnterior) {
          console.error(
            "ERROR QUITANDO AVATAR ANTERIOR DEL PERFIL:",
            errorPerfilAnterior
          );

          alert(
            "No se pudo actualizar el perfil."
          );

          return;
        }

        setAvatar(null);
        setAvatarNombreArchivo(null);
      }

      /*
       * 2. Comprimir la nueva imagen.
       */
      const imagenComprimida =
        await comprimirImagen(archivo, 200);

      /*
       * 3. Crear nombre único.
       */
      const nombreArchivo =
        `${usuarioId}/avatar-${Date.now()}.jpg`;

      /*
       * 4. Subir la nueva imagen.
       */
      const { error: errorSubida } =
        await supabase.storage
          .from("avatars")
          .upload(
            nombreArchivo,
            imagenComprimida,
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
       * 5. Guardar la nueva referencia
       *    en el perfil.
       */
      const { error: errorPerfil } =
        await supabase
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

        alert(
          "La foto se subió, pero no se pudo guardar el perfil."
        );

        /*
         * Si falla la base de datos intentamos
         * eliminar la foto recién subida para
         * no dejar basura en Storage.
         */
        await supabase.storage
          .from("avatars")
          .remove([nombreArchivo]);

        return;
      }

      /*
       * 6. Crear URL firmada.
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
       * 7. Mostrar inmediatamente
       *    la nueva foto.
       */
      setAvatar(
        `${avatarData.signedUrl}&t=${Date.now()}`
      );

      /*
       * 8. Guardar la nueva referencia.
       */
      setAvatarNombreArchivo(nombreArchivo);

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

      /*
       * Permite volver a seleccionar
       * la misma foto.
       */
      e.target.value = "";
    }
  }

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

      /*
       * 1. Borrar foto de Storage.
       */
      const { error: errorStorage } =
        await supabase.storage
          .from("avatars")
          .remove([avatarNombreArchivo]);

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

      /*
       * 2. Quitar referencia del perfil.
       */
      const { error: errorPerfil } =
        await supabase
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

      /*
       * 3. Actualizar interfaz.
       */
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
    <div className="relative shrink-0">

      {/* AVATAR */}
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400 ring-1 ring-slate-200">

        {avatar ? (
          <img
            src={avatar}
            alt="Foto de perfil"
            className="h-full w-full object-cover"
          />
        ) : (
          <IconUser className="h-16 w-16" />
        )}

      </div>

      {/* INPUT OCULTO */}
      <input
        id={`avatar-input-${usuarioId}`}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={subiendoAvatar}
        onChange={cambiarAvatar}
      />

      {/* BOTÓN EDITAR */}
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

        {/* MENÚ */}
        {mostrarMenuAvatar && (
          <div className="absolute left-0 top-11 z-50 w-40 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-200">

            {/* AÑADIR FOTO */}
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

            {/* ELIMINAR FOTO */}
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
  );
}