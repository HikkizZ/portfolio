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
      // La página de muestra de componentes (Fase 1, se borra en la Fase 4)
      // y la 404 no son contenido público: fuera del sitemap.
      filter: (page) => !page.includes('/kit') && !page.includes('/404'),
    }),
  ],
  markdown: {
    // Astro 7 usa por defecto el procesador "Sätteri", que no corre
    // remark/rehype: hay que pedir el procesador `unified` de
    // @astrojs/markdown-remark explícitamente para poder engancharle el
    // rehype propio que convierte "### Decisión" en el <dl> de
    // DecisionBlock.astro (src/lib/rehype-decision-blocks.ts).
    processor: unified({ rehypePlugins: [rehypeDecisionBlocks] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 3100,
  },
});
