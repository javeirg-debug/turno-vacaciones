"use client";

import React from "react";

/* =========================================================
   TIPOS
========================================================= */

type IconProps = {
  className?: string;
};

/* =========================================================
   ICONO USUARIO
========================================================= */

export function IconUser({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.5 3.2-5.5 7-5.5s6.2 2 7 5.5" />
    </svg>
  );
}

/* =========================================================
   LÁPIZ
========================================================= */

export function IconPencil({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

/* =========================================================
   INFORMACIÓN
========================================================= */

export function IconInfo({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <circle
        cx="12"
        cy="7"
        r=".8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/* =========================================================
   CORONA / ADMINISTRADOR
========================================================= */

export function IconCrown({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m4 8 3 3 5-6 5 6 3-3-1.5 10h-15Z" />
      <path d="M6 21h12" />
    </svg>
  );
}

/* =========================================================
   POLICÍA
========================================================= */

export function IconPolice({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3 5 6v5c0 4.4 2.8 8.1 7 10 4.2-1.9 7-5.6 7-10V6Z" />
      <path d="M9 10h6" />
      <path d="M10 13h4" />
    </svg>
  );
}

/* =========================================================
   COCHE / G.A.C
========================================================= */

export function IconCar({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 17h14" />
      <path d="m6 17-1-5 2-5h10l2 5-1 5" />
      <path d="M7 7h10" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
      <path d="M5 12h14" />
    </svg>
  );
}

/* =========================================================
   RELOJ
========================================================= */

export function IconClock({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

/* =========================================================
   AVISOS / ALERTA
========================================================= */

export function IconAlert({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3 2.8 20h18.4Z" />
      <path d="M12 9v4" />
      <circle
        cx="12"
        cy="17"
        r=".8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/* =========================================================
   ALERTA TRIANGULAR / FECHAS CONFLICTIVAS
========================================================= */

export function IconAlertTriangle({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.3 3.8 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <circle
        cx="12"
        cy="17"
        r=".8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/* =========================================================
   USUARIOS / GRUPO
========================================================= */

export function IconUsers({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c.6-3.3 2.4-5 5.5-5s4.9 1.7 5.5 5" />
      <path d="M16 5.5a3 3 0 0 1 0 5.8" />
      <path d="M16 15c2.5.2 4.1 1.7 4.5 5" />
    </svg>
  );
}

/* =========================================================
   CALENDARIO
========================================================= */

export function IconCalendar({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M7 2v4" />
      <path d="M17 2v4" />
      <path d="M3 9h18" />
      <path d="M8 13h2" />
      <path d="M14 13h2" />
      <path d="M8 17h2" />
      <path d="M14 17h2" />
    </svg>
  );
}

/* =========================================================
   PAPELERA
========================================================= */

export function IconTrash({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="m9 7 1-3h4l1 3" />
      <path d="M6 7l1 14h10l1-14" />
    </svg>
  );
}

/* =========================================================
   LLAVE / CAMBIAR CONTRASEÑA
========================================================= */

export function IconKey({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 9-9" />
      <path d="m17 6 2 2" />
      <path d="m14 9 2 2" />
    </svg>
  );
}

/* =========================================================
   SALIR / PUERTA
========================================================= */

export function IconLogout({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 4H5v16h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M8 12h10" />
    </svg>
  );
}

/* =========================================================
   MAÑANA
========================================================= */

export function IconSunrise({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 18h18" />
      <path d="M6 15a6 6 0 0 1 12 0" />
      <path d="M12 3v3" />
      <path d="m5 7 2 2" />
      <path d="m19 7-2 2" />
    </svg>
  );
}

/* =========================================================
   TARDE
========================================================= */

/* =========================================================
   SOL / TURNO DE TARDE
========================================================= */

export function IconSun({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />

      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

/* =========================================================
   NOCHE
========================================================= */

export function IconMoon({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />
    </svg>
  );
}

/* =========================================================
   LIBRE
========================================================= */

export function IconFree({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

/* =========================================================
   INFORMACIÓN DE LA APLICACIÓN
========================================================= */

export function IconApp({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="5" y="3" width="14" height="18" rx="3" />
      <path d="M9 7h6" />
      <path d="M9 11h6" />
      <path d="M9 15h3" />
    </svg>
  );
}

/* =========================================================
   SEGURIDAD / ESCUDO
========================================================= */

export function IconShield({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3 5 6v5c0 4.4 2.8 8.1 7 10 4.2-1.9 7-5.6 7-10V6Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/* =========================================================
   SALA / MONITOR
========================================================= */

export function IconMonitor({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}

/* =========================================================
   CERRAR / X
========================================================= */

export function IconX({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

/* =========================================================
   APLICACIÓN / MÓVIL
========================================================= */

export function IconSmartphone({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <path d="M10 5h4" />
      <circle
        cx="12"
        cy="18.5"
        r=".8"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}


/* =========================================================
  INICIO
========================================================= */

export function IconHome({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

/* =========================================================
  MENÚ
========================================================= */

export function IconMenu({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

/* =========================================================
  CHEVRON IZQUIERDA
========================================================= */

export function IconChevronLeft({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

/* =========================================================
  CHEVRON DERECHA
========================================================= */

export function IconChevronRight({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

/* =========================================================
  CHEVRON ABAJO
========================================================= */

export function IconChevronDown({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* =========================================================
  AÑADIR / PLUS
========================================================= */

export function IconPlus({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

/* =========================================================
  BUSCAR
========================================================= */

export function IconSearch({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

/* =========================================================
  CONFIGURACIÓN
========================================================= */

export function IconSettings({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.1h-2.4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.6-1H6.7v-2.4h.1a1.7 1.7 0 0 0 1.6-1A1.7 1.7 0 0 0 8.1 9l-.1-.1 1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.1h2.4V6a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1V14h-.1a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}

/* =========================================================
  ACTUALIZAR / REFRESH
========================================================= */

export function IconRefresh({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 11a8 8 0 0 0-14.7-4L4 9" />
      <path d="M4 4v5h5" />
      <path d="M4 13a8 8 0 0 0 14.7 4L20 15" />
      <path d="M20 20v-5h-5" />
    </svg>
  );
}

/* =========================================================
  CORRECTO / CHECK
========================================================= */

export function IconCheck({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

/* =========================================================
  MÁS OPCIONES
========================================================= */

export function IconMore({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <circle cx="5" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="19" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

/* =========================================================
  NOTIFICACIONES
========================================================= */

export function IconBell({ className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}
/* =========================================================
   BIBLIOTECA DE ICONOS
   ---------------------------------------------------------
   ESTA ES LA PARTE QUE UTILIZA /iconos
========================================================= */

export type IconoBiblioteca = {
  nombre: string;
  descripcion: string;
  componente: React.ComponentType<IconProps>;
};

export const bibliotecaIconos: IconoBiblioteca[] = [
  {
    nombre: "IconUser",
    descripcion: "Usuario / avatar",
    componente: IconUser,
  },
  {
    nombre: "IconPencil",
    descripcion: "Editar",
    componente: IconPencil,
  },
  {
    nombre: "IconInfo",
    descripcion: "Información",
    componente: IconInfo,
  },
  {
    nombre: "IconCrown",
    descripcion: "Administrador",
    componente: IconCrown,
  },
  {
    nombre: "IconPolice",
    descripcion: "Policía / categoría",
    componente: IconPolice,
  },
  {
    nombre: "IconCar",
    descripcion: "G.A.C / vehículo",
    componente: IconCar,
  },
  {
    nombre: "IconClock",
    descripcion: "Turno / reloj",
    componente: IconClock,
  },
  {
    nombre: "IconAlert",
    descripcion: "Aviso / alerta",
    componente: IconAlert,
  },
  {
    nombre: "IconAlertTriangle",
    descripcion: "Alerta / fechas conflictivas",
    componente: IconAlertTriangle,
  },
  {
    nombre: "IconUsers",
    descripcion: "Usuarios / grupo",
    componente: IconUsers,
  },
  {
    nombre: "IconCalendar",
    descripcion: "Calendario / fechas",
    componente: IconCalendar,
  },
  {
    nombre: "IconTrash",
    descripcion: "Eliminar",
    componente: IconTrash,
  },
  {
    nombre: "IconKey",
    descripcion: "Cambiar contraseña",
    componente: IconKey,
  },
  {
    nombre: "IconLogout",
    descripcion: "Cerrar sesión",
    componente: IconLogout,
  },
  {
    nombre: "IconSunrise",
    descripcion: "Turno de mañana",
    componente: IconSunrise,
  },
{
  nombre: "IconSun",
  descripcion: "Turno de tarde",
  componente: IconSun,
},
  {
    nombre: "IconMoon",
    descripcion: "Turno de noche",
    componente: IconMoon,
  },
  {
    nombre: "IconFree",
    descripcion: "Día libre",
    componente: IconFree,
  },
  {
    nombre: "IconApp",
    descripcion: "Aplicación / información",
    componente: IconApp,
  },
  {
    nombre: "IconShield",
    descripcion: "Seguridad / protección",
    componente: IconShield,
  },
  {
    nombre: "IconMonitor",
    descripcion: "Sala / monitor",
    componente: IconMonitor,
  },
  {
    nombre: "IconX",
    descripcion: "Cerrar",
    componente: IconX,
  },
  {
    nombre: "IconSmartphone",
    descripcion: "Aplicación / móvil",
    componente: IconSmartphone,
  },

  {
  nombre: "IconHome",
  descripcion: "Inicio",
  componente: IconHome,
},
{
  nombre: "IconMenu",
  descripcion: "Menú",
  componente: IconMenu,
},
{
  nombre: "IconChevronLeft",
  descripcion: "Anterior / atrás",
  componente: IconChevronLeft,
},
{
  nombre: "IconChevronRight",
  descripcion: "Siguiente",
  componente: IconChevronRight,
},
{
  nombre: "IconChevronDown",
  descripcion: "Desplegar",
  componente: IconChevronDown,
},
{
  nombre: "IconPlus",
  descripcion: "Añadir",
  componente: IconPlus,
},
{
  nombre: "IconSearch",
  descripcion: "Buscar",
  componente: IconSearch,
},
{
  nombre: "IconSettings",
  descripcion: "Configuración",
  componente: IconSettings,
},
{
  nombre: "IconRefresh",
  descripcion: "Actualizar",
  componente: IconRefresh,
},
{
  nombre: "IconCheck",
  descripcion: "Confirmar / correcto",
  componente: IconCheck,
},
{
  nombre: "IconMore",
  descripcion: "Más opciones",
  componente: IconMore,
},
{
  nombre: "IconBell",
  descripcion: "Notificaciones",
  componente: IconBell,
},
];