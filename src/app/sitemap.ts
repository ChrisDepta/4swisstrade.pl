import type { MetadataRoute } from "next";
import { locales } from "@/lib/locales";
import { localizedPath, pageSlugs } from "@/lib/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://4swisstrade.pl";
  const paths = ["", ...pageSlugs];
  return locales.flatMap((locale) => paths.map((path) => ({
    url: `${baseUrl}${localizedPath(locale, path)}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
    alternates: { languages: Object.fromEntries(locales.map((item) => [item, `${baseUrl}${localizedPath(item, path)}`])) },
  })));
}
