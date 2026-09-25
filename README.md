# Portafolio — Felipe Miranda

Portafolio personal: [portfolio.zytech.dev](https://portfolio.zytech.dev). Sitio 100% estático, casos de estudio de mis proyectos principales.

## Stack

- [Astro 7](https://astro.build) — genera HTML estático, sin JavaScript salvo el toggle de tema.
- TypeScript estricto, ESModules.
- Tailwind CSS v4.
- Contenido en Markdown con Content Collections (esquemas validados con Zod).
- [pnpm](https://pnpm.io) como gestor de paquetes (versión fijada en `packageManager`).

## Desarrollo

```sh
pnpm install
pnpm dev       # http://localhost:3100
```

Otros comandos: `pnpm build`, `pnpm preview`, `pnpm check` (`astro check`), `pnpm lint`, `pnpm format`.

> El build de producción falla a propósito si queda algún `TODO` en el contenido de un proyecto (guardia en `src/lib/assert-no-todos.ts`).

## Docker

La imagen se construye en dos etapas: `node:22-alpine` compila el sitio con pnpm y `nginx:alpine` sirve solo el resultado (`dist/`), sin Node ni código fuente.

```sh
docker build -t portfolio:local .
docker run --rm -p 127.0.0.1:3101:80 portfolio:local
```

Abrir `http://127.0.0.1:3101`.

## Despliegue

Se despliega como contenedor Docker (`docker-compose.yml`) detrás de un reverse proxy, en una red externa `web` y sin puertos publicados. La configuración de nginx (`nginx/default.conf`) agrega caché de assets, cabeceras de seguridad y una Content Security Policy estricta (los scripts inline se permiten por hash, generado automáticamente por Astro en cada build).
