# syntax=docker/dockerfile:1

# ---- Etapa build --------------------------------------------------------
# Compila el sitio estático con Node + pnpm. Esta etapa no llega a la
# imagen final: solo se copia dist/ (ver etapa "final" más abajo).
FROM node:22-alpine AS build
WORKDIR /app

# pnpm viene vía corepack (incluido en node:22-alpine), no hace falta
# instalarlo aparte.
RUN corepack enable

# Copiar primero los manifiestos aprovecha la caché de capas de Docker:
# si solo cambia el código, esta capa (pnpm install) no se vuelve a
# ejecutar. pnpm-workspace.yaml es obligatorio: ahí vive `allowBuilds`
# (pnpm 11), sin él los postinstall de esbuild quedan bloqueados y el
# build falla.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ---- Etapa final ---------------------------------------------------------
# Solo el HTML/CSS/JS ya generado, servido por nginx. Sin Node, sin pnpm,
# sin código fuente: la imagen final no depende de nada de la etapa build.
FROM nginx:alpine AS final
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
