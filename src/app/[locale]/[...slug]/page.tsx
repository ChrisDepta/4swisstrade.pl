import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { ServiceSelector } from "@/components/service-selector";
import { getDictionary, isLocale, locales } from "@/lib/locales";

const allowed = ["serwis", "serwis-centralny-4swiss", "ekspresy", "kontakt", "o-nas"];

export function generateStaticParams() {
  return locales.flatMap((locale) => allowed.map((slug) => ({ locale, slug: [slug] })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string[] }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !allowed.includes(slug[0])) return {};
  const d = await getDictionary(locale);
  const titles: Record<string, string> = { serwis: d["nav.services"], "serwis-centralny-4swiss": d["nav.central"], ekspresy: d["nav.machines"], kontakt: d["nav.contact"], "o-nas": d["nav.about"] };
  return {
    title: titles[slug[0]],
    alternates: {
      canonical: `/${locale}/${slug[0]}`,
      languages: Object.fromEntries(locales.map((item) => [item, `/${item}/${slug[0]}`])),
    },
  };
}

export default async function InnerPage({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || slug.length !== 1 || !allowed.includes(slug[0])) notFound();
  const d = await getDictionary(locale);
  const page = slug[0];
  if (page === "serwis") return <><PageHero kicker={d["service.kicker"]} title={d["service.title"]} text={d["service.intro"]}/><section className="container-site py-20 md:py-28"><ServiceSelector dictionary={d} locale={locale}/><div className="glass-card mt-8 flex flex-col items-start justify-between gap-6 p-7 md:flex-row md:items-center md:p-9"><div><p className="eyebrow">4SWISS / CAFIXO</p><h2 className="display mt-3 text-3xl md:text-4xl">{d["service.centralTitle"]}</h2><p className="mt-3 max-w-2xl leading-7 text-muted">{d["service.centralText"]}</p></div><Link href={`/${locale}/serwis-centralny-4swiss`} className="button-outline shrink-0">{d["service.centralLink"]}<ArrowUpRight size={17}/></Link></div></section></>;
  if (page === "ekspresy") return <><PageHero kicker={d["machines.kicker"]} title={d["machines.title"]} text={d["machines.text"]}/><section className="container-site grid gap-5 py-20 md:grid-cols-3 md:py-28">{[
    ["Roma A10 PRO","ekspress_10.png","For high-volume operations"],["Roma A10 PRO Mini","ekspress_11.png","Compact power for growing spaces"],["Roma A10 Home","ekspress_12.png","Everyday espresso, beautifully simple"],
  ].map(([name,image,description],index) => <article key={name} className="service-card group p-7"><span className="font-mono text-xs text-muted">0{index+1} / ROMA</span><div className="relative my-8 h-96"><Image src={`/images/${image}`} alt={name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain transition-transform duration-500 group-hover:scale-105"/></div><h2 className="display text-3xl">{name}</h2><p className="mt-3 text-sm text-muted">{description}</p></article>)}</section><div className="container-site pb-24 text-center"><a href="https://www.ncoffee.pl" className="button-primary">{d["machines.cta"]}<ArrowUpRight size={17}/></a></div></>;
  if (page === "kontakt") return <><PageHero kicker={d["contact.kicker"]} title={d["contact.title"]}/><section className="container-site grid gap-16 py-20 md:py-28 lg:grid-cols-[.75fr_1.25fr]"><div><h2 className="display text-4xl">4 SWISS TRADE</h2><div className="mt-8 space-y-6 text-sm leading-7 text-muted"><p className="flex gap-3"><MapPin size={18} className="mt-1 shrink-0 text-[#d9212e]"/>ul. Świdnicka 40<br/>58-200 Dzierżoniów</p><p className="flex gap-3"><Phone size={18} className="mt-1 shrink-0 text-[#d9212e]"/><a href="tel:+48693810166">+48 693 810 166</a></p><p>serwis@cafixo.pl<br/>Pn–Pt / 9:00–17:00</p></div></div><ContactForm dictionary={d} locale={locale}/></section></>;
  if (page === "o-nas") return <><PageHero kicker={d["about.kicker"]} title={d["about.title"]} text={d["about.text"]}/><section className="container-site grid gap-12 py-20 md:py-28 lg:grid-cols-2"><Image src="/images/kawa_3.png" alt="4Swiss coffee" width={439} height={592} className="mx-auto h-[560px] w-auto object-contain"/><div className="self-center"><p className="display text-4xl leading-tight">{d["section.complete.text"]}</p><div className="red-rule my-8"/><p className="max-w-xl leading-8 text-muted">{d["section.team.text"]}</p><Link href={`/${locale}/serwis`} className="button-primary mt-8">{d["home.secondary"]}<ArrowUpRight size={17}/></Link></div></section></>;
  return <><PageHero kicker="CAFIXO / 4SWISS" title={d["nav.central"]} text={d["section.team.text"]}/><section className="container-site grid items-center gap-14 py-20 md:py-28 lg:grid-cols-2"><div className="product-stage relative min-h-[480px]"><Image src="/images/2018-rooma-a10_asm-v3-1-1024x576.png" alt="4Swiss Roma service" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain"/></div><div><p className="eyebrow">ROMA A10 / A12 / V8 / A6 / A7</p><h2 className="display mt-4 text-5xl">Centralna baza wiedzy. Pełna baza części.</h2><p className="mt-6 leading-8 text-muted">Zapewniamy diagnostykę, naprawy gwarancyjne i pogwarancyjne oraz fachową konserwację. Przeszkoleni technicy pracują od poniedziałku do piątku w godzinach 9:00–17:00.</p><Link href={`/${locale}/serwis`} className="button-primary mt-8">{d["service.title"]}<ArrowUpRight size={17}/></Link></div></section></>;
}

function PageHero({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return <section className="relative overflow-hidden border-b hairline"><div className="grain absolute inset-0 opacity-50"/><div className="container-site relative py-24 md:py-32"><p className="eyebrow mb-6">{kicker}</p><h1 className="display max-w-5xl text-5xl leading-[.98] md:text-8xl">{title}</h1>{text && <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">{text}</p>}<div className="red-rule mt-12 max-w-md"/></div></section>;
}
