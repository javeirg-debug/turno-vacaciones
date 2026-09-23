"use client";

import {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";
import { datosUsuarioActual } from "@/services/auth";

export const UserContext = createContext<any>(null);

export function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [usuario, setUsuario] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  async function cargarUsuario() {
    setCargando(true);

    const datos = await datosUsuarioActual();

    setUsuario(datos);

    // NO HAY USUARIO
    if (!datos) {
      if (pathname !== "/login") {
        router.replace("/login");
        return;
      }

      setCargando(false);
      return;
    }

    // USUARIO INACTIVO
    if (datos.activo !== true) {
      await supabase.auth.signOut();

      setUsuario(null);

      router.replace("/login");

      return;
    }

    // CAMBIO OBLIGATORIO DE CONTRASEÑA
    if (
      datos.debe_cambiar_clave &&
      pathname !== "/cambiar-clave"
    ) {
      router.replace(
        "/cambiar-clave?obligatorio=true"
      );

      setCargando(false);

      return;
    }

    // USUARIO AUTENTICADO Y ACTIVO
    // Si intenta entrar al login, lo mandamos al inicio.
    if (pathname === "/login") {
      router.replace("/inicio");

      setCargando(false);

      return;
    }

    setCargando(false);
  }

  useEffect(() => {
    cargarUsuario();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      cargarUsuario();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  return (
    <UserContext.Provider
      value={{
        usuario,
        cargarUsuario,
      }}
    >
      {!cargando && children}
    </UserContext.Provider>
  );
}