"use client";

import { useState } from "react";
import { fileUrl } from "@/lib/catalog";
import type { ArtKind } from "@/lib/types";
import EquipmentArt from "./EquipmentArt";

type Slide = { kind: "image"; src: string } | { kind: "art"; zoom: number; tone: number };

export default function ProductGallery({ art, images, name, isNew }: { art: ArtKind; images: string[]; name: string; isNew: boolean }) {
  const slides: Slide[] = images.length
    ? images.map((src) => ({ kind: "image", src }))
    : [
        { kind: "art", zoom: 1, tone: 0 },
        { kind: "art", zoom: 1.7, tone: 1 },
        { kind: "art", zoom: 0.8, tone: 2 },
      ];
  const [active, setActive] = useState(0);

  const render = (s: Slide, cls: string) =>
    s.kind === "image" ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={fileUrl(s.src)} alt={name} className={`object-contain bg-white ${cls}`} />
    ) : (
      <EquipmentArt kind={art} zoom={s.zoom} tone={s.tone} className={cls} />
    );

  return (
    <div className="lg:sticky lg:top-32">
      <div className="relative overflow-hidden rounded-3xl border border-steel-200 bg-white">
        <div
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            setActive(Math.round(el.scrollLeft / el.clientWidth));
          }}
          id="gallery-track"
        >
          {slides.map((s, i) => (
            <div key={i} className="aspect-square w-full shrink-0 snap-center">
              {render(s, "size-full")}
            </div>
          ))}
        </div>
        {isNew && (
          <span className="absolute left-4 top-4 rounded-full bg-flame px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            New arrival
          </span>
        )}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:hidden">
          {slides.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-ink" : "w-1.5 bg-steel-300"}`} />
          ))}
        </div>
        {!images.length && (
          <span className="absolute bottom-4 right-4 hidden rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-steel-500 backdrop-blur sm:block">
            Illustration — product photography to be supplied
          </span>
        )}
      </div>
      <div className="mt-3 hidden gap-3 sm:flex">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(i);
              const el = document.getElementById("gallery-track");
              el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
            }}
            className={`size-20 overflow-hidden rounded-2xl border-2 transition ${i === active ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
            aria-label={`View image ${i + 1}`}
          >
            {render(s, "size-full")}
          </button>
        ))}
      </div>
    </div>
  );
}
