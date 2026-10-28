import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import EquipmentArt from "@/components/EquipmentArt";
import { getBrands, getCategories, getProducts } from "@/lib/store";

export const metadata: Metadata = { title: "Brands" };

export default async function BrandsPage() {
  const products = await getProducts();
  const categories = getCategories();
  const brands = getBrands();

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="grid-lines absolute inset-0 opacity-70" />
        <div className="container-x relative py-14 md:py-20">
          <p className="eyebrow">Our brands</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl font-extrabold tracking-tight md:text-6xl">
            Authorised partner for {brands.length} leading manufacturers
          </h1>
          <p className="mt-4 max-w-2xl text-steel-400">
            Genuine equipment with manufacturer warranty, local service support and spare parts availability.
          </p>
        </div>
      </section>

      <section className="container-x grid gap-5 py-12 md:grid-cols-2 md:py-16">
        {brands.map((b) => {
          const items = products.filter((p) => p.brand === b.slug);
          const cats = [...new Set(items.map((p) => p.category))]
            .map((slug) => categories.find((c) => c.slug === slug)?.name)
            .filter(Boolean);
          return (
            <Link
              key={b.slug}
              href={`/products?brand=${b.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-steel-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_32px_64px_-32px_rgb(15_17_20/0.4)] md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl font-extrabold tracking-tight">{b.name}</h2>
                  <p className="mt-1 text-sm text-steel-500">
                    {b.origin} · Since {b.founded} · {b.specialty}
                  </p>
                </div>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-steel-100 transition group-hover:bg-flame group-hover:text-white">
                  <ArrowUpRight className="size-5" />
                </span>
              </div>
              <p className="mt-4 max-w-md leading-relaxed text-steel-600">{b.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {cats.map((c) => (
                  <span key={c} className="rounded-full bg-steel-100 px-3 py-1 text-xs font-semibold text-steel-600">
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-steel-100 pt-5">
                <div className="flex -space-x-3">
                  {items.slice(0, 4).map((p, i) => (
                    <span key={p.slug} className="size-12 overflow-hidden rounded-full border-2 border-white bg-steel-100">
                      <EquipmentArt kind={p.art} tone={i} className="size-full" />
                    </span>
                  ))}
                </div>
                <span className="text-sm font-semibold">{items.length} products</span>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}
