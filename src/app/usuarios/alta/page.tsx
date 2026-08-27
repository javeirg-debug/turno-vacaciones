import AddUserForm from "@/components/forms/AddUserForm";
import BottomNav from "@/components/navigation/BottomNav";

export default function AltaUsuarios() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-800">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <circle cx="9" cy="8" r="3.5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 20a6 6 0 0 1 12 0"
          />
          <path
            strokeLinecap="round"
            d="M18 11v6M15 14h6"
          />
        </svg>

        Alta de usuarios
      </h1>

      <p className="mt-2 text-slate-500">
        Crear nuevos usuarios para la aplicación.
      </p>

        <AddUserForm />
     

      <BottomNav />

    </main>
  );
}