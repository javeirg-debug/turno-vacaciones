import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
name: "S.C Turno 5",
short_name: "Turno 5",
    description: "Gestión de turnos de trabajo",
    start_url: "/login",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}