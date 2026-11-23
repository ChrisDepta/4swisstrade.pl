"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/routing";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccessibilityTools, defaultAccessibilityLabels } from "@/components/accessibility-tools/accessibility-tools";
import type { AccessibilityLabels } from "@/components/accessibility-tools/accessibility-tools";

const languageNames: Record<Locale, string> = { pl: "PL", uk: "UA", ru: "RU", en: "EN", de: "DE" };

export function SiteShell({ locale, dictionary, children }: { locale: Locale; dictionary: Dictionary; children: React.ReactNode }) {
  const [logo, setLogo] = useState("/images/logoBlack.png");

  useEffect(() => {
    const updateLogo = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setLogo(isDark ? "/images/logoWhite.png" : "/images/logoBlack.png");
    };

    updateLogo();

    const observer = new MutationObserver(() => updateLogo());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const links = [
    ["services", "serwis"], ["machines", "ekspresy"], ["about", "o-nas"], ["contact", "kontakt"],
  ] as const;
  const accessibilityLabels: Partial<AccessibilityLabels> = {};
  for (const key of Object.keys(defaultAccessibilityLabels) as (keyof AccessibilityLabels)[]) {
    const translated = dictionary[`accessibility.${key}`];
    if (translated) accessibilityLabels[key] = translated;
  }
  return (
    <AccessibilityTools storageKey="4swiss-accessibility" legacyStoragePrefix="4swiss" brand={`4SWISS / ${accessibilityLabels.title ?? defaultAccessibilityLabels.title}`} labels={accessibilityLabels}>
      <header className="sticky top-0 z-50 border-b hairline bg-(--paper)/95 backdrop-blur-xl">
        <div className="container-site flex h-20 items-center justify-between gap-5">
          <Link href={localizedPath(locale)} className="focus-ring flex items-center gap-3" aria-label={dictionary["nav.home"]}>
            <Image src={logo} alt="4Swiss Trade" width={160} height={80} className="object-contain"/>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex" aria-label="Main navigation">
            {links.map(([key, path]) => <Link key={key} href={localizedPath(locale, path)} className="focus-ring transition-colors hover:text-[#d9212e]">{dictionary[`nav.${key}`]}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="https://www.ncoffee.pl" className="focus-ring shop-link hidden items-center gap-2 sm:flex">{dictionary["nav.shop"]}<ArrowUpRight size={15}/></Link>
            <details className="relative">
              <summary className="focus-ring grid h-10 cursor-pointer list-none place-items-center border hairline px-3 text-xs font-bold">{languageNames[locale]}</summary>
              <div className="absolute right-0 mt-2 grid min-w-28 border hairline bg-surface p-2 shadow-xl">
                {(Object.keys(languageNames) as Locale[]).map((item) => <Link key={item} href={localizedPath(item)} className="px-3 py-2 text-xs hover:bg-black/5 dark:hover:bg-white/5">{languageNames[item]}</Link>)}
              </div>
            </details>
            <ThemeToggle darkLabel={dictionary["theme.dark"]} lightLabel={dictionary["theme.light"]}/>
            <details className="relative lg:hidden">
              <summary className="focus-ring grid size-10 cursor-pointer list-none place-items-center border hairline"><Menu size={18}/></summary>
              <nav className="absolute right-0 mt-2 grid w-56 border hairline bg-surface p-3 text-sm shadow-xl">
                {links.map(([key, path]) => <Link key={key} href={localizedPath(locale, path)} className="p-3 hover:bg-black/5 dark:hover:bg-white/5">{dictionary[`nav.${key}`]}</Link>)}
                <Link href="https://www.ncoffee.pl" className="p-3 font-bold text-[#d9212e]">{dictionary["nav.shop"]}</Link>
              </nav>
            </details>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t hairline bg-[#101010] text-white">
        <div className="container-site grid gap-10 py-16 md:grid-cols-[1.6fr_1fr_1fr]">
          <div><div className="mb-5 text-xl font-black tracking-widest">4SWISS <span className="font-normal">TRADE</span></div><p className="max-w-sm text-sm leading-7 text-white/55">{dictionary["footer.text"]}</p></div>
          <div className="grid gap-2 text-sm">{links.map(([key,path]) => <Link key={key} href={localizedPath(locale, path)} className="text-white/65 hover:text-white">{dictionary[`nav.${key}`]}</Link>)}</div>
          <div className="text-sm leading-7 text-white/65"><p>ul. Świdnicka 40</p><p>58-200 Dzierżoniów</p><a href="tel:+48693810166" className="mt-3 block text-white">+48 693 810 166</a><a href="mailto:serwis@cafixo.pl">serwis@cafixo.pl</a></div>
        </div>
        <div className="border-t border-white/10"><div className="container-site py-5 text-xs text-white/35">© {new Date().getFullYear()} 4 SWISS TRADE. All rights reserved.</div></div>
      </footer>
    </AccessibilityTools>
  );
}
