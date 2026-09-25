// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import rehypeDecisionBlocks from './src/lib/rehype-decision-blocks.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio.zytech.dev',
  integrations: [
    sitemap({
      // La 404 no es contenido público: fuera del sitemap.
      filter: (page) => !page.includes('/404'),
    }),
  ],
  security: {
    // CSP estable desde Astro 6: genera un <meta http-equiv="Content-Security-Policy">
    // por página con los hashes SHA-256 de los scripts/estilos inline (el script
    // de tema y el del toggle), recalculados solos en cada build. `frame-ancestors`
    // no funciona en <meta>, así que se complementa con un header CSP mínimo en
    // nginx/default.conf (ver Fase 5 en 01_arquitectura.md).
    csp: true,
  },
  markdown: {
    // Astro 7 usa por defecto el procesador "Sätteri", que no corre
    // remark/rehype: hay que pedir el procesador `unified` de
    // @astrojs/markdown-remark explícitamente para poder engancharle el
    // rehype propio que convierte "### Decisión" en el <dl> del bloque de
    // decisión técnica (src/lib/rehype-decision-blocks.ts).
    processor: unified({ rehypePlugins: [rehypeDecisionBlocks] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 3100,
  },
});
