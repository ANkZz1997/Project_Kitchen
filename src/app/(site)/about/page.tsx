import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Handshake, MapPin, Users } from "lucide-react";
import EquipmentArt from "@/components/EquipmentArt";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About us" };

const timeline = [
  { year: "2004", text: "Started as a stainless-steel fabrication workshop in Mumbai." },
  { year: "2010", text: "Became authorised distributor for European cooking and refrigeration brands." },
  { year: "2016", text: "Opened service centres in Pune and Bengaluru with a dedicated spares warehouse." },
  { year: "2022", text: "Crossed 1,500 commercial kitchens equipped across India." },
  { year: "2026", text: "Launched the online catalogue and one-click quotation requests." },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-x grid items-center gap-12 py-14 md:py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow">About {site.name}</p>
          <h1 className="text-balance mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Two decades of building kitchens that work.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-steel-600">
            We supply, install and service commercial kitchen equipment for restaurants, cafés, hotels, cloud kitchens and
            institutional caterers. Our engineers plan around your menu and your space — then stay on to keep everything running.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-dark">Explore products <ArrowRight className="size-4" /></Link>
            <Link href="/contact" className="btn-ghost">Contact us</Link>
          </div>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          <div className="space-y-4 pt-10">
            <div className="overflow-hidden rounded-3xl border border-steel-200"><EquipmentArt kind="range" /></div>
            <div className="overflow-hidden rounded-3xl border border-steel-200"><EquipmentArt kind="dishwasher" tone={2} /></div>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-steel-200"><EquipmentArt kind="fridge" tone={1} /></div>
            <div className="overflow-hidden rounded-3xl border border-steel-200"><EquipmentArt kind="deckoven" tone={3} /></div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-14 text-white md:py-20">
        <dl className="container-x grid grid-cols-2 gap-8 md:grid-cols-4">
          {site.stats.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-4xl font-extrabold md:text-5xl">{s.value}</dt>
              <dd className="mt-2 text-steel-400">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="container-x grid gap-12 py-14 md:py-20 lg:grid-cols-2">
        <div>
          <p className="eyebrow">What we stand for</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">Why kitchens choose us</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Award, t: "Authorised dealer", d: "Genuine products with full manufacturer warranty." },
              { icon: Users, t: "In-house engineers", d: "Certified technicians for installation and service." },
              { icon: Handshake, t: "Honest advice", d: "We recommend what your menu needs — nothing more." },
              { icon: MapPin, t: "Pan-India reach", d: `Service network across ${site.cities.length}+ cities.` },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-steel-200 bg-white p-5">
                <Icon className="size-6 text-flame" />
                <h3 className="mt-4 font-bold">{t}</h3>
                <p className="mt-1 text-sm text-steel-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">Our journey</p>
          <ol className="relative mt-6 space-y-8 border-l-2 border-steel-200 pl-8">
            {timeline.map((t) => (
              <li key={t.year} className="relative">
                <span className="absolute -left-[41px] top-1 size-4 rounded-full border-4 border-steel-50 bg-flame" />
                <p className="font-display text-xl font-extrabold">{t.year}</p>
                <p className="mt-1 text-steel-600">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
