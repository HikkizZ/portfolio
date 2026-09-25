/**
 * Script de inicialización del tema, inyectado inline en <head> por
 * BaseLayout.astro para fijar `data-theme` antes del primer paint y
 * evitar el parpadeo (02_diseno.md §6.7).
 *
 * Contenido estable a propósito: en la Fase 5, la CSP del nginx interno
 * permite este script por su hash SHA-256 (`script-src 'self' 'sha256-...'`).
 * Si el contenido de este archivo cambia, hay que recalcular ese hash.
 */
export const THEME_INIT_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem("theme");
    var theme =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();`;
