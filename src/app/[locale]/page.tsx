import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Coffee } from "lucide-react";
import { getDictionary, isLocale } from "@/lib/locales";
import { localizedPath } from "@/lib/routing";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = await getDictionary(locale);
  return <>
    <section className="relative  overflow-hidden bg-[#101010] text-white">
      <Image src="/images/slider_home-min.jpg" alt="4Swiss coffee experience" fill priority className="object-cover"/>
      <div className="grain absolute inset-0"/>
      <div className="container-site relative z-10 flex items-center py-24">
        <div className="max-w-4xl">
          <p className="eyebrow mb-7">{d["home.eyebrow"]}</p>
          <h1 className="display max-w-3xl text-6xl leading-[.92] sm:text-7xl lg:text-[7rem]">{d["home.title"]}</h1>
          <p className="mt-9 max-w-xl text-base leading-8 text-white/65 md:text-lg">{d["home.text"]}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={localizedPath(locale, "ekspresy")} className="button-primary">{d["home.primary"]}<ArrowRight size={17}/></Link>
            <Link href={localizedPath(locale, "serwis")} className="button-outline border-white/25">{d["home.secondary"]}</Link>
          </div>
          <div className="hero-product-card absolute bottom-16 right-5 hidden w-77.5 overflow-hidden p-3 xl:block">
            <Image src="/images/slider_home-min.jpg" alt="Ekspresy Roma 4Swiss" width={560} height={363} className="h-40 w-full rounded-[20px] object-cover"/>
            <div className="flex items-center justify-between px-2 pb-1 pt-4 text-xs uppercase tracking-[.16em]"><span>Roma collection</span><span className="text-[#ff4f5a]">4Swiss</span></div>
          </div>
        </div>
        <div className="absolute bottom-8 left-5 flex items-center gap-3 text-xs tracking-widest text-white/50"><ArrowDown size={14}/><span>4SWISS / 2026</span></div>
      </div>
    </section>
    <section className="border-b hairline bg-surface">
      <div className="container-site grid divide-y hairline md:grid-cols-3 md:divide-x md:divide-y-0">
        {["one","two","three"].map((item, i) => <div key={item} className="p-8 md:p-10"><span className="display block text-5xl text-[#d9212e]">0{i+1}</span><p className="mt-2 text-sm font-semibold uppercase tracking-[.13em]">{d[`home.stat.${item}`]}</p></div>)}
      </div>
    </section>
    <section className="container-site grid items-center gap-12 py-24 lg:grid-cols-[.9fr_1.1fr] lg:py-32">
      <div className="product-stage relative min-h-130">
        <Image src="/images/kawa_330-min.jpg" alt="" fill className="rounded-4xl object-cover opacity-25"/>
        <Image src="/images/ekspress_10.png" alt="4Swiss Roma A10" width={409} height={607} className="absolute inset-0 m-auto h-[88%] w-auto object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,.45)]"/>
        <span className="absolute bottom-5 left-5 text-xs font-bold tracking-[.22em] text-white/45">ROMA / A10</span>
      </div>
      <div>
        <p className="eyebrow mb-5">4SWISS / SYSTEM</p>
        <h2 className="display text-5xl leading-none md:text-7xl">{d["section.complete"]}</h2>
        <p className="mt-7 max-w-xl text-lg leading-8 text-muted">{d["section.complete.text"]}</p>
        <div className="mt-9 grid gap-4 border-t hairline pt-7">
          {["quality","team"].map((key, i) => <div key={key} className="feature-row grid grid-cols-[40px_1fr] gap-3"><span className="font-mono text-xs text-[#d9212e]">0{i+1}</span><div><h3 className="font-bold">{d[`section.${key}`]}</h3><p className="mt-1 text-sm leading-6 text-muted">{d[`section.${key}.text`]}</p></div></div>)}
        </div>
      </div>
    </section>
    <section className="red-banner text-white"><div className="container-site flex flex-col justify-between gap-8 py-16 md:flex-row md:items-center"><div className="flex items-center gap-5"><span className="glow-icon"><Coffee className="size-8"/></span><div><p className="text-xs font-bold tracking-[.2em]">NCOFFEE.PL</p><p className="mt-2 max-w-xl text-xl font-bold">Espresso, machines and coffee — selected for people who expect more.</p></div></div><a href="https://www.ncoffee.pl" className="button-light shrink-0">{d["nav.shop"]}<ArrowRight size={16}/></a></div></section>
  </>;
}
