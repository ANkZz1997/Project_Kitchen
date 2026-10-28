"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Check, LayoutGrid, Rows3, Search, SlidersHorizontal, X } from "lucide-react";
import { matchesQuery, scoreProduct } from "@/lib/catalog";
import type { Brand, Category, Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import ProductThumb from "./ProductThumb";
import { AddToEnquiryIcon } from "./enquiry/AddToEnquiry";

type Sort = "relevance" | "name" | "newest";

export default function ProductBrowser({
  products,
  categories,
  brands,
}: {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const cats = useMemo(() => params.getAll("category"), [params]);
  const brs = useMemo(() => params.getAll("brand"), [params]);
  const sort = (params.get("sort") as Sort) ?? "relevance";
  const [sheet, setSheet] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  // keep local search box in sync with back/forward navigation
  useEffect(() => setQ(params.get("q") ?? ""), [params]);

  const update = (mut: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString());
    mut(next);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  // debounce search → URL
  useEffect(() => {
    if ((params.get("q") ?? "") === q) return;
    const t = setTimeout(() => update((p) => (q ? p.set("q", q) : p.delete("q"))), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const toggle = (key: "category" | "brand", value: string) =>
    update((p) => {
      const cur = p.getAll(key);
      p.delete(key);
      (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]).forEach((v) => p.append(key, v));
    });

  const brandName = (slug: string) => brands.find((b) => b.slug === slug)?.name ?? slug;
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  const base = useMemo(() => products.filter((p) => matchesQuery(p, q)), [products, q]);
  const filtered = useMemo(() => {
    const list = base.filter((p) => (!cats.length || cats.includes(p.category)) && (!brs.length || brs.includes(p.brand)));
    if (sort === "name") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "newest") return [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    if (q) return [...list].sort((a, b) => scoreProduct(b, q) - scoreProduct(a, q));
    return list;
  }, [base, cats, brs, sort, q]);

  // facet counts respect the other active filter
  const catCount = (slug: string) => base.filter((p) => p.category === slug && (!brs.length || brs.includes(p.brand))).length;
  const brandCount = (slug: string) => base.filter((p) => p.brand === slug && (!cats.length || cats.includes(p.category))).length;

  const activeCount = cats.length + brs.length;
  const clearAll = () => {
    setQ("");
    router.replace(pathname, { scroll: false });
  };

  const Facets = (
    <div className="space-y-8">
      <FacetGroup title="Category">
        {categories.map((c) => (
          <FacetOption
            key={c.slug}
            label={c.name}
            count={catCount(c.slug)}
            checked={cats.includes(c.slug)}
            onChange={() => toggle("category", c.slug)}
          />
        ))}
      </FacetGroup>
      <FacetGroup title="Brand">
        {brands.map((b) => (
          <FacetOption
            key={b.slug}
            label={b.name}
            sub={b.origin}
            count={brandCount(b.slug)}
            checked={brs.includes(b.slug)}
            onChange={() => toggle("brand", b.slug)}
          />
        ))}
      </FacetGroup>
    </div>
  );

  return (
    <div className="container-x grid gap-8 py-8 lg:grid-cols-[260px_1fr] lg:py-12">
      <aside className="hidden lg:block">
        <div className="sticky top-32">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Filters</h2>
            {activeCount > 0 && (
              <button onClick={() => update((p) => (p.delete("category"), p.delete("brand")))} className="text-sm font-semibold text-flame">
                Reset
              </button>
            )}
          </div>
          {Facets}
        </div>
      </aside>

      <div className="min-w-0">
        {/* toolbar */}
        <div className="sticky top-16 z-20 -mx-4 bg-steel-50/95 px-4 pb-3 pt-1 backdrop-blur sm:-mx-6 sm:px-6 md:top-[108px] lg:mx-0 lg:px-0">
          <div className="flex gap-2">
            <label className="flex h-12 flex-1 items-center gap-2 rounded-full border border-steel-200 bg-white px-4 focus-within:border-ink">
              <Search className="size-4 text-steel-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter by name or model number…"
                className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
                aria-label="Search catalogue"
              />
              {q && (
                <button onClick={() => setQ("")} aria-label="Clear search" className="text-steel-400 hover:text-ink">
                  <X className="size-4" />
                </button>
              )}
            </label>
            <button onClick={() => setSheet(true)} className="btn-ghost h-12 px-4 lg:hidden">
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-flame text-[11px] text-white">{activeCount}</span>
              )}
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <p className="text-sm text-steel-500">
              <b className="text-ink">{filtered.length}</b> of {products.length} products
            </p>
            <div className="ml-auto flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => update((p) => (e.target.value === "relevance" ? p.delete("sort") : p.set("sort", e.target.value)))}
                className="h-9 rounded-full border border-steel-200 bg-white px-3 text-sm font-medium outline-none"
                aria-label="Sort"
              >
                <option value="relevance">Recommended</option>
                <option value="name">Name A–Z</option>
                <option value="newest">New arrivals</option>
              </select>
              <div className="hidden rounded-full border border-steel-200 bg-white p-0.5 sm:flex">
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`grid size-8 place-items-center rounded-full ${view === v ? "bg-ink text-white" : "text-steel-500"}`}
                    aria-label={`${v} view`}
                  >
                    {v === "grid" ? <LayoutGrid className="size-4" /> : <Rows3 className="size-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {(activeCount > 0 || q) && (
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {q && <Chip label={`“${q}”`} onRemove={() => setQ("")} />}
              {cats.map((c) => (
                <Chip key={c} label={catName(c)} onRemove={() => toggle("category", c)} />
              ))}
              {brs.map((b) => (
                <Chip key={b} label={brandName(b)} onRemove={() => toggle("brand", b)} />
              ))}
              <button onClick={clearAll} className="shrink-0 px-2 text-sm font-semibold text-steel-500 hover:text-ink">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* results */}
        {filtered.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-steel-300 bg-white p-12 text-center">
            <p className="font-display text-xl font-bold">No matching equipment</p>
            <p className="mx-auto mt-2 max-w-md text-steel-500">
              Try a different model number or remove a filter. Can’t find it? Describe what you need on the enquiry form and our team will source it.
            </p>
            <button onClick={clearAll} className="btn-dark mt-6">
              Reset search
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="mt-4 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <ProductCard key={p.slug} product={p} brandName={brandName(p.brand)} categoryName={cats.length === 1 ? undefined : catName(p.category).split(" ")[0]} index={i} />
            ))}
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-steel-100 overflow-hidden rounded-2xl border border-steel-200 bg-white">
            {filtered.map((p, i) => (
              <li key={p.slug} className="relative flex items-center gap-4 p-3 hover:bg-steel-50">
                <span className="size-20 shrink-0 overflow-hidden rounded-xl">
                  <ProductThumb art={p.art} image={p.images[0]} alt={p.name} tone={i} className="size-full" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-steel-500">
                    {brandName(p.brand)} · {p.model}
                  </p>
                  <Link href={`/products/${p.slug}`} className="font-semibold after:absolute after:inset-0 hover:text-flame">
                    {p.name}
                  </Link>
                  <p className="line-clamp-1 text-sm text-steel-500">{p.summary}</p>
                </div>
                <div className="relative z-10">
                  <AddToEnquiryIcon item={{ slug: p.slug, name: p.name, model: p.model, brand: brandName(p.brand), art: p.art, image: p.images[0] }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* mobile filter sheet */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sheet ? "" : "pointer-events-none"}`}>
        <div onClick={() => setSheet(false)} className={`absolute inset-0 bg-ink/50 transition-opacity ${sheet ? "opacity-100" : "opacity-0"}`} />
        <div
          className={`absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-3xl bg-white transition-transform duration-300 ${
            sheet ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-steel-100 px-5 py-4">
            <h2 className="font-display text-lg font-bold">Filters</h2>
            <button onClick={() => setSheet(false)} className="grid size-10 place-items-center rounded-full hover:bg-steel-100" aria-label="Close filters">
              <X className="size-5" />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-6">{Facets}</div>
          <div className="flex gap-3 border-t border-steel-100 p-4">
            <button onClick={() => update((p) => (p.delete("category"), p.delete("brand")))} className="btn-ghost flex-1">
              Reset
            </button>
            <button onClick={() => setSheet(false)} className="btn-primary flex-[2]">
              Show {filtered.length} products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-steel-500">{title}</legend>
      <div className="space-y-1">{children}</div>
    </fieldset>
  );
}

function FacetOption({
  label,
  sub,
  count,
  checked,
  onChange,
}: {
  label: string;
  sub?: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        checked ? "bg-ink text-white" : "hover:bg-steel-100"
      } ${count === 0 && !checked ? "opacity-40" : ""}`}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`grid size-5 shrink-0 place-items-center rounded-md border ${checked ? "border-flame bg-flame" : "border-steel-300 bg-white"}`}>
        {checked && <Check className="size-3.5 text-white" strokeWidth={3} />}
      </span>
      <span className="flex-1 font-medium">
        {label}
        {sub && <span className={`ml-1.5 text-xs ${checked ? "text-steel-300" : "text-steel-400"}`}>{sub}</span>}
      </span>
      <span className={`text-xs tabular-nums ${checked ? "text-steel-300" : "text-steel-400"}`}>{count}</span>
    </label>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink py-1.5 pl-3 pr-2 text-xs font-semibold text-white hover:bg-ink-3"
    >
      {label}
      <X className="size-3.5" />
    </button>
  );
}
