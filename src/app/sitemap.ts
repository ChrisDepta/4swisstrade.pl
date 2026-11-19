import type { MetadataRoute } from "next";
import { locales } from "@/lib/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://4swisstrade.pl";
  const paths = ["", "/serwis", "/serwis-centralny-4swiss", "/ekspresy", "/kontakt", "/o-nas"];
  return locales.flatMap((locale) => paths.map((path) => ({
    url: `${baseUrl}/${locale}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
    alternates: { languages: Object.fromEntries(locales.map((item) => [item, `${baseUrl}/${item}${path}`])) },
  })));
}
