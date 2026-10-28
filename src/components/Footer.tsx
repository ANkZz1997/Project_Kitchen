import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { brands, categories } from "@/data/seed";
import { site } from "@/lib/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-ink pb-24 text-steel-400 md:pb-0">
      <div className="container-x grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo dark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">
            Supplying, installing and servicing commercial kitchen equipment for restaurants, cafés, hotels and
            cloud kitchens since 2004.
          </p>
          <p className="mt-5 text-xs text-steel-500">Prices are shared on request after our team reviews your requirement.</p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Categories</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products?category=${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Brands</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm lg:grid-cols-1">
            {brands.map((b) => (
              <li key={b.slug}>
                <Link href={`/products?brand=${b.slug}`} className="hover:text-white">
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Talk to sales</h3>
          <ul className="mt-4 space-y-3.5 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-flame" />
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-flame" />
              <a href={`mailto:${site.email}`} className="hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-flame" />
              <span>{site.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/admin" className="hover:text-white">Team login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
