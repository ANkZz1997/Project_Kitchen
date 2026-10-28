"use client";

import { Minus, Plus } from "lucide-react";

export default function QtyStepper({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-9" : "h-12";
  const w = size === "sm" ? "w-9" : "w-12";
  return (
    <div className={`inline-flex ${h} items-center rounded-full border border-steel-200 bg-white`}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className={`grid ${h} ${w} place-items-center rounded-full text-steel-600 hover:text-ink disabled:opacity-30`}
        disabled={value <= 1}
      >
        <Minus className="size-4" />
      </button>
      <input
        aria-label="Quantity"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value.replace(/\D/g, "")) || 1)}
        className="w-10 bg-transparent text-center text-sm font-bold tabular-nums outline-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(999, value + 1))}
        className={`grid ${h} ${w} place-items-center rounded-full text-steel-600 hover:text-ink`}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
