import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "hl_admin";
const MAX_AGE = 60 * 60 * 12;

const secret = () => process.env.ADMIN_SECRET || "dev-secret-change-me";
export const adminPassword = () => process.env.ADMIN_PASSWORD || "admin123";

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function checkPassword(input: string) {
  const a = Buffer.from(sign(input));
  const b = Buffer.from(sign(adminPassword()));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession() {
  const expires = Date.now() + MAX_AGE * 1000;
  const token = `${expires}.${sign(String(expires))}`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  const expected = sign(expires);
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
