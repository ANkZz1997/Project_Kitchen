import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, ChevronRight, FileText, Download, Headset, ShieldCheck, Truck, Wrench, CheckCircle2 } from "lucide-react";
import CopyModel from "@/components/CopyModel";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { AddToEnquiryPanel } from "@/components/enquiry/AddToEnquiry";
import { brochureUrl } from "@/lib/catalog";
import { getBrands, getCategories, getProduct, getProducts } from "@/lib/store";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return p ? { title: `${p.name} (${p.model})`, description: p.summary } : {};
}

export default async function ProductPage({ params }: Props) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();

  const brands = getBrands();
  const brand = brands.find((b) => b.slug === p.brand);
  const category = getCategories().find((c) => c.slug === p.category);
  const all = await getProducts();
  const related = all.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  const brandName = (slug: string) => brands.find((b) => b.slug === slug)?.name ?? slug;
  const highlights = p.specs.filter((s) => s.label !== "Warranty").slice(0, 4);

  return (
    <>
      <div className="border-b border-steel-200 bg-white">
        <nav aria-label="Breadcrumb" className="container-x no-scrollbar flex items-center gap-1.5 overflow-x-auto py-3 text-sm text-steel-500">
          <Link href="/" className="shrink-0 hover:text-ink">Home</Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <Link href="/products" className="shrink-0 hover:text-ink">Products</Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <Link href={`/products?category=${p.category}`} className="shrink-0 hover:text-ink">{category?.name}</Link>
          <ChevronRight className="size-3.5 shrink-0" />
          <span className="truncate font-medium text-ink">{p.name}</span>
        </nav>
      </div>

      <section className="container-x grid gap-10 py-8 lg:grid-cols-2 lg:gap-16 lg:py-14">
        <ProductGallery art={p.art} images={p.images} name={p.name} isNew={p.isNew} />

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/products?brand=${p.brand}`}
              className="rounded-full bg-ink px-3 py-1 text-xs font-bold uppercase tracking-wider text-white hover:bg-flame"
            >
              {brand?.name}
            </Link>
            <span className="text-sm text-steel-500">Model</span>
            <CopyModel model={p.model} />
          </div>
          <h1 className="text-balance mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight md:text-[42px]">{p.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-steel-600">{p.summary}</p>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-steel-200 bg-steel-200">
            {highlights.map((s) => (
              <div key={s.label} className="bg-white p-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-steel-400">{s.label.replace(/ \(.*\)/, "")}</dt>
                <dd className="mt-1 text-[15px] font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 rounded-3xl border border-steel-200 bg-white p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-bold">Price on request</p>
                <p className="text-sm text-steel-500">Add to your enquiry — quote within 48 hours.</p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 sm:flex">
                <CalendarClock className="size-3.5" /> {p.leadTime}
              </span>
            </div>
            <AddToEnquiryPanel
              item={{ slug: p.slug, name: p.name, model: p.model, brand: brand?.name ?? p.brand, art: p.art, image: p.images[0] }}
            />
            <a
              href={brochureUrl(p)}
              target="_blank"
              className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-steel-300 p-3 transition hover:border-ink hover:bg-steel-50"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-red-50 text-red-600">
                <FileText className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">Download brochure</span>
                <span className="block text-xs text-steel-500">{p.brochure ? "Manufacturer brochure · PDF" : "Specification sheet · PDF"}</span>
              </span>
              <Download className="mr-1 size-5 text-steel-400" />
            </a>
          </div>

          <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            {[
              { icon: Truck, t: "Delivery & installation" },
              { icon: ShieldCheck, t: "Manufacturer warranty" },
              { icon: Wrench, t: "Service & spares" },
            ].map(({ icon: Icon, t }) => (
              <li key={t} className="flex items-center gap-2 text-steel-600">
                <Icon className="size-4 text-flame" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-steel-200 bg-white">
        <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_1.3fr] lg:py-16">
          <div>
            <p className="eyebrow">Overview</p>
            <h2 className="mt-2 font-display text-2xl font-bold">About this product</h2>
            <p className="mt-4 leading-relaxed text-steel-600">{p.description}</p>
            <h3 className="mt-8 font-bold">Key features</h3>
            <ul className="mt-3 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-steel-600">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-flame" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Specifications</p>
            <h2 className="mt-2 font-display text-2xl font-bold">Technical data</h2>
            <table className="mt-5 w-full overflow-hidden rounded-2xl text-sm">
              <tbody>
                {p.specs.map((s, i) => (
                  <tr key={s.label} className={i % 2 ? "bg-white" : "bg-steel-50"}>
                    <th scope="row" className="w-2/5 px-4 py-3.5 text-left font-semibold text-steel-600">{s.label}</th>
                    <td className="px-4 py-3.5 font-medium">{s.value}</td>
                  </tr>
                ))}
                <tr className={p.specs.length % 2 ? "bg-white" : "bg-steel-50"}>
                  <th scope="row" className="px-4 py-3.5 text-left font-semibold text-steel-600">Brand / origin</th>
                  <td className="px-4 py-3.5 font-medium">{brand?.name} · {brand?.origin}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-ink p-5 text-white">
              <Headset className="size-8 shrink-0 text-flame" />
              <div className="flex-1 text-sm">
                <p className="font-semibold">Need help with gas, power or space requirements?</p>
                <p className="text-steel-400">Call {site.phone} — our engineers will guide you.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-12 lg:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold md:text-3xl">More in {category?.name}</h2>
            <Link href={`/products?category=${p.category}`} className="shrink-0 text-sm font-semibold hover:text-flame">
              View all →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {related.map((r, i) => (
              <ProductCard key={r.slug} product={r} brandName={brandName(r.brand)} index={i + 1} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
