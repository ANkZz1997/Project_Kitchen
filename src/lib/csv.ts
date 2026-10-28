import type { Brand, Category, Spec } from "./types";

export const CSV_COLUMNS = [
  "name",
  "model",
  "category",
  "brand",
  "summary",
  "description",
  "features",
  "specs",
  "image_files",
  "brochure_file",
  "lead_time",
] as const;

export type CsvRow = Record<(typeof CSV_COLUMNS)[number], string>;

export interface ImportRow {
  line: number;
  raw: CsvRow;
  categorySlug?: string;
  brandSlug?: string;
  specs: Spec[];
  features: string[];
  errors: string[];
  warnings: string[];
  existing: boolean;
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (cell += '"'), i++;
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") row.push(cell), (cell = "");
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  row.push(cell);
  if (row.some((v) => v.trim())) rows.push(row);
  return rows;
}

const match = (value: string, list: { slug: string; name: string }[]) => {
  const v = value.trim().toLowerCase();
  return list.find((x) => x.slug === v || x.name.toLowerCase() === v)?.slug;
};

export function validateImport(text: string, categories: Category[], brands: Brand[], existingModels: string[]) {
  const grid = parseCsv(text.replace(/^﻿/, ""));
  if (!grid.length) return { headerErrors: ["The file is empty"], rows: [] as ImportRow[] };
  const header = grid[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const missingCols = CSV_COLUMNS.filter((c) => !header.includes(c));
  const headerErrors = ["name", "model", "category", "brand"]
    .filter((c) => missingCols.includes(c as never))
    .map((c) => `Required column “${c}” not found`);

  const seen = new Map<string, number>();
  const known = new Set(existingModels.map((m) => m.toUpperCase()));

  const rows: ImportRow[] = grid.slice(1).map((cells, idx) => {
    const raw = Object.fromEntries(CSV_COLUMNS.map((c) => [c, (cells[header.indexOf(c)] ?? "").trim()])) as CsvRow;
    const errors: string[] = [];
    const warnings: string[] = [];
    const line = idx + 2;

    if (!raw.name) errors.push("Product name missing");
    if (!raw.model) errors.push("Model number missing");
    const categorySlug = raw.category ? match(raw.category, categories) : undefined;
    if (!raw.category) errors.push("Category missing");
    else if (!categorySlug) errors.push(`Unknown category “${raw.category}”`);
    const brandSlug = raw.brand ? match(raw.brand, brands) : undefined;
    if (!raw.brand) errors.push("Brand missing");
    else if (!brandSlug) errors.push(`Unknown brand “${raw.brand}”`);

    const modelKey = raw.model.toUpperCase();
    if (raw.model) {
      if (seen.has(modelKey)) errors.push(`Duplicate model — also on line ${seen.get(modelKey)}`);
      else seen.set(modelKey, line);
    }

    const specs = raw.specs
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const [label, ...rest] = s.split(":");
        return { label: label.trim(), value: rest.join(":").trim() };
      });
    if (specs.some((s) => !s.value)) warnings.push("Some specs have no value (use “Label: value”)");
    const features = raw.features.split("|").map((s) => s.trim()).filter(Boolean);

    if (!raw.summary) warnings.push("No short summary");
    if (!specs.length) warnings.push("No specifications");
    else if (!specs.some((s) => /dimension|size/i.test(s.label))) warnings.push("Dimensions not given");
    if (!raw.image_files) warnings.push("No photographs referenced");
    if (!raw.brochure_file) warnings.push("No brochure file");

    return {
      line,
      raw,
      categorySlug,
      brandSlug,
      specs: specs.filter((s) => s.value),
      features,
      errors,
      warnings,
      existing: !!raw.model && known.has(modelKey),
    };
  });

  return { headerErrors, rows };
}

export const SAMPLE_CSV = `name,model,category,brand,summary,description,features,specs,image_files,brochure_file,lead_time
Induction Wok Range 8 kW,TC-IW8,Cooking Equipment,Thermacore,High-efficiency induction wok station for Asian kitchens.,,Instant heat control|Cool-to-touch surround,Dimensions (W×D×H): 600 × 800 × 900 mm|Power: 8 kW / 415 V|Bowl: 400 mm,iw8-front.jpg;iw8-side.jpg,TC-IW8.pdf,2–3 weeks
Reach-in Freezer 2 Door,NF-FU1400,Refrigeration,NordFrost,Two-door upright freezer for bulk frozen stock.,,,Capacity: 1400 L|Temperature: -22 to -15 °C,,,
Bain Marie 4 Pan,,Cooking Equipment,Steelline,Wet-heat bain marie for buffet service.,,,Pans: 4 × GN 1/3|Power: 2 kW,bm4.jpg,,
Ice Flaker 120 kg,KR-FL120,Beverage,Kryon,Flake ice for seafood display and bars.,,,Production: 120 kg / 24 hr,fl120.jpg,KR-FL120.pdf,
Gas Tandoor Large,SL-TD900,Cooking Equipment,Tandoorwala,Clay-lined gas tandoor for breads and kebabs.,,,Mouth: 300 mm|Fuel: LPG,td900.jpg,,
Planetary Mixer 20 L,CU-PM20,Food Preparation,Culina,Updated description for existing mixer.,,,Bowl: 20 L|Motor: 1.1 kW,pm20.jpg,CU-PM20.pdf,
Combi Oven 6 Tray,TC-IW8,Cooking Equipment,Thermacore,Compact combi.,,,Capacity: 6 × GN 1/1,,,
`;
