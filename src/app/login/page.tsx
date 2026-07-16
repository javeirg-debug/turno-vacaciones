"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { iniciarSesion } from "@/services/auth";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar() {

    try {

      setCargando(true);
      setError("");

      await iniciarSesion(
        email,
        password
      );

      router.push("/inicio");

    } catch (e: unknown) {

      console.error(e);

      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Usuario o contraseña incorrectos");
      }

    } finally {

      setCargando(false);

    }

  }

  return (

    <main className="min-h-screen bg-slate-100 p-6 flex items-center">

      <div className="w-full rounded-3xl bg-white p-6 shadow">

        <h1 className="text-3xl font-bold">
          🔐 Acceso
        </h1>

        <div className="mt-6 space-y-4">

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border p-3"
          />

          {error && (
            <p className="text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={entrar}
            disabled={cargando}
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold"
          >
            {cargando
              ? "Entrando..."
              : "Entrar"}
          </button>

          <p className="mt-4 text-center text-sm text-slate-500">
            ¿No recuerdas tu contraseña?
            <br />
            Contacta con el administrador.
          </p>

        </div>

      </div>

    </main>

  );

}