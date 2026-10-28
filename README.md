# Hearthline — Commercial Kitchen Equipment Catalogue (pitch sample)

A working Next.js sample for a catalogue and quotation-request website for a commercial kitchen equipment supplier. Business name, logo, contact details, stats and testimonial are **placeholders**. Replace them in `src/lib/site.ts` and `src/components/Logo.tsx`.

## Run it

```bash
npm install
npm run dev            # http://localhost:3000
# or a production build
npm run build && npm start
```

Admin: <http://localhost:3000/admin>. The demo password is `admin123`. Copy `.env.example` to `.env.local` to set a real password and SMTP details.

## What's included

| Brief requirement | Where |
|---|---|
| Home, About, Products, Brands, Contact | `src/app/(site)/*` |
| ~60 products, 6 categories | `src/data/seed.ts` (60 products, 8 brands) |
| Product pages: photos, specs, brochures | `src/app/(site)/products/[slug]` with gallery, spec table and PDF download |
| Search by name / model number | Instant header search plus catalogue filter (`src/lib/catalog.ts`) |
| Category and brand filters | `src/components/ProductBrowser.tsx` (URL-synced, mobile bottom sheet) |
| "Add to enquiry" with quantities | `src/components/enquiry/*` (saved in localStorage, drawer, sticky mobile bar) |
| Enquiry form (business, contact, city, requirements) | `/enquiry`, `/contact`, validated in `src/app/api/enquiry/route.ts` |
| Email notifications | `src/lib/mailer.ts` sends to sales and a confirmation to the customer. Without SMTP, emails are saved to `data/runtime/outbox` and previewed in admin |
| Admin: update products and brochures | `/admin/products`: edit, photo and PDF upload, delete |
| Check supplied material and flag gaps | `/admin/import` validates the CSV before import. The admin overview and product pages run per-product content checks (`src/lib/health.ts`) |

Until real photographs and brochures are uploaded:
- Products show vector illustrations (`src/components/EquipmentArt.tsx`).
- The brochure link serves a generated one-page spec sheet (`src/lib/pdf.ts`).

## Path to production

- **Data:** `src/lib/store.ts` is a JSON-file store behind a small async API. To move to Postgres (Prisma/Drizzle) or a headless CMS, replace that one module; pages don't change.
- **Files:** uploads go to `data/runtime/uploads` and are served by `/api/files`. On serverless hosting, switch `saveUpload` to S3, R2 or Blob storage.
- **Auth:** single shared password with a signed cookie. Upgrade to per-user accounts (Auth.js) if several staff need audit trails.
- **Email:** set `SMTP_*` (or swap in Resend/SES in `mailer.ts`).
- **Still to add:** real images through `next/image`, SEO metadata/OG images and sitemap, analytics, reCAPTCHA/rate limiting on `/api/enquiry`, and CRM/WhatsApp integration for leads.
