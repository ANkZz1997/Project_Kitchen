"use client";

import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import ProductThumb from "../ProductThumb";
import { useEnquiry } from "./EnquiryProvider";
import QtyStepper from "./QtyStepper";

export default function EnquiryList() {
  const { items, setQty, remove, count, ready } = useEnquiry();

  if (!ready) return <div className="h-64 animate-pulse rounded-3xl bg-steel-100" />;

  return (
    <div className="rounded-3xl border border-steel-200 bg-white">
      <div className="flex items-center justify-between border-b border-steel-100 p-5">
        <h2 className="font-display text-xl font-bold">Selected products</h2>
        <span className="rounded-full bg-steel-100 px-3 py-1 text-sm font-semibold">
          {items.length} items · {count} units
        </span>
      </div>
      {items.length === 0 ? (
        <div className="p-8 text-center">
          <p className="font-semibold">No products added yet</p>
          <p className="mt-1 text-sm text-steel-500">
            You can still send your requirement as text, or browse the catalogue to add products.
          </p>
          <Link href="/products" className="btn-dark mt-5">
            <Plus className="size-4" /> Add products
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-steel-100">
            {items.map((i) => (
              <li key={i.slug} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
                <span className="size-16 shrink-0 overflow-hidden rounded-xl border border-steel-100">
                  <ProductThumb art={i.art} image={i.image} alt={i.name} className="size-full" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-steel-500">{i.brand} · {i.model}</p>
                  <Link href={`/products/${i.slug}`} className="line-clamp-2 font-semibold hover:text-flame">
                    {i.name}
                  </Link>
                </div>
                <div className="flex w-full items-center justify-between gap-2 sm:w-auto">
                  <QtyStepper size="sm" value={i.quantity} onChange={(q) => setQty(i.slug, q)} />
                  <button
                    onClick={() => remove(i.slug)}
                    className="grid size-9 place-items-center rounded-full text-steel-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${i.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-steel-100 p-4">
            <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-flame">
              <Plus className="size-4" /> Add more products
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
