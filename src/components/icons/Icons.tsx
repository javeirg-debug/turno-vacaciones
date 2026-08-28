import {
  Palmtree,
  CircleCheckBig,
  Clock3,
  HeartPulse,
  Siren,
  TreePine,
  Cross,
  Baby,
  Milk,
  ClipboardList,
} from "lucide-react";

export const iconosPermisos = {
  Vacaciones: Palmtree,
  "Asunto propio": CircleCheckBig,
  "Compensación horaria": Clock3,
  Indisposición: HeartPulse,
  "Permiso urgente": Siren,
  Navidad: TreePine,
  "Semana Santa": Cross,
  Paternidad: Baby,
  Maternidad: Baby,
  Lactancia: Milk,
  "Otros permisos": ClipboardList,
} as const;

export type TipoPermiso = keyof typeof iconosPermisos;