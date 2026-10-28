import type { Metadata } from "next";
import { Suspense } from "react";
import ProductBrowser from "@/components/ProductBrowser";
import ProductCard from "@/components/ProductCard";
import { getBrands, getCategories, getProducts } from "@/lib/store";

export const metadata: Metadata = {
  title: "Products",
  description: "Commercial kitchen equipment catalogue — search by product name or model number and filter by category or brand.",
};

export default async function ProductsPage() {
  const [products, categories, brands] = [await getProducts(), getCategories(), getBrands()];
  return (
    <>
      <section className="border-b border-steel-200 bg-white">
        <div className="container-x py-10 md:py-14">
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">Commercial kitchen equipment</h1>
          <p className="mt-3 max-w-2xl text-steel-500">
            {products.length} products across {categories.length} categories from {brands.length} brands. Add items to your enquiry
            list and request a single consolidated quotation.
          </p>
        </div>
      </section>
      <Suspense
        fallback={
          // Server-rendered grid shown before the filters hydrate (and to crawlers).
          <div className="container-x grid grid-cols-1 gap-4 py-8 min-[480px]:grid-cols-2 lg:py-12 xl:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.slug} product={p} brandName={brands.find((b) => b.slug === p.brand)?.name ?? p.brand} index={i} />
            ))}
          </div>
        }
      >
        <ProductBrowser products={products} categories={categories} brands={brands} />
      </Suspense>
    </>
  );
}
