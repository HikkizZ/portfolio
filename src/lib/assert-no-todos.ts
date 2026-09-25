import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { CollectionEntry } from "astro:content";

/**
 * Guardia de contenido — 02_diseno.md §9/§13.3 (Revisión de diseño #2,
 * hallazgo #1): ningún `TODO`, nota interna o pregunta al autor puede llegar
 * al build de producción. Lee el .md fuente de cada proyecto (frontmatter +
 * cuerpo, con `readFileSync` en vez de `project.body`/`project.data` para
 * poder reportar archivo y línea) y busca la palabra `TODO`.
 *
 * - `astro build` (producción, `import.meta.env.PROD`): lanza un error que
 *   detiene el build y lista cada aparición como `archivo:línea`. No basta
 *   con ocultar los TODO por CSS: seguirían en el HTML publicado.
 * - `astro dev`: solo avisa por consola, para poder seguir escribiendo
 *   contenido con TODO sin que el dev server se caiga.
 *
 * Escape hatch explícito, documentado, solo para medir el build (ej.
 * Lighthouse) con TODOs todavía sin resolver — nunca para publicar:
 * `ALLOW_TODO=1 pnpm build`.
 */
export function assertNoTodos(projects: CollectionEntry<"projects">[]): void {
  const TODO_RE = /\bTODO\b/;
  const findings: string[] = [];

  for (const project of projects) {
    if (!project.filePath) continue;
    const absPath = resolve(process.cwd(), project.filePath);
    const lines = readFileSync(absPath, "utf-8").split("\n");
    lines.forEach((line, index) => {
      if (TODO_RE.test(line)) {
        findings.push(`${project.filePath}:${index + 1}  ${line.trim()}`);
      }
    });
  }

  if (findings.length === 0) return;

  const message =
    `${findings.length} TODO pendiente(s) en el contenido de los proyectos ` +
    `(02_diseno.md §9/§13.3 — ningún TODO puede llegar al build de producción):\n` +
    findings.map((f) => `  - ${f}`).join("\n");

  const allowTodo = process.env.ALLOW_TODO === "1";

  if (import.meta.env.PROD && !allowTodo) {
    throw new Error(
      `${message}\n\n` +
        `Resuelve cada TODO (responde la pregunta o borra el párrafo si no aplica) antes de publicar.\n` +
        `Para medir el build con TODOs pendientes sin publicar (ej. Lighthouse), usa: ALLOW_TODO=1 pnpm build`,
    );
  }

  console.warn(`⚠ ${message}`);
}
