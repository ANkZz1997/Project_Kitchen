import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, MailCheck, MailWarning, Phone } from "lucide-react";
import { setEnquiryStatus } from "@/app/admin/actions";
import { renderEnquiryEmail } from "@/lib/mailer";
import { getEnquiries } from "@/lib/store";
import type { Enquiry } from "@/lib/types";

const STATUSES: Enquiry["status"][] = ["new", "in-progress", "quoted", "closed"];

export default async function EnquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const e = (await getEnquiries()).find((x) => x.id === id);
  if (!e) notFound();
  const email = renderEnquiryEmail(e, "sales");

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/admin/enquiries" className="inline-flex items-center gap-1.5 text-sm font-semibold text-steel-500 hover:text-ink">
        <ArrowLeft className="size-4" /> Enquiries
      </Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-steel-500">{e.reference}</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">{e.businessName}</h1>
          <p className="mt-1 text-steel-500">
            {e.city} · {new Date(e.createdAt).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })}
          </p>
        </div>
        <div className="flex gap-2">
          <a href={`tel:${e.phone}`} className="btn-ghost"><Phone className="size-4" /> Call</a>
          <a href={`mailto:${e.email}?subject=${encodeURIComponent(`Quotation ${e.reference}`)}`} className="btn-dark"><Mail className="size-4" /> Reply</a>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <form key={s} action={setEnquiryStatus.bind(null, e.id, s)}>
            <button className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${e.status === s ? "bg-ink text-white" : "bg-white text-steel-600 ring-1 ring-steel-200 hover:ring-ink"}`}>
              {s.replace("-", " ")}
            </button>
          </form>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-steel-200 bg-white p-5">
            <h2 className="font-bold">Customer</h2>
            <dl className="mt-3 grid grid-cols-[120px_1fr] gap-y-2 text-sm">
              {[
                ["Contact", e.contactName],
                ["Email", e.email],
                ["Phone", e.phone],
                ["City", e.city],
                ["Business type", e.businessType || "—"],
                ["Timeline", e.timeline || "—"],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-steel-500">{k}</dt>
                  <dd className="break-words font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            {e.requirements && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-steel-50 p-4 text-sm">{e.requirements}</p>}
          </section>
          {e.items.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-steel-200 bg-white">
              <h2 className="p-5 pb-3 font-bold">Requested products</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-steel-100">
                  {e.items.map((i) => (
                    <tr key={i.slug}>
                      <td className="px-5 py-3">
                        <Link href={`/products/${i.slug}`} target="_blank" className="font-semibold hover:text-flame">{i.name}</Link>
                        <p className="font-mono text-xs text-steel-500">{i.brand} · {i.model}</p>
                      </td>
                      <td className="px-5 py-3 text-right font-display text-lg font-bold">×{i.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>

        <section className="overflow-hidden rounded-2xl border border-steel-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-steel-100 p-4">
            <h2 className="font-bold">Notification email</h2>
            {e.emailDelivered ? (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-700"><MailCheck className="size-4" /> Sent via SMTP</span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700"><MailWarning className="size-4" /> Preview (SMTP not configured)</span>
            )}
          </div>
          <p className="border-b border-steel-100 bg-steel-50 px-4 py-2 text-xs text-steel-500">
            <b>Subject:</b> {email.subject}
          </p>
          <iframe title="Email preview" srcDoc={email.html} className="h-[640px] w-full" />
        </section>
      </div>
    </div>
  );
}
