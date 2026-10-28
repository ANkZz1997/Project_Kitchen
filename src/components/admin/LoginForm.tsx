"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login } from "@/app/admin/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="password" className="label">Password</label>
        <input id="password" name="password" type="password" required autoFocus className="input" autoComplete="current-password" />
        {state?.error && <p className="mt-1.5 text-sm text-red-600">{state.error}</p>}
      </div>
      <button className="btn-dark h-12 w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />} Sign in
      </button>
    </form>
  );
}
