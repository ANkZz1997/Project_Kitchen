"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ArtKind } from "@/lib/types";

export interface BasketItem {
  slug: string;
  name: string;
  model: string;
  brand: string;
  art: ArtKind;
  image?: string;
  quantity: number;
}

interface Ctx {
  items: BasketItem[];
  count: number;
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<BasketItem, "quantity">, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
  toast: string | null;
}

const EnquiryContext = createContext<Ctx | null>(null);
const KEY = "hl-enquiry-v1";

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const add = useCallback((item: Omit<BasketItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) return prev.map((i) => (i.slug === item.slug ? { ...i, quantity: Math.min(999, i.quantity + qty) } : i));
      return [...prev, { ...item, quantity: qty }];
    });
    setToast(`${item.name} added to your enquiry`);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, quantity: Math.max(1, Math.min(999, qty || 1)) } : i)));
  }, []);

  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<Ctx>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      ready,
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
      has: (slug) => items.some((i) => i.slug === slug),
      toast,
    }),
    [items, ready, open, add, setQty, remove, clear, toast],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside EnquiryProvider");
  return ctx;
}
