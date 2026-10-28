"use client";

import { useState } from "react";
import { Check, ClipboardPlus, Plus } from "lucide-react";
import { useEnquiry, type BasketItem } from "./EnquiryProvider";
import QtyStepper from "./QtyStepper";

type Item = Omit<BasketItem, "quantity">;

/** Compact icon button used on product cards. */
export function AddToEnquiryIcon({ item }: { item: Item }) {
  const { add, has, ready } = useEnquiry();
  const inList = ready && has(item.slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(item);
      }}
      aria-label={inList ? `Add another ${item.name}` : `Add ${item.name} to enquiry`}
      className={`flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition ${
        inList ? "bg-ink text-white" : "bg-steel-100 text-ink hover:bg-flame hover:text-white"
      }`}
    >
      {inList ? <Check className="size-4" /> : <Plus className="size-4" />}
      {inList ? "Added" : "Enquire"}
    </button>
  );
}

/** Quantity + add button used on the product detail page. */
export function AddToEnquiryPanel({ item }: { item: Item }) {
  const { add, has, ready, setOpen } = useEnquiry();
  const [qty, setQty] = useState(1);
  const inList = ready && has(item.slug);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <QtyStepper value={qty} onChange={setQty} />
      <button type="button" onClick={() => add(item, qty)} className="btn-primary h-12 flex-1 text-[15px]">
        <ClipboardPlus className="size-5" />
        {inList ? "Add more to enquiry" : "Add to enquiry"}
      </button>
      {inList && (
        <button type="button" onClick={() => setOpen(true)} className="btn-ghost h-12">
          View list
        </button>
      )}
    </div>
  );
}
