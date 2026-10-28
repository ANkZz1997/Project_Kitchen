import type { Metadata } from "next";
import { Clock, Lock, PhoneCall } from "lucide-react";
import EnquiryForm from "@/components/enquiry/EnquiryForm";
import EnquiryList from "@/components/enquiry/EnquiryList";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Request a quotation" };

export default function EnquiryPage() {
  return (
    <div className="container-x py-10 md:py-14">
      <p className="eyebrow">Step 2 of 2</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">Request a quotation</h1>
      <p className="mt-3 max-w-2xl text-steel-500">
        Review your products and quantities, tell us about your business, and our sales team will send a tailored quotation.
      </p>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6 lg:sticky lg:top-32">
          <EnquiryList />
          <ul className="grid gap-3 rounded-3xl bg-ink p-6 text-sm text-steel-300 sm:grid-cols-3 lg:grid-cols-1">
            <li className="flex gap-3"><Clock className="size-5 shrink-0 text-flame" /> Quotation within 48 working hours</li>
            <li className="flex gap-3"><PhoneCall className="size-5 shrink-0 text-flame" /> Call {site.phone} for urgent needs</li>
            <li className="flex gap-3"><Lock className="size-5 shrink-0 text-flame" /> Your details are never shared</li>
          </ul>
        </div>
        <EnquiryForm />
      </div>
    </div>
  );
}
