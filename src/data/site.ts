/**
 * Datos personales y de contacto del sitio: una sola fuente de verdad.
 * Ningún componente debe tener estos textos hardcodeados (ver 02_diseno §9 y §11.10).
 */

interface HowIWorkItem {
  title: string;
  body: string;
}

interface Site {
  name: string;
  roleLine: string;
  location: string;
  intro: string;
  email: string;
  github: string;
  linkedin: string;
  cvPath: string;
  availability: string;
  footerText: string;
  repoUrl: string;
  howIWork: HowIWorkItem[];
}

export const site: Site = {
  name: "Felipe Miranda Rebolledo",
  roleLine: "Ingeniero Civil en Informática · Full Stack, énfasis backend · Concepción, Chile",
  location: "Concepción, Chile",
  intro:
    "Hoy trabajo en SIGA Ltda migrando un ERP legacy en COBOL a una arquitectura web en TypeScript. Me interesa el backend, la arquitectura y la infraestructura: modelar datos, diseñar APIs y separar responsabilidades para que un sistema se pueda entender y cambiar sin miedo.",
  email: "fmiranda.reb@gmail.com",
  github: "https://github.com/HikkizZ",
  linkedin: "https://linkedin.com/in/fmirandareb",
  cvPath: "/cv/CV_FelipeMirandaRebolledo.pdf",
  availability: "Disponible para roles full stack.",
  footerText: "© 2026 Felipe Miranda Rebolledo · Hecho con Astro y servido desde Nexus (zytech.dev)",
  repoUrl: "https://github.com/HikkizZ/portfolio",
  howIWork: [
    {
      title: "Rigor",
      body: "Me importa la separación de responsabilidades, el tipado y las pruebas. Prefiero un sistema simple que se entienda a uno ingenioso que nadie se atreve a cambiar.",
    },
    {
      title: "Documentar",
      body: "Registro cada decisión técnica con su contexto y las alternativas que descarté, al estilo de un ADR. Lo que no está escrito se pierde.",
    },
    {
      title: "Construir",
      body: "Aprendo haciendo. Monté mi propio servidor desde cero —Docker, nginx, Cloudflare Tunnel— y este sitio corre en él.",
    },
  ],
};
