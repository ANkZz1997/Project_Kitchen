"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { searchProducts } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import ProductThumb from "./ProductThumb";

export type SearchIndexItem = Pick<Product, "slug" | "name" | "model" | "summary" | "art" | "images" | "category">;

export default function SearchBox({
  index,
  variant = "header",
  autoFocus,
  onNavigate,
}: {
  index: SearchIndexItem[];
  variant?: "header" | "hero";
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  const results = useMemo(() => (q.trim() ? searchProducts(index as Product[], q, 6) : []), [q, index]);

  useEffect(() => {
    const close = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setFocus(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => setActive(0), [q]);

  const go = (href: string) => {
    setFocus(false);
    setQ("");
    onNavigate?.();
    router.push(href);
  };

  const submit = () => {
    if (results[active] && q) go(`/products/${results[active].slug}`);
    else go(`/products?q=${encodeURIComponent(q)}`);
  };

  const hero = variant === "hero";

  return (
    <div ref={wrap} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className={`flex items-center gap-2 rounded-full border transition ${
          hero
            ? "h-14 border-white/10 bg-white pl-5 pr-1.5 shadow-2xl sm:h-16"
            : "h-11 border-steel-200 bg-steel-50 pl-4 pr-1 focus-within:border-ink focus-within:bg-white"
        }`}
      >
        <Search className={`shrink-0 text-steel-400 ${hero ? "size-5" : "size-4"}`} />
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") (e.preventDefault(), setActive((a) => Math.min(a + 1, results.length - 1)));
            if (e.key === "ArrowUp") (e.preventDefault(), setActive((a) => Math.max(a - 1, 0)));
            if (e.key === "Escape") setFocus(false);
          }}
          placeholder={hero ? "Product name or model no. — e.g. TC-CB101" : "Search products or model no."}
          className={`min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-steel-400 ${hero ? "text-base" : "text-sm"}`}
          aria-label="Search products"
          aria-autocomplete="list"
        />
        {hero && (
          <button type="submit" className="btn-primary h-11 px-4 sm:h-13 sm:px-6">
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="size-4 sm:hidden" />
          </button>
        )}
      </form>

      {focus && q.trim() && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-steel-200 bg-white text-ink shadow-2xl animate-fade-up">
          {results.length ? (
            <ul className="max-h-96 overflow-y-auto p-2">
              {results.map((r, i) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(`/products/${r.slug}`)}
                    className={`flex w-full items-center gap-3 rounded-xl p-2 text-left ${i === active ? "bg-steel-100" : ""}`}
                  >
                    <span className="size-12 shrink-0 overflow-hidden rounded-lg border border-steel-100">
                      <ProductThumb art={r.art} image={r.images[0]} alt="" className="size-full" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{r.name}</span>
                      <span className="block font-mono text-xs text-steel-500">{r.model}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-5 text-sm text-steel-500">No products match “{q}”. Try a model number or a broader term.</p>
          )}
          <Link
            href={`/products?q=${encodeURIComponent(q)}`}
            onClick={() => (setFocus(false), onNavigate?.())}
            className="flex items-center justify-between border-t border-steel-100 bg-steel-50 px-4 py-3 text-sm font-semibold hover:text-flame"
          >
            See all results for “{q}” <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
