"use client";

import { useMemo, useState, useTransition } from "react";
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Loader2, Upload, XCircle } from "lucide-react";
import { importProducts } from "@/app/admin/actions";
import { CSV_COLUMNS, SAMPLE_CSV, validateImport } from "@/lib/csv";
import type { Brand, Category } from "@/lib/types";

export default function ImportTool({
  categories,
  brands,
  existingModels,
}: {
  categories: Category[];
  brands: Brand[];
  existingModels: string[];
}) {
  const [csv, setCsv] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<{ created?: number; updated?: number; skipped?: number; error?: string } | null>(null);
  const [pending, start] = useTransition();

  const report = useMemo(() => (csv ? validateImport(csv, categories, brands, existingModels) : null), [csv, categories, brands, existingModels]);
  const valid = report?.rows.filter((r) => !r.errors.length) ?? [];
  const blocked = report?.rows.filter((r) => r.errors.length) ?? [];
  const warned = valid.filter((r) => r.warnings.length);

  const template = `data:text/csv;charset=utf-8,${encodeURIComponent(CSV_COLUMNS.join(",") + "\n")}`;

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-steel-300 bg-white p-10 text-center transition hover:border-ink">
          <Upload className="size-8 text-steel-400" />
          <span className="font-semibold">{fileName || "Choose a CSV file"}</span>
          <span className="text-sm text-steel-500">Export from Excel / Google Sheets as “CSV UTF-8”</span>
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setFileName(f.name);
              setResult(null);
              setCsv(await f.text());
            }}
          />
        </label>
        <div className="space-y-3 rounded-2xl border border-steel-200 bg-white p-5 text-sm">
          <p className="font-bold">Format</p>
          <p className="text-steel-500">
            Columns: <span className="font-mono text-xs">{CSV_COLUMNS.join(", ")}</span>. Use <b>|</b> between features and specs; specs
            as <span className="font-mono text-xs">Label: value</span>.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <a href={template} download="product-template.csv" className="btn-ghost px-4 py-2">
              <Download className="size-4" /> Template
            </a>
            <button
              type="button"
              onClick={() => {
                setFileName("sample-with-issues.csv");
                setResult(null);
                setCsv(SAMPLE_CSV);
              }}
              className="btn-dark px-4 py-2"
            >
              <FileSpreadsheet className="size-4" /> Try sample file
            </button>
          </div>
        </div>
      </div>

      {report?.headerErrors.length ? (
        <div className="rounded-2xl bg-red-50 p-5 text-sm text-red-700">{report.headerErrors.join(" · ")}</div>
      ) : report ? (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Stat n={valid.length - warned.length} label="Ready" tone="green" />
            <Stat n={warned.length} label="Import with follow-ups" tone="amber" />
            <Stat n={blocked.length} label="Blocked — fix first" tone="red" />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-steel-200 bg-white">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-steel-50 text-left text-xs uppercase tracking-wider text-steel-500">
                <tr>
                  <th className="px-4 py-3">Line</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category / brand</th>
                  <th className="px-4 py-3">Findings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-100">
                {report.rows.map((r) => (
                  <tr key={r.line} className={r.errors.length ? "bg-red-50/40" : ""}>
                    <td className="px-4 py-3 font-mono text-steel-400">{r.line}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{r.raw.name || <span className="text-red-600">—</span>}</p>
                      <p className="font-mono text-xs text-steel-500">
                        {r.raw.model || "no model"} {r.existing && !r.errors.length && <span className="ml-1 rounded bg-blue-50 px-1.5 text-blue-700">updates existing</span>}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-steel-600">
                      {r.raw.category} / {r.raw.brand}
                    </td>
                    <td className="space-y-1 px-4 py-3">
                      {r.errors.map((e) => (
                        <p key={e} className="flex items-center gap-1.5 text-red-600"><XCircle className="size-3.5 shrink-0" /> {e}</p>
                      ))}
                      {r.warnings.map((w) => (
                        <p key={w} className="flex items-center gap-1.5 text-amber-700"><AlertTriangle className="size-3.5 shrink-0" /> {w}</p>
                      ))}
                      {!r.errors.length && !r.warnings.length && (
                        <p className="flex items-center gap-1.5 text-green-700"><CheckCircle2 className="size-3.5" /> Complete</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-ink p-5 text-white">
            <p className="flex-1 text-sm text-steel-300">
              {valid.length} row{valid.length === 1 ? "" : "s"} will be imported. {blocked.length > 0 && `${blocked.length} blocked row(s) will be skipped — send these back to the client to complete.`}
            </p>
            <button
              disabled={!valid.length || pending}
              onClick={() => start(async () => setResult(await importProducts(csv)))}
              className="btn-primary"
            >
              {pending && <Loader2 className="size-4 animate-spin" />} Import {valid.length} products
            </button>
          </div>
          {result && (
            <p className={`rounded-xl p-4 text-sm font-semibold ${result.error ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
              {result.error ?? `Done — ${result.created} created, ${result.updated} updated, ${result.skipped} skipped.`}
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}

function Stat({ n, label, tone }: { n: number; label: string; tone: "green" | "amber" | "red" }) {
  const c = { green: "text-green-700 bg-green-50", amber: "text-amber-700 bg-amber-50", red: "text-red-700 bg-red-50" }[tone];
  return (
    <div className={`rounded-2xl p-4 ${c}`}>
      <p className="font-display text-3xl font-extrabold">{n}</p>
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}
