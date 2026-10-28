import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import LoginForm from "@/components/admin/LoginForm";
import { isAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Team login", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col">
        <div className="grid-lines absolute inset-0" />
        <div className="absolute -bottom-40 -left-40 size-[520px] rounded-full bg-flame/25 blur-[120px]" />
        <div className="relative"><Logo dark /></div>
        <div className="relative mt-auto">
          <p className="eyebrow">Catalogue manager</p>
          <h1 className="mt-3 max-w-md font-display text-4xl font-extrabold leading-tight">
            Update products, brochures and follow up on every enquiry.
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden"><Logo /></div>
          <h2 className="mt-8 font-display text-3xl font-extrabold tracking-tight lg:mt-0">Team login</h2>
          <p className="mt-2 text-sm text-steel-500">Sign in to manage the catalogue.</p>
          <LoginForm />
          <p className="mt-6 rounded-xl bg-flame-50 p-3 text-xs text-steel-600">
            Demo password: <b className="font-mono">admin123</b> (set <span className="font-mono">ADMIN_PASSWORD</span> in production)
          </p>
        </div>
      </div>
    </div>
  );
}
