"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Download, FileText, Search, ShieldCheck, Sparkles } from "lucide-react";
import type { Dictionary } from "@/lib/locales";

const serviceIds = ["diagnostic", "maintenance", "warranty"] as const;
type ServiceId = (typeof serviceIds)[number];
const icons = { diagnostic: Search, maintenance: Sparkles, warranty: ShieldCheck };
const termsIds = { diagnostic: "diagnostic", maintenance: "cleaning", warranty: "warrantyRepair" };

export function ServiceSelector({ dictionary, locale }: { dictionary: Dictionary; locale: string }) {
  const [selected, setSelected] = useState<ServiceId | null>(null);
  const selectedUrl = selected ? `https://cafixo.pl/services?service=${encodeURIComponent(selected)}&machine=4Swiss&lang=${locale}` : "#";
  if (selected) {
    const Icon = icons[selected];
    return <div className="glass-card mx-auto max-w-3xl p-7 md:p-12">
      <button type="button" className="focus-ring mb-10 flex items-center gap-2 text-sm text-muted" onClick={() => setSelected(null)}><ArrowLeft size={16}/>{dictionary["service.back"]}</button>
      <Icon className="mb-7 size-12 text-[#d9212e]" strokeWidth={1.5}/>
      <p className="eyebrow">{dictionary["service.selected"]}</p>
      <h3 className="display mt-3 text-5xl">{dictionary[`service.${selected}`]}</h3>
      <p className="mt-5 text-lg leading-8 text-muted">{dictionary[`service.${selected}.text`]}</p>
      <div className="my-8 h-px bg-(--line)"/>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <span className="text-2xl font-bold">{dictionary[`service.${selected}.price`]}</span>
        <div className="flex flex-col gap-3 sm:items-end">
          <a href={`/api/download-terms?service=${termsIds[selected]}&lang=${locale}`} className="download-link" download><FileText size={17}/>{dictionary["service.downloadTerms"]}<Download size={15}/></a>
          <a href={selectedUrl} className="button-primary">{dictionary["service.order"]}<ArrowUpRight size={17}/></a>
        </div>
      </div>
      <p className="mt-5 text-xs leading-5 text-muted">{dictionary["service.note"]}</p>
    </div>;
  }
  return <div className="grid gap-5 lg:grid-cols-3">
    {serviceIds.map((id, index) => {
      const Icon = icons[id];
      return <div key={id} className="service-card group min-h-107.5 p-7 md:p-9">
        <div className="flex items-start justify-between"><span className="service-icon"><Icon className="size-7 text-[#d9212e]" strokeWidth={1.5}/></span><span className="font-mono text-xs opacity-35">0{index+1}</span></div>
        <h3 className="display mt-24 text-4xl">{dictionary[`service.${id}`]}</h3>
        <p className="mt-5 min-h-20 text-sm leading-7 text-muted">{dictionary[`service.${id}.text`]}</p>
        <div className="mt-8 flex items-center justify-between border-t hairline pt-5"><strong>{dictionary[`service.${id}.price`]}</strong><span className="text-xs font-bold uppercase tracking-widest text-[#d9212e]">4SWISS</span></div>
        <button type="button" onClick={() => setSelected(id)} className="button-primary mt-5 w-full">{dictionary["service.select"]}<Check size={15}/></button>
        <a href={`/api/download-terms?service=${termsIds[id]}&lang=${locale}`} download className="download-link mt-4 w-full justify-center"><FileText size={16}/>{dictionary["service.downloadTerms"]}<Download size={14}/></a>
      </div>;
    })}
  </div>;
}
