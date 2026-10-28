import type { Product } from "./types";

export type Issue = { level: "missing" | "warning"; text: string };

/** Content checks shown in admin so gaps are flagged before going live. */
export function productIssues(p: Product): Issue[] {
  const issues: Issue[] = [];
  if (!p.images.length) issues.push({ level: "missing", text: "No product photographs" });
  if (!p.brochure) issues.push({ level: "warning", text: "No brochure — generated spec sheet used" });
  if (p.specs.length < 4) issues.push({ level: "warning", text: "Fewer than 4 specifications" });
  if (!p.specs.some((s) => /dimension|size|length/i.test(s.label))) issues.push({ level: "warning", text: "Dimensions not specified" });
  if (!p.specs.some((s) => /power|fuel|voltage|output|motor|heating/i.test(s.label)))
    issues.push({ level: "warning", text: "Power / fuel requirement missing" });
  if (p.summary.length < 30) issues.push({ level: "warning", text: "Summary is very short" });
  if (!p.features.length) issues.push({ level: "warning", text: "No key features" });
  return issues;
}
