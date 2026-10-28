import Link from "next/link";
import { FileCheck2, ImageOff, Plus, Search } from "lucide-react";
import ProductThumb from "@/components/ProductThumb";
import { matchesQuery } from "@/lib/catalog";
import { productIssues } from "@/lib/health";
import { getBrands, getCategories, getProducts } from "@/lib/store";

type Props = { searchParams: Promise<{ q?: string; category?: string; issue?: string }> };

export default async function AdminProducts({ searchParams }: Props) {
  const { q = "", category = "", issue = "" } = await searchParams;
  const categories = getCategories();
  const brands = getBrands();
  const all = await getProducts();
  const list = all.filter((p) => {
    if (!matchesQuery(p, q)) return false;
    if (category && p.category !== category) return false;
    if (issue === "photos" && p.images.length) return false;
    if (issue === "brochure" && p.brochure) return false;
    if (issue === "any" && !productIssues(p).length) return false;
    return true;
  });

  const filters = [
    { v: "", l: "All" },
    { v: "any", l: "Needs attention" },
    { v: "photos", l: "No photos" },
    { v: "brochure", l: "No brochure" },
  ];
  const qs = (patch: Record<string, string>) => {
    const p = new URLSearchParams({ q, category, issue, ...patch });
    [...p.keys()].forEach((k) => !p.get(k) && p.delete(k));
    return `?${p}`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Products</h1>
          <p className="mt-1 text-steel-500">{all.length} products in the catalogue</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="size-4" /> Add product
        </Link>
      </div>

      <form className="mt-6 flex flex-wrap gap-2">
        <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-steel-200 bg-white px-3 focus-within:border-ink">
          <Search className="size-4 text-steel-400" />
          <input name="q" defaultValue={q} placeholder="Search name or model" className="min-w-0 flex-1 text-sm outline-none" />
        </label>
        <select name="category" defaultValue={category} className="h-11 rounded-xl border border-steel-200 bg-white px-3 text-sm">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        {issue && <input type="hidden" name="issue" value={issue} />}
        <button className="btn-dark h-11 rounded-xl">Filter</button>
      </form>

      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {filters.map((f) => (
          <Link
            key={f.v}
            href={qs({ issue: f.v })}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ${issue === f.v ? "bg-ink text-white" : "bg-white text-steel-600 ring-1 ring-steel-200"}`}
          >
            {f.l}
          </Link>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-steel-200 bg-white">
        <table className="w-full text-sm">
          <thead className="hidden bg-steel-50 text-left text-xs uppercase tracking-wider text-steel-500 md:table-header-group">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Assets</th>
              <th className="px-4 py-3 font-semibold">Content check</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-100">
            {list.map((p) => {
              const issues = productIssues(p);
              return (
                <tr key={p.slug} className="relative hover:bg-steel-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="size-12 shrink-0 overflow-hidden rounded-lg border border-steel-100">
                        <ProductThumb art={p.art} image={p.images[0]} alt="" className="size-full" />
                      </span>
                      <span className="min-w-0">
                        <Link href={`/admin/products/${p.slug}`} className="block font-semibold after:absolute after:inset-0 hover:text-flame">
                          {p.name}
                        </Link>
                        <span className="font-mono text-xs text-steel-500">
                          {p.model} · {brands.find((b) => b.slug === p.brand)?.name}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-steel-600 md:table-cell">{categories.find((c) => c.slug === p.category)?.name}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="flex gap-2">
                      <span title="Photos" className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${p.images.length ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                        <ImageOff className="size-3.5" /> {p.images.length}
                      </span>
                      <span title="Brochure" className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${p.brochure ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                        <FileCheck2 className="size-3.5" /> {p.brochure ? "PDF" : "Auto"}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    {issues.length ? (
                      <span className="text-xs text-amber-700" title={issues.map((i) => i.text).join("\n")}>
                        {issues.length} item{issues.length > 1 ? "s" : ""} to review
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-green-700">Complete</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!list.length && <p className="p-10 text-center text-sm text-steel-500">No products match these filters.</p>}
      </div>
    </div>
  );
}
