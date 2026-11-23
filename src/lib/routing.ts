import type { Locale } from "./locales";

export const pageSlugs = ["serwis", "serwis-centralny-4swiss", "ekspresy", "kontakt", "o-nas"] as const;

export function localizedPath(locale: Locale, path = ""): string {
  const prefix = locale === "pl" ? "" : `/${locale}`;
  return `${prefix}${path ? `/${path}` : ""}` || "/";
}
