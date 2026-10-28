import Link from "next/link";
import EquipmentArt from "@/components/EquipmentArt";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <EquipmentArt kind="fridge" plain className="w-48 opacity-80" />
      <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight">This page has gone cold</h1>
      <p className="mt-2 text-steel-500">We couldn’t find what you were looking for.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-dark">Home</Link>
        <Link href="/products" className="btn-ghost">Browse products</Link>
      </div>
    </div>
  );
}
