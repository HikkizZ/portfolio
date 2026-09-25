import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Esquema unificado con 01_arquitectura.md → "Esquema de un proyecto (Zod)".
// El slug sale del nombre del archivo (erp.md → /proyectos/erp).
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      year: z.string(), // "2025" · "2026 — actualidad"
      kind: z.enum(["Trabajo", "Práctica", "Universidad", "Personal"]),
      role: z.string(), // "Full Stack" / "Backend" / "Infraestructura"
      summary: z.string(), // ≤ 25 palabras, para la tarjeta
      stack: z.array(z.string()),
      status: z.enum(["En producción", "Finalizado", "Activo"]),
      links: z.object({
        repo: z.url().optional(),
        demo: z.url().optional(),
        docs: z.url().optional(),
      }),
      metrics: z
        .array(
          z.object({
            value: z.string(),
            label: z.string(),
          }),
        )
        .min(2)
        .max(4),
      cover: z
        .object({
          src: image(),
          alt: z.string(),
        })
        .optional(),
      order: z.number(),
      draft: z.boolean().default(false),
    }),
});

// Esquema razonable para la experiencia laboral/académica.
// Un ítem por entrada de la sección "02 Experiencia" del diseño (§3.1, §6.6).
const experience = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/experience" }),
  schema: z.object({
    role: z.string(), // "Desarrollador de Software"
    org: z.string(), // "SIGA Ltda"
    location: z.string().optional(),
    start: z.string(), // "Julio 2026", "Marzo 2020"
    end: z.string().optional(), // fecha, o ausente si es "actualidad"
    current: z.boolean().default(false), // true → se muestra "actualidad" en vez de `end`
    context: z.string().optional(), // línea de contexto bajo el rol (ej. "Migración de sistema legacy COBOL")
    stack: z.array(z.string()).default([]),
    highlights: z.array(z.string()).max(4),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, experience };
