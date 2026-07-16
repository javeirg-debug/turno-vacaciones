import AddUserForm from "@/components/forms/AddUserForm";
import BottomNav from "@/components/navigation/BottomNav";

export default function AltaUsuarios() {

  return (

    <main className="min-h-screen bg-slate-100 p-6 pb-24">

      <h1 className="text-3xl font-bold text-slate-800">
        ➕ Alta de usuarios
      </h1>

      <p className="mt-2 text-slate-500">
        Crear nuevos usuarios para la aplicación.
      </p>


      <div className="mt-8 rounded-3xl bg-white p-6 shadow">

        <AddUserForm />

      </div>


      <BottomNav />

    </main>

  );

}