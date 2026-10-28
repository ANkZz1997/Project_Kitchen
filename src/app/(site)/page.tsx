import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardCheck,
  FileDown,
  Hammer,
  Headset,
  MessageSquareQuote,
  PencilRuler,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import EquipmentArt from "@/components/EquipmentArt";
import ProductCard from "@/components/ProductCard";
import SearchBox from "@/components/SearchBox";
import { getBrands, getCategories, getProducts } from "@/lib/store";
import { site } from "@/lib/site";

export default async function HomePage() {
  const products = await getProducts();
  const categories = getCategories();
  const brands = getBrands();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const brandName = (slug: string) => brands.find((b) => b.slug === slug)?.name ?? slug;
  const index = products.map(({ slug, name, model, summary, art, images, category }) => ({ slug, name, model, summary, art, images, category }));

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]" />
        <div className="absolute -right-40 -top-40 size-[640px] rounded-full bg-flame/20 blur-[140px]" />
        <div className="container-x relative grid items-center gap-12 pb-16 pt-12 md:pt-20 lg:grid-cols-[1.1fr_1fr] lg:pb-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-steel-300">
              <span className="size-1.5 rounded-full bg-flame shadow-[0_0_12px_#ff5c1f]" />
              {products.length} product lines · {brands.length} brands · Pan-India installation
            </span>
            <h1 className="text-balance mt-6 font-display text-[40px] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[68px]">
              Equip your kitchen.
              <br />
              <span className="bg-gradient-to-r from-flame via-[#ff8a4c] to-ember bg-clip-text text-transparent">One quote</span> for
              everything.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-steel-300">
              Browse commercial cooking, refrigeration, prep, dishwashing, coffee and bakery equipment. Add everything you need to a
              single enquiry — our team replies with pricing within 48 hours.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBox index={index} variant="hero" />
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-steel-500">Popular:</span>
                {["Combi oven", "Reach-in refrigerator", "Espresso", "Dishwasher", "TC-FG215"].map((t) => (
                  <Link
                    key={t}
                    href={`/products?q=${encodeURIComponent(t)}`}
                    className="rounded-full border border-white/10 px-3 py-1 text-steel-300 transition hover:border-white/30 hover:text-white"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* hero composition */}
          <div className="relative mx-auto hidden w-full max-w-lg animate-fade-up [animation-delay:150ms] sm:block">
            <div className="relative aspect-square">
              <div className="absolute left-0 top-6 w-[62%] rotate-[-4deg] overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
                <EquipmentArt kind="combi" className="w-full" />
                <div className="border-t border-steel-100 px-4 py-3 text-ink">
                  <p className="font-mono text-[11px] text-steel-500">TC-CB101</p>
                  <p className="text-sm font-bold">Combi Steam Oven 10 × GN 1/1</p>
                </div>
              </div>
              <div className="absolute bottom-2 right-0 w-[56%] rotate-[3deg] overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl">
                <EquipmentArt kind="espresso" tone={1} className="w-full" />
                <div className="border-t border-steel-100 px-4 py-3 text-ink">
                  <p className="font-mono text-[11px] text-steel-500">CM-E2G</p>
                  <p className="text-sm font-bold">2-Group Espresso Machine</p>
                </div>
              </div>
              {/* enquiry card */}
              <div className="absolute -left-4 bottom-10 w-64 rounded-2xl border border-white/10 bg-ink-2/95 p-4 shadow-2xl backdrop-blur lg:-left-10">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-flame">Your enquiry</p>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px]">3 items</span>
                </div>
                {[
                  ["Combi Steam Oven", 1],
                  ["2-Group Espresso", 2],
                  ["Under-counter Chiller", 3],
                ].map(([n, q]) => (
                  <div key={n} className="mt-2.5 flex items-center justify-between text-sm">
                    <span className="text-steel-300">{n}</span>
                    <span className="font-mono text-xs text-white">× {q}</span>
                  </div>
                ))}
                <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-flame py-2 text-xs font-bold">
                  Request quotation <ArrowRight className="size-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <dl className="container-x grid grid-cols-2 md:grid-cols-4">
            {site.stats.map((s, i) => (
              <div key={s.label} className={`py-6 md:py-8 ${i % 2 ? "pl-6" : ""} ${i > 0 ? "md:border-l md:border-white/10 md:pl-8" : ""}`}>
                <dt className="font-display text-3xl font-extrabold md:text-4xl">{s.value}</dt>
                <dd className="mt-1 text-sm text-steel-400">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* BRANDS MARQUEE */}
      <section className="border-b border-steel-200 bg-white py-6">
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-16 pr-16">
            {[...brands, ...brands].map((b, i) => (
              <Link
                key={i}
                href={`/products?brand=${b.slug}`}
                className="flex items-baseline gap-2 whitespace-nowrap font-display text-2xl font-extrabold tracking-tight text-steel-300 transition hover:text-ink"
              >
                {b.name}
                <span className="text-[10px] font-semibold uppercase tracking-widest">{b.origin}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-x py-16 md:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-5xl">Everything a commercial kitchen needs</h2>
          </div>
          <Link href="/products" className="group flex items-center gap-1.5 font-semibold">
            View full catalogue <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className={`group relative flex min-h-64 overflow-hidden rounded-3xl border border-steel-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_32px_64px_-32px_rgb(15_17_20/0.4)] ${
                  i === 0 ? "lg:row-span-2 lg:min-h-[540px]" : i === categories.length - 1 ? "sm:col-span-2 lg:col-span-3" : ""
                }`}
              >
                <div className="relative z-10 flex max-w-[60%] flex-col">
                  <span className="font-mono text-xs text-steel-400">0{i + 1} / {count} products</span>
                  <h3 className="mt-2 font-display text-2xl font-bold leading-tight">{c.name}</h3>
                  <p className="mt-2 text-sm text-steel-500">{c.short}</p>
                  <span className="mt-auto grid size-11 place-items-center rounded-full bg-steel-100 transition group-hover:bg-flame group-hover:text-white">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
                <EquipmentArt
                  kind={c.art}
                  plain
                  className={`absolute transition duration-500 group-hover:scale-105 ${
                    i === 0
                      ? "-right-6 bottom-0 w-[60%] sm:w-[85%] lg:w-[110%]"
                      : i === categories.length - 1
                        ? "-right-8 bottom-0 w-[62%] sm:right-10 sm:w-80"
                        : "-right-8 bottom-0 w-[62%]"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How quoting works</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-5xl">From shortlist to quotation in three steps</h2>
            <p className="mt-4 text-steel-500">No more back-and-forth over PDF catalogues. Build one list, send it once, get one consolidated quote.</p>
          </div>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: Search, title: "Browse & compare", text: "Search by product name or model number and filter by category or brand. Download spec-sheet brochures." },
              { icon: ClipboardCheck, title: "Build your enquiry", text: "Add multiple products with quantities to one enquiry list. It’s saved on your device while you browse." },
              { icon: MessageSquareQuote, title: "Receive a quotation", text: "Share your business and city details. Our sales team responds with pricing, availability and lead times." },
            ].map((s, i) => (
              <li key={s.title} className="relative rounded-3xl border border-steel-200 bg-steel-50 p-8">
                <span className="absolute right-6 top-5 font-display text-6xl font-extrabold text-steel-200">{i + 1}</span>
                <span className="grid size-12 place-items-center rounded-2xl bg-ink text-white">
                  <s.icon className="size-6" />
                </span>
                <h3 className="mt-6 font-display text-xl font-bold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-steel-500">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-x py-16 md:py-24">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Best sellers</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-5xl">Specified by top kitchens</h2>
          </div>
          <Link href="/products" className="btn-ghost self-start md:self-auto">
            All {products.length} products <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} brandName={brandName(p.brand)} index={i} />
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative overflow-hidden bg-ink py-16 text-white md:py-24">
        <div className="grid-lines absolute inset-0 opacity-60" />
        <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">More than equipment</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-5xl">A partner from layout to after-sales</h2>
            <p className="mt-4 max-w-md text-steel-400">
              We help restaurants, cafés, hotels and cloud kitchens plan, install and maintain kitchens that keep up with service.
            </p>
            <Link href="/about" className="btn-ghost-dark mt-8">
              About us <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {[
              { icon: PencilRuler, title: "Kitchen layout planning", text: "Workflow-led layouts with gas, power and drainage points marked." },
              { icon: Truck, title: "Delivery & installation", text: "Site delivery, gas/electrical hook-up and commissioning." },
              { icon: Hammer, title: "Custom SS fabrication", text: "Tables, sinks and hoods built to your exact dimensions." },
              { icon: Headset, title: "Service & AMC", text: "Genuine spares and annual maintenance contracts." },
            ].map((s) => (
              <div key={s.title} className="bg-ink-2 p-7">
                <s.icon className="size-6 text-flame" />
                <h3 className="mt-5 font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-steel-400">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL + CTA */}
      <section className="container-x grid gap-6 py-16 md:py-24 lg:grid-cols-2">
        <figure className="flex flex-col justify-between rounded-3xl border border-steel-200 bg-white p-8 md:p-10">
          <blockquote className="font-display text-2xl font-bold leading-snug tracking-tight md:text-3xl">
            “We sent one enquiry for our entire cloud kitchen — 23 items — and had a consolidated quote the next morning. Installation
            was done in four days.”
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-steel-100 font-bold">RK</span>
            <span>
              <span className="block font-semibold">Operations Head</span>
              <span className="text-sm text-steel-500">Multi-brand cloud kitchen, Pune</span>
            </span>
          </figcaption>
        </figure>
        <div className="relative overflow-hidden rounded-3xl bg-flame p-8 text-white md:p-10">
          <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -right-10 size-40 rounded-full bg-white/10" />
          <h2 className="relative font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
            Opening or upgrading a kitchen?
          </h2>
          <p className="relative mt-3 max-w-md text-white/85">
            Send us your menu or floor plan and we’ll recommend the right equipment — free of charge.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn bg-white text-ink hover:bg-ink hover:text-white">
              Talk to an expert <ArrowRight className="size-4" />
            </Link>
            <Link href="/products" className="btn border border-white/40 hover:bg-white/10">
              <FileDown className="size-4" /> Browse brochures
            </Link>
          </div>
          <p className="relative mt-8 flex items-center gap-2 text-sm text-white/85">
            <ShieldCheck className="size-4" /> Authorised dealer · Genuine warranty on every product
          </p>
        </div>
      </section>
    </>
  );
}
