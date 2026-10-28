import Link from "next/link";
import { Inbox } from "lucide-react";
import { getEnquiries } from "@/lib/store";

const STATUS_STYLE: Record<string, string> = {
  new: "bg-flame text-white",
  "in-progress": "bg-blue-50 text-blue-700",
  quoted: "bg-green-50 text-green-700",
  closed: "bg-steel-100 text-steel-500",
};

export default async function EnquiriesPage() {
  const enquiries = await getEnquiries();
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Enquiries</h1>
      <p className="mt-1 text-steel-500">Quotation requests and contact messages from the website.</p>

      {enquiries.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-steel-300 bg-white p-12 text-center">
          <Inbox className="mx-auto size-8 text-steel-400" />
          <p className="mt-3 font-semibold">No enquiries yet</p>
          <p className="mt-1 text-sm text-steel-500">Add products to an enquiry on the website and submit the form — it will appear here.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-steel-200 bg-white">
          <ul className="divide-y divide-steel-100">
            {enquiries.map((e) => (
              <li key={e.id}>
                <Link href={`/admin/enquiries/${e.id}`} className="grid gap-1 p-4 hover:bg-steel-50 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{e.businessName}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${STATUS_STYLE[e.status]}`}>{e.status}</span>
                      {e.kind === "contact" && <span className="rounded-full bg-steel-100 px-2 py-0.5 text-[11px] font-bold uppercase text-steel-500">Contact</span>}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-steel-500">
                      {e.contactName} · {e.city} · {e.items.length ? e.items.map((i) => `${i.quantity}× ${i.model}`).join(", ") : e.requirements.slice(0, 80)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-steel-400">
                    <span className="font-mono">{e.reference}</span>
                    <time dateTime={e.createdAt}>{new Date(e.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</time>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
