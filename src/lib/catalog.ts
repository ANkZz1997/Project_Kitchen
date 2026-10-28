import type { Product } from "./types";

// Shared (client + server) helpers.

export function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function matchesQuery(p: Product, q: string) {
  if (!q.trim()) return true;
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const hay = `${p.name} ${p.model} ${p.summary}`.toLowerCase();
  const hayNorm = normalise(hay);
  return words.every((w) => hay.includes(w) || hayNorm.includes(normalise(w)));
}

export function scoreProduct(p: Product, q: string) {
  const nq = normalise(q);
  if (!nq) return 0;
  if (normalise(p.model) === nq) return 100;
  if (normalise(p.model).startsWith(nq)) return 80;
  if (normalise(p.name).startsWith(nq)) return 60;
  if (normalise(p.name).includes(nq)) return 40;
  return 10;
}

export function searchProducts(products: Product[], q: string, limit = 8) {
  return products
    .filter((p) => matchesQuery(p, q))
    .sort((a, b) => scoreProduct(b, q) - scoreProduct(a, q))
    .slice(0, limit);
}

export function fileUrl(name: string) {
  return `/api/files/${encodeURIComponent(name)}`;
}

export function brochureUrl(p: Pick<Product, "slug">) {
  return `/api/brochure/${p.slug}`;
}
