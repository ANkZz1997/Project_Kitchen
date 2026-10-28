import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductThumb from "./ProductThumb";
import { AddToEnquiryIcon } from "./enquiry/AddToEnquiry";

export default function ProductCard({
  product: p,
  brandName,
  categoryName,
  index = 0,
}: {
  product: Product;
  brandName: string;
  categoryName?: string;
  index?: number;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-steel-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-steel-300 hover:shadow-[0_24px_48px_-24px_rgb(15_17_20/0.35)]">
      <Link href={`/products/${p.slug}`} className="relative block aspect-[4/3.4] overflow-hidden">
        <ProductThumb
          art={p.art}
          image={p.images[0]}
          alt={p.name}
          tone={index}
          className="size-full transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {p.isNew && <span className="rounded-full bg-flame px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">New</span>}
          {categoryName && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-steel-600 backdrop-blur">
              {categoryName}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1 border-t border-steel-100 p-4">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-steel-500">
          {brandName}
          <span className="size-1 rounded-full bg-steel-300" />
          <span className="font-mono normal-case tracking-normal">{p.model}</span>
        </p>
        <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug">
          <Link href={`/products/${p.slug}`} className="after:absolute after:inset-0 hover:text-flame">
            {p.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-steel-500">{p.summary}</p>
        <div className="relative z-10 mt-auto flex items-center justify-between pt-3">
          <span className="text-[12px] font-medium text-steel-500">Price on request</span>
          <AddToEnquiryIcon
            item={{ slug: p.slug, name: p.name, model: p.model, brand: brandName, art: p.art, image: p.images[0] }}
          />
        </div>
      </div>
    </article>
  );
}
