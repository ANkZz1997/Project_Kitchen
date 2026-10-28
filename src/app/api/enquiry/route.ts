import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { sendEnquiryEmails } from "@/lib/mailer";
import { addEnquiry, getBrands, getProducts } from "@/lib/store";
import type { Enquiry, EnquiryItem } from "@/lib/types";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot field — real users never fill it.
  if (str(body.website)) return NextResponse.json({ ok: true, reference: "HL-000000" });

  const kind = body.kind === "contact" ? "contact" : "quotation";
  const data = {
    businessName: str(body.businessName),
    contactName: str(body.contactName),
    email: str(body.email),
    phone: str(body.phone, 30),
    city: str(body.city, 80),
    businessType: str(body.businessType, 80),
    timeline: str(body.timeline, 80),
    requirements: str(body.requirements, 4000),
  };

  const errors: Record<string, string> = {};
  if (!data.businessName) errors.businessName = "Business name is required";
  if (!data.contactName) errors.contactName = "Contact name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email address";
  if (data.phone.replace(/\D/g, "").length < 8) errors.phone = "Enter a valid phone number";
  if (!data.city) errors.city = "City is required";

  // Re-resolve items against the catalogue so the email can't be spoofed.
  const products = await getProducts();
  const brands = getBrands();
  const rawItems = Array.isArray(body.items) ? body.items.slice(0, 100) : [];
  const items: EnquiryItem[] = [];
  for (const raw of rawItems) {
    const p = products.find((x) => x.slug === str((raw as Record<string, unknown>)?.slug));
    if (!p) continue;
    const qty = Math.min(999, Math.max(1, Math.floor(Number((raw as Record<string, unknown>).quantity) || 1)));
    items.push({
      slug: p.slug,
      name: p.name,
      model: p.model,
      brand: brands.find((b) => b.slug === p.brand)?.name ?? p.brand,
      quantity: qty,
    });
  }
  if (kind === "quotation" && !items.length && !data.requirements)
    errors.requirements = "Add products to your enquiry or describe your requirement";

  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const now = new Date();
  const enquiry: Enquiry = {
    id: randomUUID(),
    reference: `HL-${now.toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: now.toISOString(),
    kind,
    ...data,
    items,
    status: "new",
    emailDelivered: false,
  };

  try {
    enquiry.emailDelivered = await sendEnquiryEmails(enquiry);
  } catch (err) {
    console.error("Enquiry email failed", err);
  }
  await addEnquiry(enquiry);

  return NextResponse.json({ ok: true, reference: enquiry.reference });
}
