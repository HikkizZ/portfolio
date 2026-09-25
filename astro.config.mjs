// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://portfolio.zytech.dev',
  integrations: [
    sitemap({
      // La página de muestra de componentes (Fase 1, se borra en la Fase 4)
      // no es contenido público: fuera del sitemap.
      filter: (page) => !page.includes('/kit'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    port: 3100,
  },
});
