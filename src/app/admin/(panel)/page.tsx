import Link from "next/link";
import { AlertTriangle, ArrowRight, FileWarning, ImageOff, Inbox, Package } from "lucide-react";
import { productIssues } from "@/lib/health";
import { getCategories, getEnquiries, getProducts } from "@/lib/store";

export default async function AdminHome() {
  const [products, enquiries] = [await getProducts(), await getEnquiries()];
  const categories = getCategories();
  const noPhotos = products.filter((p) => !p.images.length).length;
  const noBrochure = products.filter((p) => !p.brochure).length;
  const withWarnings = products.filter((p) => productIssues(p).length > 0).length;
  const complete = products.length - withWarnings;
  const pct = Math.round((complete / Math.max(1, products.length)) * 100);

  const stats = [
    { label: "Products", value: products.length, icon: Package, href: "/admin/products" },
    { label: "New enquiries", value: enquiries.filter((e) => e.status === "new").length, icon: Inbox, href: "/admin/enquiries" },
    { label: "Missing photos", value: noPhotos, icon: ImageOff, href: "/admin/products?issue=photos" },
    { label: "Missing brochures", value: noBrochure, icon: FileWarning, href: "/admin/products?issue=brochure" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Overview</h1>
      <p className="mt-1 text-steel-500">Catalogue health and latest customer enquiries.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="rounded-2xl border border-steel-200 bg-white p-5 transition hover:border-ink">
            <Icon className="size-5 text-flame" />
            <p className="mt-4 font-display text-3xl font-extrabold">{value}</p>
            <p className="text-sm text-steel-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <section className="rounded-2xl border border-steel-200 bg-white p-6">
          <h2 className="font-bold">Content completeness</h2>
          <p className="mt-1 text-sm text-steel-500">Products with photos, brochure, dimensions and power data.</p>
          <div className="mt-6 flex items-end gap-3">
            <span className="font-display text-5xl font-extrabold">{pct}%</span>
            <span className="pb-2 text-sm text-steel-500">{complete} of {products.length} ready</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-steel-100">
            <div className="h-full rounded-full bg-flame" style={{ width: `${Math.max(pct, 2)}%` }} />
          </div>
          <ul className="mt-6 space-y-3">
            {categories.map((c) => {
              const list = products.filter((p) => p.category === c.slug);
              const ok = list.filter((p) => !productIssues(p).length).length;
              return (
                <li key={c.slug} className="flex items-center justify-between text-sm">
                  <span>{c.name}</span>
                  <span className="font-mono text-steel-500">{ok}/{list.length}</span>
                </li>
              );
            })}
          </ul>
          {withWarnings > 0 && (
            <div className="mt-6 flex gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
              <AlertTriangle className="size-5 shrink-0" />
              <p>
                {withWarnings} products need attention before launch — typically photographs and brochures still to be supplied.{" "}
                <Link href="/admin/products?issue=any" className="font-semibold underline">Review list</Link>
              </p>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-steel-200 bg-white">
          <div className="flex items-center justify-between border-b border-steel-100 p-5">
            <h2 className="font-bold">Latest enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm font-semibold hover:text-flame">View all</Link>
          </div>
          {enquiries.length === 0 ? (
            <div className="p-10 text-center text-sm text-steel-500">
              No enquiries yet. Submit one from the{" "}
              <Link href="/products" target="_blank" className="font-semibold text-ink underline">website</Link> to see it here.
            </div>
          ) : (
            <ul className="divide-y divide-steel-100">
              {enquiries.slice(0, 6).map((e) => (
                <li key={e.id}>
                  <Link href={`/admin/enquiries/${e.id}`} className="flex items-center gap-4 p-4 hover:bg-steel-50">
                    <span className={`size-2 shrink-0 rounded-full ${e.status === "new" ? "bg-flame" : "bg-steel-300"}`} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{e.businessName}</span>
                      <span className="block text-sm text-steel-500">
                        {e.city} · {e.items.length ? `${e.items.length} products` : "General message"}
                      </span>
                    </span>
                    <span className="hidden font-mono text-xs text-steel-400 sm:block">{e.reference}</span>
                    <ArrowRight className="size-4 text-steel-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
