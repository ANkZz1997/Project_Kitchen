import EquipmentArt from "./EquipmentArt";
import { fileUrl } from "@/lib/catalog";
import type { ArtKind } from "@/lib/types";

/** Uploaded photo when available, otherwise the vector illustration. */
export default function ProductThumb({
  art,
  image,
  alt,
  className = "",
  tone = 0,
}: {
  art: ArtKind;
  image?: string;
  alt: string;
  className?: string;
  tone?: number;
}) {
  if (image)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={fileUrl(image)} alt={alt} className={`object-contain bg-white ${className}`} loading="lazy" />;
  return <EquipmentArt kind={art} tone={tone} className={className} />;
}
