import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import BottomNav from "@/components/navigation/BottomNav";
import EditUserForm from "@/components/forms/EditUserForm";

const USUARIO_PROTEGIDO =
  "2350c111-c7bb-40c2-9bb1-b2cc172684fa";

export default async function EditarUsuario({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const supabase = await supabaseServer();

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", id)
    .single();

  let email = "No disponible";

  if (usuario) {
    const { data } =
      await supabaseAdmin.auth.admin.getUserById(
        usuario.id
      );

    email = data.user?.email ?? "No disponible";
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      {/* =========================
          CABECERA
      ========================= */}

      <div className="flex items-center gap-3">

        {/* Icono editar */}

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-8 w-8 text-slate-800"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20h9"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z"
          />
        </svg>

        <h1 className="text-3xl font-bold text-slate-800">
          Editar usuario
        </h1>

      </div>

      <p className="mt-2 text-slate-500">
        Modifica la información del usuario.
      </p>


      {usuario && (
        <>

          {/* =========================
              INFORMACIÓN DE CUENTA
          ========================= */}

          <div className="mt-8 rounded-3xl bg-white p-6 shadow">

            <div className="flex items-center gap-3">

              {/* Icono persona */}

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6 text-slate-700"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5"
                />
              </svg>

              <h2 className="text-xl font-bold">
                Información de cuenta
              </h2>

            </div>


            <div className="mt-5 space-y-4">

              {/* =========================
                  NOMBRE
              ========================= */}

              <div>

                <p className="text-sm text-slate-500">
                  Nombre
                </p>

                <p className="text-lg font-semibold">
                  {usuario.nombre}
                </p>

              </div>


              {/* =========================
                  EMAIL
              ========================= */}

              <div>

                <p className="text-sm text-slate-500">
                  Correo electrónico
                </p>

                <p className="text-lg font-semibold">
                  {email}
                </p>

              </div>


              {/* =========================
                  ROL
              ========================= */}

              <div>

                <p className="text-sm text-slate-500">
                  Rol
                </p>

                <div className="mt-1 flex items-center gap-2">

                  {usuario.rol === "admin" ? (

                    /* CORONA ADMINISTRADOR */

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-amber-500"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 7l4 4 4-7 4 7 4-4-2 11H6L4 7Z"
                      />

                      <path
                        strokeLinecap="round"
                        d="M6 21h12"
                      />
                    </svg>

                  ) : (

                    /* PERSONA USUARIO */

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-slate-600"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="8"
                        r="3.5"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 20c.8-3.2 3.2-5 7-5s6.2 1.8 7 5"
                      />
                    </svg>

                  )}

                  <p className="text-lg font-semibold">
                    {usuario.rol === "admin"
                      ? "Administrador"
                      : "Usuario"}
                  </p>

                </div>

              </div>


              {/* =========================
                  CATEGORÍA
              ========================= */}

              <div>

                <p className="text-sm text-slate-500">
                  Categoría
                </p>

                <div className="mt-1 flex items-center gap-2">

                  {usuario.categoria === "oficial" ? (

                    /* ESTRELLA OFICIAL */

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-amber-500"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m12 3 2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7L12 3Z"
                      />
                    </svg>

                  ) : usuario.categoria === "policia" ? (

                    /* PLACA POLICÍA */

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-slate-700"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3 5 6v6c0 4.2 2.7 7.2 7 9 4.3-1.8 7-4.8 7-9V6l-7-3Z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 10h6M9 13h6M10 16h4"
                      />
                    </svg>

                  ) : (

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-slate-600"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="8"
                      />
                    </svg>

                  )}

                  <p className="text-lg font-semibold">
                    {usuario.categoria === "oficial"
                      ? "Oficial de Policía"
                      : usuario.categoria === "policia"
                      ? "Policía"
                      : "—"}
                  </p>

                </div>

              </div>


              {/* =========================
                  PUESTO
              ========================= */}

              <div>

                <p className="text-sm text-slate-500">
                  Puesto
                </p>

                <div className="mt-1 flex items-center gap-2">

                  {usuario.puesto === "gac" && (

                    /* COCHE G.A.C */

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-slate-700"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 17h18"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 17V9h9l3 3h2v5"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 9l2-4h5l2 4"
                      />

                      <circle
                        cx="7"
                        cy="17"
                        r="2"
                      />

                      <circle
                        cx="17"
                        cy="17"
                        r="2"
                      />
                    </svg>

                  )}

                  {usuario.puesto === "seguridad" && (

                    /* ESCUDO SEGURIDAD */

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-slate-700"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 12 2 2 4-4"
                      />
                    </svg>

                  )}

                  {usuario.puesto === "sala" && (

                    /* PC SALA */

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-slate-700"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="13"
                        rx="2"
                      />

                      <path
                        strokeLinecap="round"
                        d="M8 21h8M12 17v4"
                      />
                    </svg>

                  )}

                  <p className="text-lg font-semibold">
                    {usuario.puesto === "gac"
                      ? "G.A.C"
                      : usuario.puesto === "seguridad"
                      ? "Seguridad"
                      : usuario.puesto === "sala"
                      ? "Sala"
                      : "—"}
                  </p>

                </div>

              </div>


              {/* =========================
                  SEXO
              ========================= */}

              <div>

                <p className="text-sm text-slate-500">
                  Sexo
                </p>

                <div className="mt-1 flex items-center gap-2">

                  {usuario.sexo === "mujer" ? (

                    /* SÍMBOLO MUJER */

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-slate-700"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="7"
                        r="3.5"
                      />

                      <path
                        strokeLinecap="round"
                        d="M12 10.5v8"
                      />

                      <path
                        strokeLinecap="round"
                        d="M9 15h6"
                      />
                    </svg>

                  ) : (

                    /* SÍMBOLO HOMBRE */

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5 text-slate-700"
                      aria-hidden="true"
                    >
                      <circle
                        cx="10"
                        cy="14"
                        r="4"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m13 11 6-6"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5h5v5"
                      />
                    </svg>

                  )}

                  <p className="text-lg font-semibold">
                    {usuario.sexo === "mujer"
                      ? "Mujer"
                      : "Hombre"}
                  </p>

                </div>

              </div>


              {/* =========================
                  ESTADO
              ========================= */}

              <div>

                <p className="text-sm text-slate-500">
                  Estado
                </p>

                <div className="mt-1 flex items-center gap-2">

                  {/* CÍRCULO VECTORIAL */}

                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`h-4 w-4 ${
                      usuario.activo
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="7"
                    />
                  </svg>

                  <p className="text-lg font-semibold">
                    {usuario.activo
                      ? "Activo"
                      : "Inactivo"}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* =========================
              EDITAR DATOS
          ========================= */}

          <div className="mt-6">

            <EditUserForm
              usuario={usuario}
              protegido={
                usuario.id === USUARIO_PROTEGIDO
              }
            />

          </div>

        </>
      )}


      <BottomNav />

    </main>
  );
}