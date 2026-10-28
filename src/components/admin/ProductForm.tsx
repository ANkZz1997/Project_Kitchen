"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, FileText, GripVertical, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { removeProduct, saveProduct } from "@/app/admin/actions";
import { brochureUrl, fileUrl } from "@/lib/catalog";
import type { Issue } from "@/lib/health";
import type { Brand, Category, Product } from "@/lib/types";
import EquipmentArt from "../EquipmentArt";

type State = { errors?: Record<string, string>; ok?: boolean; slug?: string; savedAt?: number } | null;

export default function ProductForm({
  product,
  categories,
  brands,
  issues,
}: {
  product: Product | null;
  categories: Category[];
  brands: Brand[];
  issues: Issue[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<State, FormData>(saveProduct, null);
  const [specs, setSpecs] = useState(() =>
    (product?.specs.length ? product.specs : [{ label: "Dimensions (W×D×H)", value: "" }, { label: "Power", value: "" }]).map((s, i) => ({ ...s, id: i })),
  );
  const [images, setImages] = useState(product?.images ?? []);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!state?.ok) return;
    if (state.slug && !product) router.replace(`/admin/products/${state.slug}`);
    else router.refresh();
  }, [state, product, router]);

  // after a save + refresh, show the stored photos and clear pending uploads
  useEffect(() => {
    setImages(product?.images ?? []);
    setNewPreviews([]);
  }, [product?.updatedAt, product?.images]);

  const err = (k: string) => state?.errors?.[k] && <p className="mt-1 text-sm text-red-600">{state.errors[k]}</p>;

  return (
    <form action={action} className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <input type="hidden" name="previousSlug" value={product?.slug ?? ""} />
      <div className="space-y-6">
        <Card title="Basic information">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Product name *</label>
              <input id="name" name="name" defaultValue={product?.name} className="input" />
              {err("name")}
            </div>
            <div>
              <label className="label" htmlFor="model">Model number *</label>
              <input id="model" name="model" defaultValue={product?.model} className="input font-mono uppercase" />
              {err("model")}
            </div>
            <div>
              <label className="label" htmlFor="leadTime">Lead time</label>
              <input id="leadTime" name="leadTime" defaultValue={product?.leadTime} placeholder="e.g. Ex-stock / 2–3 weeks" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="category">Category *</label>
              <select id="category" name="category" defaultValue={product?.category ?? ""} className="input">
                <option value="" disabled>Select…</option>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
              {err("category")}
            </div>
            <div>
              <label className="label" htmlFor="brand">Brand *</label>
              <select id="brand" name="brand" defaultValue={product?.brand ?? ""} className="input">
                <option value="" disabled>Select…</option>
                {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
              </select>
              {err("brand")}
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="summary">Short summary</label>
              <input id="summary" name="summary" defaultValue={product?.summary} className="input" maxLength={160} />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="description">Description</label>
              <textarea id="description" name="description" defaultValue={product?.description} rows={5} className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="features">Key features <span className="font-normal text-steel-400">(one per line)</span></label>
              <textarea id="features" name="features" defaultValue={product?.features.join("\n")} rows={4} className="input" />
            </div>
          </div>
        </Card>

        <Card title="Specifications" action={
          <button type="button" onClick={() => setSpecs([...specs, { label: "", value: "", id: Date.now() }])} className="flex items-center gap-1 text-sm font-semibold text-flame">
            <Plus className="size-4" /> Add row
          </button>
        }>
          <div className="space-y-2">
            {specs.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <GripVertical className="hidden size-4 shrink-0 text-steel-300 sm:block" />
                <input name="specLabel" defaultValue={s.label} placeholder="Label" className="input w-2/5 py-2.5" />
                <input name="specValue" defaultValue={s.value} placeholder="Value" className="input flex-1 py-2.5" />
                <button type="button" onClick={() => setSpecs(specs.filter((x) => x.id !== s.id))} className="grid size-10 shrink-0 place-items-center rounded-lg text-steel-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove row">
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Photographs">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((img) => (
              <div key={img} className="group relative aspect-square overflow-hidden rounded-xl border border-steel-200">
                <input type="hidden" name="keepImage" value={img} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fileUrl(img)} alt="" className="size-full object-contain" />
                <button type="button" onClick={() => setImages(images.filter((x) => x !== img))} className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-white/90 text-red-600 shadow" aria-label="Remove photo">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
            {newPreviews.map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-flame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="size-full object-contain" />
                <span className="absolute bottom-1 left-1 rounded bg-flame px-1.5 text-[10px] font-bold text-white">NEW</span>
              </div>
            ))}
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-steel-300 text-steel-500 hover:border-ink hover:text-ink">
              <Upload className="size-5" />
              <span className="text-xs font-semibold">Upload</span>
              <input
                key={product?.updatedAt}
                type="file"
                name="newImages"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={(e) => setNewPreviews(Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f)))}
              />
            </label>
          </div>
          {!images.length && !newPreviews.length && product && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-steel-50 p-3 text-sm text-steel-500">
              <span className="size-12 shrink-0 overflow-hidden rounded-lg"><EquipmentArt kind={product.art} className="size-full" /></span>
              The site shows this illustration until photos are uploaded.
            </div>
          )}
        </Card>

        <Card title="Brochure (PDF)">
          {product?.brochure ? (
            <div className="flex items-center gap-3 rounded-xl border border-steel-200 p-3">
              <FileText className="size-6 text-red-600" />
              <a href={brochureUrl(product)} target="_blank" className="flex-1 truncate text-sm font-semibold hover:text-flame">{product.brochure}</a>
              <label className="flex items-center gap-1.5 text-sm text-steel-500">
                <input type="checkbox" name="removeBrochure" /> Remove
              </label>
            </div>
          ) : (
            <p className="mb-3 text-sm text-steel-500">
              No brochure uploaded — visitors currently get an auto-generated specification sheet{product && (
                <> (<a href={brochureUrl(product)} target="_blank" className="font-semibold text-ink underline">preview</a>)</>
              )}.
            </p>
          )}
          <input key={product?.updatedAt} type="file" name="brochure" accept="application/pdf" className="mt-3 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
          {err("brochure")}
        </Card>
      </div>

      <div className="space-y-6 lg:sticky lg:top-10 lg:self-start">
        <Card title="Publishing">
          <label className="flex items-center justify-between py-1.5 text-sm font-medium">
            Featured on homepage
            <input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-5 accent-flame" />
          </label>
          <label className="flex items-center justify-between py-1.5 text-sm font-medium">
            Show “New” badge
            <input type="checkbox" name="isNew" defaultChecked={product?.isNew} className="size-5 accent-flame" />
          </label>
          <button className="btn-primary mt-4 h-12 w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />} {product ? "Save changes" : "Create product"}
          </button>
          {state?.ok && (
            <p key={state.savedAt} className="mt-3 flex animate-fade-up items-center gap-2 text-sm font-semibold text-green-700">
              <CheckCircle2 className="size-4" /> Saved — live on the website
            </p>
          )}
          {state?.errors && <p className="mt-3 text-sm text-red-600">Please fix the highlighted fields.</p>}
        </Card>

        {issues.length > 0 && (
          <Card title="Content check">
            <ul className="space-y-2.5">
              {issues.map((i) => (
                <li key={i.text} className={`flex gap-2 text-sm ${i.level === "missing" ? "text-red-600" : "text-amber-700"}`}>
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {i.text}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {product && (
          <button
            type="button"
            onClick={() => confirm(`Delete ${product.name}? This cannot be undone.`) && removeProduct(product.slug)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 className="size-4" /> Delete product
          </button>
        )}
      </div>
    </form>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-steel-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
