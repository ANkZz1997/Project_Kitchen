import "server-only";
import type { Brand, Category, Product } from "./types";
import { site } from "./site";

// Dependency-free one-page spec-sheet generator. Used as the fallback
// brochure until the client's own PDF brochure is uploaded for a product.

const W = 595;
const H = 842;

function ascii(s: string) {
  return s
    .replace(/×/g, "x")
    .replace(/\s?°/g, " deg")
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/½/g, "1/2")
    .replace(/³/g, "3")
    .replace(/è/g, "e")
    .replace(/[^\x20-\x7E]/g, "");
}

const esc = (s: string) => ascii(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

function wrap(text: string, size: number, maxWidth: number) {
  const charW = size * 0.5;
  const max = Math.floor(maxWidth / charW);
  const lines: string[] = [];
  let line = "";
  for (const word of ascii(text).split(/\s+/)) {
    if ((line + " " + word).trim().length > max) {
      lines.push(line);
      line = word;
    } else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  return lines;
}

export function buildSpecSheet(p: Product, brand?: Brand, category?: Category) {
  const ops: string[] = [];
  const text = (x: number, y: number, s: string, size = 10, bold = false, rgb = "0.12 0.13 0.15") =>
    ops.push(`BT ${rgb} rg /${bold ? "F2" : "F1"} ${size} Tf ${x} ${y} Td (${esc(s)}) Tj ET`);
  const rect = (x: number, y: number, w: number, h: number, rgb: string) =>
    ops.push(`${rgb} rg ${x} ${y} ${w} ${h} re f`);

  // header band
  rect(0, H - 150, W, 150, "0.07 0.08 0.10");
  rect(0, H - 154, W, 4, "1 0.36 0.12");
  text(40, H - 50, site.name.toUpperCase(), 11, true, "1 0.36 0.12");
  text(40, H - 66, "PRODUCT SPECIFICATION SHEET", 8, false, "0.7 0.72 0.75");
  let y = H - 98;
  for (const l of wrap(p.name, 20, 515).slice(0, 2)) {
    text(40, y, l, 20, true, "1 1 1");
    y -= 24;
  }
  text(40, H - 140, `Model ${p.model}   |   ${brand?.name ?? ""}   |   ${category?.name ?? ""}`, 9, false, "0.8 0.82 0.85");

  y = H - 190;
  text(40, y, "OVERVIEW", 9, true, "1 0.36 0.12");
  y -= 16;
  for (const l of wrap(p.description, 10, 515)) {
    text(40, y, l, 10);
    y -= 14;
  }

  y -= 14;
  text(40, y, "TECHNICAL SPECIFICATIONS", 9, true, "1 0.36 0.12");
  y -= 8;
  p.specs.forEach((s, i) => {
    if (i % 2 === 0) rect(40, y - 18, 515, 20, "0.95 0.95 0.96");
    text(48, y - 12, s.label, 9.5, true);
    text(240, y - 12, s.value, 9.5);
    y -= 20;
  });

  y -= 24;
  text(40, y, "KEY FEATURES", 9, true, "1 0.36 0.12");
  y -= 16;
  for (const f of p.features) {
    rect(42, y + 2, 4, 4, "1 0.36 0.12");
    text(54, y, f, 10);
    y -= 15;
  }

  y -= 12;
  text(40, y, `Lead time: ${p.leadTime}`, 9, false, "0.35 0.37 0.4");

  // footer
  rect(0, 0, W, 70, "0.95 0.95 0.96");
  text(40, 44, "Request a quotation", 11, true);
  text(40, 28, `${site.phone}   |   ${site.email}`, 9, false, "0.35 0.37 0.4");
  text(40, 14, "Prices on request. Specifications may change without notice.", 7.5, false, "0.5 0.52 0.55");

  const content = ops.join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((o, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}
