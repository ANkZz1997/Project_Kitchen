import { site } from "@/lib/site";

// Placeholder mark — swap for the client's supplied logo file.
export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 36 36" className="size-9 shrink-0" aria-hidden="true">
        <rect width="36" height="36" rx="9" fill={dark ? "#fff" : "#0f1114"} />
        <path
          d="M18 7c1.2 3.8 5.8 6.2 5.8 11.6A5.8 5.8 0 0 1 18 24.4a5.8 5.8 0 0 1-5.8-5.8c0-2.6 1.4-4.2 2.6-5.4.2 1.8 1 3 2.2 3.4C16.4 13 17.2 9.6 18 7Z"
          fill="#ff5c1f"
        />
        <rect x="9" y="26.5" width="18" height="2.6" rx="1.3" fill={dark ? "#0f1114" : "#fff"} />
      </svg>
      <span className="leading-none">
        <span className={`block font-display text-lg font-extrabold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
          {site.name}
        </span>
        <span className={`block text-[10px] font-semibold uppercase tracking-[0.2em] ${dark ? "text-steel-400" : "text-steel-500"}`}>
          Commercial Kitchens
        </span>
      </span>
    </span>
  );
}
