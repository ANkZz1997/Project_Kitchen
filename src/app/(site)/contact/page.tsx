import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import EnquiryForm from "@/components/enquiry/EnquiryForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const cards = [
    { icon: Phone, label: "Call sales", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${site.whatsapp}` },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: Clock, label: "Hours", value: site.hours },
  ];
  return (
    <div className="container-x py-10 md:py-14">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">Let’s plan your kitchen</h1>
      <p className="mt-3 max-w-2xl text-steel-500">
        Questions about equipment, kitchen layouts or service? Reach us directly or send a message below.
      </p>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {cards.map(({ icon: Icon, label, value, href }) => {
              const inner = (
                <>
                  <Icon className="size-5 text-flame" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-steel-400">{label}</p>
                  <p className="mt-0.5 break-words font-semibold">{value}</p>
                </>
              );
              return href ? (
                <a key={label} href={href} className="rounded-2xl border border-steel-200 bg-white p-5 transition hover:border-ink">
                  {inner}
                </a>
              ) : (
                <div key={label} className="rounded-2xl border border-steel-200 bg-white p-5">{inner}</div>
              );
            })}
          </div>
          <div className="overflow-hidden rounded-3xl border border-steel-200 bg-white">
            <div className="grid-lines-dark relative h-56 bg-steel-100">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-flame text-white shadow-lg">
                  <MapPin className="size-6" />
                </span>
                <p className="mt-2 text-xs font-semibold text-steel-500">Map embed — client address</p>
              </div>
            </div>
            <div className="p-5">
              <p className="font-semibold">Showroom & warehouse</p>
              <p className="mt-1 text-sm text-steel-500">{site.address}</p>
            </div>
          </div>
          <div className="rounded-2xl bg-ink p-5 text-sm text-steel-300">
            <p className="font-semibold text-white">Cities we serve</p>
            <p className="mt-2">{site.cities.join(" · ")}</p>
          </div>
        </div>
        <EnquiryForm kind="contact" />
      </div>
    </div>
  );
}
