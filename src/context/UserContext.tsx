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

    const datos = await datosUsuarioActual();


    setUsuario(datos);



    if (datos) {


      // Si tiene que cambiar contraseña,
      // tiene prioridad

      if (datos.debe_cambiar_clave) {

        router.push(
          "/cambiar-clave?obligatorio=true"
        );

        setCargando(false);

        return;

      }



      // Si ya está logueado y entra al login,
      // lo mandamos al inicio

      if (pathname === "/login") {

        router.push("/inicio");

      }


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