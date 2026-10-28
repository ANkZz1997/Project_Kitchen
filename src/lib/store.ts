import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { brands, buildSeedProducts, categories } from "@/data/seed";
import type { Brand, Category, Enquiry, Product } from "./types";

// File-backed store. Keeps the sample self-contained on any Node host; the
// function signatures are what the pages depend on, so swapping this module
// for Postgres/Prisma or a headless CMS later does not touch the UI.

// Vercel's filesystem is read-only except /tmp, which is per-instance and
// temporary — fine for the demo; production should use a database/blob store.
const ROOT = process.env.VERCEL ? path.join("/tmp", "hearthline") : path.join(process.cwd(), "data", "runtime");
export const UPLOAD_DIR = path.join(ROOT, "uploads");
const PRODUCTS_FILE = path.join(ROOT, "products.json");
const ENQUIRIES_FILE = path.join(ROOT, "enquiries.json");
export const OUTBOX_DIR = path.join(ROOT, "outbox");

async function readJson<T>(file: string, fallback: () => T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback();
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, file);
}

export async function getProducts(): Promise<Product[]> {
  return readJson(PRODUCTS_FILE, buildSeedProducts);
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export async function saveProducts(products: Product[]) {
  await writeJson(PRODUCTS_FILE, products);
}

export async function upsertProduct(product: Product, previousSlug?: string) {
  const all = await getProducts();
  const key = previousSlug ?? product.slug;
  const idx = all.findIndex((p) => p.slug === key);
  product.updatedAt = new Date().toISOString();
  if (idx >= 0) all[idx] = product;
  else all.unshift(product);
  await saveProducts(all);
}

export async function deleteProduct(slug: string) {
  await saveProducts((await getProducts()).filter((p) => p.slug !== slug));
}

export function getCategories(): Category[] {
  return categories;
}

export function getBrands(): Brand[] {
  return brands;
}

export async function getEnquiries(): Promise<Enquiry[]> {
  return readJson<Enquiry[]>(ENQUIRIES_FILE, () => []);
}

export async function addEnquiry(e: Enquiry) {
  const all = await getEnquiries();
  all.unshift(e);
  await writeJson(ENQUIRIES_FILE, all);
}

export async function updateEnquiry(id: string, patch: Partial<Enquiry>) {
  const all = await getEnquiries();
  const idx = all.findIndex((e) => e.id === id);
  if (idx < 0) return;
  all[idx] = { ...all[idx], ...patch };
  await writeJson(ENQUIRIES_FILE, all);
}

export async function saveUpload(file: File, prefix: string) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const ext = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "");
  const name = `${prefix}-${Date.now().toString(36)}${ext}`;
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return name;
}
