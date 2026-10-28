"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { site } from "@/lib/site";
import { useEnquiry } from "./EnquiryProvider";

const BUSINESS_TYPES = ["Restaurant", "Café / Coffee shop", "Hotel / Resort", "Cloud kitchen", "Bakery / Pizzeria", "Bar / Pub", "Institutional / Canteen", "Other"];
const TIMELINES = ["Immediately", "Within 1 month", "1–3 months", "3+ months / planning stage"];

type Errors = Partial<Record<string, string>>;

export default function EnquiryForm({ kind = "quotation" }: { kind?: "quotation" | "contact" }) {
  const { items, clear } = useEnquiry();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [reference, setReference] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          kind,
          items: kind === "quotation" ? items.map((i) => ({ slug: i.slug, quantity: i.quantity })) : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setStatus("idle");
        document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
        return;
      }
      setReference(data.reference);
      setStatus("done");
      if (kind === "quotation") clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "done")
    return (
      <div className="rounded-3xl border border-steel-200 bg-white p-8 text-center md:p-12">
        <div className="mx-auto grid size-16 animate-pop place-items-center rounded-full bg-green-50">
          <CheckCircle2 className="size-9 text-green-600" />
        </div>
        <h2 className="mt-6 font-display text-3xl font-extrabold tracking-tight">Thank you — we’ve got it!</h2>
        <p className="mx-auto mt-3 max-w-md text-steel-500">
          Your {kind === "quotation" ? "quotation request" : "message"} has been sent to our sales team. A confirmation email is on its way.
        </p>
        <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-steel-100 px-4 py-2 text-sm">
          Reference <b className="font-mono">{reference}</b>
        </p>
        <p className="mt-6 text-sm text-steel-500">
          Urgent? Call us on <a className="font-semibold text-ink" href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
        </p>
        <Link href="/products" className="btn-dark mt-8">
          Continue browsing <ArrowRight className="size-4" />
        </Link>
      </div>
    );

  const field = (name: string) => ({
    name,
    id: name,
    "aria-invalid": errors[name] ? true : undefined,
    className: `input ${errors[name] ? "border-red-400 ring-4 ring-red-50" : ""}`,
  });
  const Err = ({ name }: { name: string }) => (errors[name] ? <p className="mt-1.5 text-sm text-red-600">{errors[name]}</p> : null);

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-3xl border border-steel-200 bg-white p-5 md:p-8">
      <h2 className="font-display text-xl font-bold">{kind === "quotation" ? "Your business details" : "Send us a message"}</h2>
      <p className="mt-1 text-sm text-steel-500">Fields marked * are required.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="businessName" className="label">Business name *</label>
          <input {...field("businessName")} autoComplete="organization" placeholder="e.g. The Copper Pot Bistro" />
          <Err name="businessName" />
        </div>
        <div>
          <label htmlFor="contactName" className="label">Contact person *</label>
          <input {...field("contactName")} autoComplete="name" placeholder="Full name" />
          <Err name="contactName" />
        </div>
        <div>
          <label htmlFor="phone" className="label">Phone / WhatsApp *</label>
          <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" />
          <Err name="phone" />
        </div>
        <div>
          <label htmlFor="email" className="label">Email *</label>
          <input {...field("email")} type="email" inputMode="email" autoComplete="email" placeholder="you@business.com" />
          <Err name="email" />
        </div>
        <div>
          <label htmlFor="city" className="label">City *</label>
          <input {...field("city")} list="cities" autoComplete="address-level2" placeholder="Delivery / site city" />
          <datalist id="cities">
            {site.cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <Err name="city" />
        </div>
        <div>
          <label htmlFor="businessType" className="label">Business type</label>
          <select {...field("businessType")} defaultValue="">
            <option value="" disabled>Select…</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className="label">When do you need it?</label>
          <select {...field("timeline")} defaultValue="">
            <option value="" disabled>Select…</option>
            {TIMELINES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="requirements" className="label">
            {kind === "quotation" ? "Requirements & notes" : "Message"}
          </label>
          <textarea
            {...field("requirements")}
            rows={5}
            placeholder={
              kind === "quotation"
                ? "Anything we should know — gas type (LPG/PNG), power supply, site dimensions, items not listed on the website…"
                : "How can we help?"
            }
          />
          <Err name="requirements" />
        </div>
        {/* honeypot */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      </div>

      {status === "error" && (
        <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          Something went wrong sending your request. Please try again or call {site.phone}.
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary mt-6 h-14 w-full text-base">
        {status === "sending" ? <Loader2 className="size-5 animate-spin" /> : null}
        {kind === "quotation" ? `Request quotation${items.length ? ` for ${items.length} product${items.length === 1 ? "" : "s"}` : ""}` : "Send message"}
      </button>
      <p className="mt-3 text-center text-xs text-steel-500">We’ll only use your details to respond to this enquiry.</p>
    </form>
  );
}
