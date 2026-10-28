import "server-only";
import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { OUTBOX_DIR } from "./store";
import { site } from "./site";
import type { Enquiry } from "./types";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function renderEnquiryEmail(e: Enquiry, audience: "sales" | "customer") {
  const rows = e.items
    .map(
      (i, n) => `<tr style="background:${n % 2 ? "#ffffff" : "#f6f6f7"}">
        <td style="padding:10px 12px;font-weight:600">${escapeHtml(i.name)}</td>
        <td style="padding:10px 12px;font-family:monospace">${escapeHtml(i.model)}</td>
        <td style="padding:10px 12px">${escapeHtml(i.brand)}</td>
        <td style="padding:10px 12px;text-align:center;font-weight:700">${i.quantity}</td>
      </tr>`,
    )
    .join("");

  const detail = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:6px 0;color:#6b7280;width:160px">${label}</td><td style="padding:6px 0;font-weight:600">${escapeHtml(value)}</td></tr>`
      : "";

  const intro =
    audience === "sales"
      ? `New ${e.kind === "quotation" ? "quotation request" : "contact message"} from <b>${escapeHtml(e.businessName)}</b> (${escapeHtml(e.city)}).`
      : `Thank you, ${escapeHtml(e.contactName)}. We've received your requirement and a member of our sales team will contact you within 1 business day with pricing and availability.`;

  const subject =
    audience === "sales"
      ? `[${e.reference}] ${e.kind === "quotation" ? "Quotation request" : "Website enquiry"} – ${e.businessName}, ${e.city} (${e.items.length} item${e.items.length === 1 ? "" : "s"})`
      : `We've received your enquiry ${e.reference} – ${site.name}`;

  const html = `<!doctype html><html><body style="margin:0;background:#eef0f2;font-family:Segoe UI,Arial,sans-serif;color:#111827">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0"><tr><td align="center">
  <table width="640" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden">
    <tr><td style="background:#121418;padding:24px 28px;border-bottom:4px solid #ff5c1f">
      <div style="color:#ff5c1f;font-weight:800;letter-spacing:2px;font-size:13px">${site.name.toUpperCase()}</div>
      <div style="color:#fff;font-size:20px;font-weight:700;margin-top:6px">${e.kind === "quotation" ? "Quotation request" : "Website enquiry"} · ${e.reference}</div>
    </td></tr>
    <tr><td style="padding:24px 28px;font-size:15px;line-height:1.55">${intro}</td></tr>
    ${
      e.items.length
        ? `<tr><td style="padding:0 28px 8px"><div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#ff5c1f;margin-bottom:8px">SELECTED PRODUCTS</div>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <tr style="background:#121418;color:#fff;font-size:12px;text-transform:uppercase;letter-spacing:.5px">
          <td style="padding:10px 12px">Product</td><td style="padding:10px 12px">Model</td><td style="padding:10px 12px">Brand</td><td style="padding:10px 12px;text-align:center">Qty</td>
        </tr>${rows}
      </table></td></tr>`
        : ""
    }
    <tr><td style="padding:20px 28px">
      <div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#ff5c1f;margin-bottom:8px">CUSTOMER DETAILS</div>
      <table cellpadding="0" cellspacing="0" style="font-size:14px">
        ${detail("Business", e.businessName)}${detail("Contact person", e.contactName)}${detail("Email", e.email)}${detail("Phone", e.phone)}${detail("City", e.city)}${detail("Business type", e.businessType)}${detail("Timeline", e.timeline)}
      </table>
      ${e.requirements ? `<div style="margin-top:14px;padding:14px;background:#f6f6f7;border-radius:8px;font-size:14px;white-space:pre-wrap">${escapeHtml(e.requirements)}</div>` : ""}
    </td></tr>
    <tr><td style="padding:16px 28px;background:#f6f6f7;font-size:12px;color:#6b7280">${site.legalName} · ${site.phone} · ${site.email}</td></tr>
  </table></td></tr></table></body></html>`;

  return { subject, html };
}

export async function sendEnquiryEmails(e: Enquiry) {
  const sales = renderEnquiryEmail(e, "sales");
  const customer = renderEnquiryEmail(e, "customer");

  if (!process.env.SMTP_HOST) {
    // No SMTP configured: keep a copy so the email can be previewed in admin.
    await fs.mkdir(OUTBOX_DIR, { recursive: true });
    await fs.writeFile(path.join(OUTBOX_DIR, `${e.reference}-sales.html`), sales.html);
    await fs.writeFile(path.join(OUTBOX_DIR, `${e.reference}-customer.html`), customer.html);
    return false;
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  const from = process.env.MAIL_FROM || `${site.name} <${site.email}>`;
  await transport.sendMail({
    from,
    to: process.env.SALES_INBOX || site.email,
    replyTo: e.email,
    subject: sales.subject,
    html: sales.html,
  });
  await transport.sendMail({ from, to: e.email, subject: customer.subject, html: customer.html });
  return true;
}
