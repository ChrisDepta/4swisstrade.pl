"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import type { Dictionary } from "@/lib/locales";

export function ContactForm({ dictionary, locale }: { dictionary: Dictionary; locale: string }) {
  const [status, setStatus] = useState<"idle"|"sending"|"success"|"error">("idle");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, locale }) });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch { setStatus("error"); }
  }
  const field = "focus-ring w-full border-0 border-b hairline bg-transparent px-0 py-4 outline-none placeholder:text-[var(--muted)]";
  return <form onSubmit={submit} className="grid gap-6">
    <input className="hidden" name="companyWebsite" tabIndex={-1} autoComplete="off"/>
    <input className={field} name="name" required minLength={2} maxLength={100} placeholder={dictionary["contact.name"]}/>
    <div className="grid gap-6 md:grid-cols-2"><input className={field} name="email" type="email" required maxLength={160} placeholder={dictionary["contact.email"]}/><input className={field} name="phone" type="tel" maxLength={30} placeholder={dictionary["contact.phone"]}/></div>
    <input className={field} name="subject" required minLength={3} maxLength={160} placeholder={dictionary["contact.subject"]}/>
    <textarea className={`${field} min-h-36 resize-y`} name="message" required minLength={10} maxLength={5000} placeholder={dictionary["contact.message"]}/>
    <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-muted"><input type="checkbox" required name="consent" className="mt-1 size-4 accent-[#d9212e]"/>{dictionary["contact.privacy"]}</label>
    <button disabled={status === "sending"} className="button-primary disabled:cursor-wait disabled:opacity-60">{status === "sending" ? <LoaderCircle className="animate-spin" size={17}/> : <>{dictionary["contact.send"]}<ArrowRight size={17}/></>}</button>
    {status === "success" && <p role="status" className="border-l-2 border-emerald-500 pl-3 text-sm">{dictionary["contact.success"]}</p>}
    {status === "error" && <p role="alert" className="border-l-2 border-red-500 pl-3 text-sm text-red-500">{dictionary["contact.error"]}</p>}
  </form>;
}
