"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipboardList, Menu, Phone, Search, X } from "lucide-react";
import { nav, site } from "@/lib/site";
import Logo from "./Logo";
import SearchBox, { type SearchIndexItem } from "./SearchBox";
import { useEnquiry } from "./enquiry/EnquiryProvider";

export default function Header({ index }: { index: SearchIndexItem[] }) {
  const pathname = usePathname();
  const { count, setOpen, ready } = useEnquiry();
  const [menu, setMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
    setMobileSearch(false);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={`sticky top-0 z-40 bg-white/90 backdrop-blur-xl transition-shadow ${scrolled ? "shadow-[0_1px_0_rgb(0_0_0/0.06),0_8px_24px_-12px_rgb(0_0_0/0.15)]" : ""}`}>
      <div className="hidden bg-ink text-[12px] text-steel-300 md:block">
        <div className="container-x flex h-9 items-center justify-between">
          <p>{site.tagline} · Pan-India supply & installation</p>
          <div className="flex items-center gap-5">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:text-white">
              <Phone className="size-3.5" /> {site.phone}
            </a>
            <span>{site.hours}</span>
          </div>
        </div>
      </div>

      <div className="container-x flex h-16 items-center gap-4 md:h-[72px]">
        <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
          <Logo />
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`relative rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                isActive(n.href) ? "text-ink" : "text-steel-500 hover:text-ink"
              }`}
            >
              {n.label}
              {isActive(n.href) && <span className="absolute inset-x-3.5 -bottom-[13px] h-0.5 rounded-full bg-flame" />}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden w-full max-w-xs md:block xl:max-w-sm">
          <SearchBox index={index} />
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <button
            onClick={() => setMobileSearch((v) => !v)}
            className="grid size-11 place-items-center rounded-full hover:bg-steel-100 md:hidden"
            aria-label="Search"
          >
            <Search className="size-5" />
          </button>
          <button
            onClick={() => setOpen(true)}
            className="relative flex h-11 items-center gap-2 rounded-full bg-ink pl-3.5 pr-4 text-sm font-semibold text-white hover:bg-ink-3"
            aria-label={`Enquiry list, ${count} items`}
          >
            <ClipboardList className="size-5" />
            <span className="hidden sm:inline">Enquiry</span>
            {ready && count > 0 && (
              <span key={count} className="grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-flame px-1.5 text-[11px] font-bold">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenu((v) => !v)}
            className="grid size-11 place-items-center rounded-full hover:bg-steel-100 lg:hidden"
            aria-label="Menu"
            aria-expanded={menu}
          >
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileSearch && (
        <div className="container-x pb-3 md:hidden">
          <SearchBox index={index} autoFocus onNavigate={() => setMobileSearch(false)} />
        </div>
      )}

      {menu && (
        <nav className="border-t border-steel-100 bg-white lg:hidden">
          <div className="container-x grid gap-1 py-3">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-xl px-4 py-3.5 text-base font-semibold ${isActive(n.href) ? "bg-steel-100 text-ink" : "text-steel-600"}`}
              >
                {n.label}
              </Link>
            ))}
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="btn-ghost mt-2">
              <Phone className="size-4" /> Call sales {site.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
