"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, CheckCircle2, ClipboardList, Trash2, X } from "lucide-react";
import { useEnquiry } from "./EnquiryProvider";
import QtyStepper from "./QtyStepper";
import ProductThumb from "../ProductThumb";

export default function EnquiryDrawer() {
  const { items, open, setOpen, setQty, remove, count, toast } = useEnquiry();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname, setOpen]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const hideBar = pathname.startsWith("/enquiry") || pathname.startsWith("/admin");

  return (
    <>
      {/* toast */}
      <div
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center px-4 transition duration-300 ${
          toast ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        {toast && (
          <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink py-2.5 pl-3 pr-2 text-sm text-white shadow-2xl">
            <CheckCircle2 className="size-5 shrink-0 text-flame" />
            <span className="line-clamp-1">{toast}</span>
            <button onClick={() => setOpen(true)} className="shrink-0 rounded-full bg-white/10 px-3 py-1 font-semibold hover:bg-white/20">
              View
            </button>
          </div>
        )}
      </div>

      {/* mobile sticky bar */}
      {!hideBar && count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-steel-200 bg-white/95 p-3 backdrop-blur md:hidden">
          <button onClick={() => setOpen(true)} className="btn-primary w-full justify-between">
            <span className="flex items-center gap-2">
              <ClipboardList className="size-5" />
              {items.length} product{items.length === 1 ? "" : "s"} · {count} unit{count === 1 ? "" : "s"}
            </span>
            <span className="flex items-center gap-1">
              Review enquiry <ArrowRight className="size-4" />
            </span>
          </button>
        </div>
      )}

      {/* drawer */}
      <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          role="dialog"
          aria-label="Your enquiry"
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <header className="flex items-center justify-between border-b border-steel-100 px-5 py-4">
            <div>
              <p className="eyebrow">Quotation request</p>
              <h2 className="font-display text-xl font-bold">Your enquiry list</h2>
            </div>
            <button onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-full hover:bg-steel-100" aria-label="Close">
              <X className="size-5" />
            </button>
          </header>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-steel-100">
                <ClipboardList className="size-8 text-steel-500" />
              </div>
              <p className="font-semibold">Your enquiry list is empty</p>
              <p className="text-sm text-steel-500">Add equipment from the catalogue and request one consolidated quotation.</p>
              <Link href="/products" className="btn-dark">
                Browse products
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-steel-100 overflow-y-auto px-5">
                {items.map((i) => (
                  <li key={i.slug} className="flex gap-4 py-4">
                    <Link href={`/products/${i.slug}`} className="size-20 shrink-0 overflow-hidden rounded-xl border border-steel-100">
                      <ProductThumb art={i.art} image={i.image} alt={i.name} className="size-full" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[11px] text-steel-500">
                        {i.brand} · {i.model}
                      </p>
                      <Link href={`/products/${i.slug}`} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-flame">
                        {i.name}
                      </Link>
                      <div className="mt-2 flex items-center justify-between">
                        <QtyStepper size="sm" value={i.quantity} onChange={(q) => setQty(i.slug, q)} />
                        <button
                          onClick={() => remove(i.slug)}
                          className="grid size-9 place-items-center rounded-full text-steel-400 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remove ${i.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <footer className="space-y-3 border-t border-steel-100 bg-steel-50 p-5">
                <div className="flex justify-between text-sm">
                  <span className="text-steel-500">
                    {items.length} product{items.length === 1 ? "" : "s"}
                  </span>
                  <span className="font-semibold">{count} total units</span>
                </div>
                <p className="text-xs text-steel-500">No prices or payment — our sales team will respond with a tailored quotation.</p>
                <Link href="/enquiry" className="btn-primary w-full">
                  Continue to request quote <ArrowRight className="size-4" />
                </Link>
              </footer>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
