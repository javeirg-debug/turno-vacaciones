import { supabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function ActivarUsuario({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {

  const { id } = await params;

  const supabase = await supabaseServer();

  const { error } = await supabase
    .from("usuarios")
    .update({
      activo: true,
    })
    .eq("id", id);

  if (error) {

    console.error(error);

  }

  redirect("/usuarios/inactivos");

}