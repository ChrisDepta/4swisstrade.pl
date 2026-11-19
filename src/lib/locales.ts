import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import i18next from "i18next";

export const locales = ["pl", "uk", "ru", "en", "de"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = Record<string, string>;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const file = path.join(process.cwd(), "public", "locales", locale, "translation.json");
  const resources = JSON.parse(await readFile(file, "utf8")) as Dictionary;
  const instance = i18next.createInstance();
  await instance.init({
    lng: locale,
    fallbackLng: "pl",
    resources: { [locale]: { translation: resources } },
    interpolation: { escapeValue: false },
  });
  return Object.fromEntries(
    Object.keys(resources).map((key) => [key, instance.t(key)]),
  );
}

export function translate(dictionary: Dictionary, key: string): string {
  return dictionary[key] ?? key;
}
