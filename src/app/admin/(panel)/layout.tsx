import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { getEnquiries } from "@/lib/store";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const newCount = (await getEnquiries()).filter((e) => e.status === "new").length;
  return (
    <div className="min-h-dvh bg-steel-50 lg:flex">
      <AdminNav newEnquiries={newCount} />
      <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-10">{children}</div>
    </div>
  );
}
