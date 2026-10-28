"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyModel({ model }: { model: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(model);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-steel-200 bg-white px-2.5 py-1 font-mono text-sm font-semibold hover:border-ink"
      title="Copy model number"
    >
      {model}
      {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5 text-steel-400" />}
    </button>
  );
}
