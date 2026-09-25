import es from "./es.json";

export const defaultLang = "es";

export const ui = {
  es,
} as const;

/**
 * Devuelve las cadenas de UI del idioma pedido (por ahora solo `es`).
 * Preparado para agregar `en` en el futuro sin tocar los componentes.
 */
export function useTranslations(lang: keyof typeof ui = defaultLang) {
  return ui[lang];
}
