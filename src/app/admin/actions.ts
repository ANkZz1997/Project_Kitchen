"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { validateImport } from "@/lib/csv";
import {
  deleteProduct,
  getBrands,
  getCategories,
  getProduct,
  getProducts,
  saveProducts,
  saveUpload,
  updateEnquiry,
  upsertProduct,
} from "@/lib/store";
import type { ArtKind, Enquiry, Product } from "@/lib/types";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function login(_: unknown, form: FormData) {
  if (!checkPassword(String(form.get("password") ?? ""))) return { error: "Incorrect password" };
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function saveProduct(_: unknown, form: FormData) {
  await requireAdmin();
  const previousSlug = String(form.get("previousSlug") ?? "") || undefined;
  const existing = previousSlug ? await getProduct(previousSlug) : null;

  const name = String(form.get("name") ?? "").trim();
  const model = String(form.get("model") ?? "").trim().toUpperCase();
  const category = String(form.get("category") ?? "");
  const brand = String(form.get("brand") ?? "");
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Required";
  if (!model) errors.model = "Required";
  if (!getCategories().some((c) => c.slug === category)) errors.category = "Choose a category";
  if (!getBrands().some((b) => b.slug === brand)) errors.brand = "Choose a brand";

  const all = await getProducts();
  if (model && all.some((p) => p.model.toUpperCase() === model && p.slug !== previousSlug))
    errors.model = "Another product already uses this model number";
  if (Object.keys(errors).length) return { errors };

  const specLabels = form.getAll("specLabel").map(String);
  const specValues = form.getAll("specValue").map(String);
  const specs = specLabels
    .map((label, i) => ({ label: label.trim(), value: (specValues[i] ?? "").trim() }))
    .filter((s) => s.label && s.value);

  let images = form.getAll("keepImage").map(String);
  for (const f of form.getAll("newImages")) {
    if (f instanceof File && f.size > 0) images.push(await saveUpload(f, slugify(model)));
  }
  images = images.slice(0, 8);

  let brochure: string | null = form.get("removeBrochure") ? null : (existing?.brochure ?? null);
  const brochureFile = form.get("brochure");
  if (brochureFile instanceof File && brochureFile.size > 0) {
    if (brochureFile.type !== "application/pdf") return { errors: { brochure: "Brochure must be a PDF" } };
    brochure = await saveUpload(brochureFile, `${slugify(model)}-brochure`);
  }

  const category_ = getCategories().find((c) => c.slug === category)!;
  const product: Product = {
    slug: existing?.slug ?? slugify(`${name} ${model}`),
    name,
    model,
    category,
    brand,
    summary: String(form.get("summary") ?? "").trim(),
    description: String(form.get("description") ?? "").trim(),
    features: String(form.get("features") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    specs,
    art: existing?.art ?? (category_.art as ArtKind),
    images,
    brochure,
    featured: form.get("featured") === "on",
    isNew: form.get("isNew") === "on",
    leadTime: String(form.get("leadTime") ?? "").trim() || "On request",
    updatedAt: new Date().toISOString(),
  };

  await upsertProduct(product, previousSlug);
  revalidatePath("/", "layout");
  return { ok: true, slug: product.slug, savedAt: Date.now() };
}

export async function removeProduct(slug: string) {
  await requireAdmin();
  await deleteProduct(slug);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function setEnquiryStatus(id: string, status: Enquiry["status"]) {
  await requireAdmin();
  await updateEnquiry(id, { status });
  revalidatePath("/admin", "layout");
}

export async function importProducts(csv: string) {
  await requireAdmin();
  const categories = getCategories();
  const brands = getBrands();
  const all = await getProducts();
  const { headerErrors, rows } = validateImport(csv, categories, brands, all.map((p) => p.model));
  if (headerErrors.length) return { error: headerErrors.join(", ") };

  let created = 0;
  let updated = 0;
  for (const r of rows) {
    if (r.errors.length) continue;
    const model = r.raw.model.toUpperCase();
    const idx = all.findIndex((p) => p.model.toUpperCase() === model);
    const cat = categories.find((c) => c.slug === r.categorySlug)!;
    const base: Product =
      idx >= 0
        ? all[idx]
        : {
            slug: slugify(`${r.raw.name} ${model}`),
            name: r.raw.name,
            model,
            category: cat.slug,
            brand: r.brandSlug!,
            summary: "",
            description: "",
            features: [],
            specs: [],
            art: cat.art,
            images: [],
            brochure: null,
            featured: false,
            isNew: true,
            leadTime: "On request",
            updatedAt: "",
          };
    const next: Product = {
      ...base,
      name: r.raw.name,
      category: cat.slug,
      brand: r.brandSlug!,
      summary: r.raw.summary || base.summary,
      description: r.raw.description || base.description || r.raw.summary,
      features: r.features.length ? r.features : base.features,
      specs: r.specs.length ? r.specs : base.specs,
      leadTime: r.raw.lead_time || base.leadTime,
      updatedAt: new Date().toISOString(),
    };
    if (idx >= 0) (all[idx] = next), updated++;
    else all.unshift(next), created++;
  }
  await saveProducts(all);
  revalidatePath("/", "layout");
  return { created, updated, skipped: rows.filter((r) => r.errors.length).length };
}
