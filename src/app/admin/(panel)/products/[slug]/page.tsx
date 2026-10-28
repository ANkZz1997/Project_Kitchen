import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { productIssues } from "@/lib/health";
import { getBrands, getCategories, getProduct } from "@/lib/store";

export default async function EditProduct({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = slug === "new" ? null : await getProduct(slug);
  if (slug !== "new" && !product) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 hover:text-ink">
        <ArrowLeft className="size-4" /> Products
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{product ? product.name : "New product"}</h1>
          {product && <p className="mt-1 font-mono text-sm text-steel-500">{product.model}</p>}
        </div>
        {product && (
          <Link href={`/products/${product.slug}`} target="_blank" className="btn-ghost">
            View on site <ExternalLink className="size-4" />
          </Link>
        )}
      </div>
      <ProductForm
        product={product}
        categories={getCategories()}
        brands={getBrands()}
        issues={product ? productIssues(product) : []}
      />
    </div>
  );
}
