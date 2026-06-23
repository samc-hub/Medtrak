"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import type { AuthState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/SubmitButton";

type Action = (prev: AuthState, formData: FormData) => Promise<AuthState>;

export function AuthForm({ mode, action }: { mode: "login" | "register"; action: Action }) {
  const [state, formAction] = useFormState<AuthState, FormData>(action, {});
  const isRegister = mode === "register";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <Link href="/" className="mb-8 font-display text-xl font-semibold tracking-tight">
        Med<span className="text-sage-600">Track</span>
      </Link>

      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {isRegister ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        {isRegister
          ? "Start tracking your medications in under a minute."
          : "Log in to see today's doses."}
      </p>

      <form action={formAction} className="mt-8 space-y-4">
        {isRegister && <Field label="Name" name="name" type="text" autoComplete="name" />}
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          hint={isRegister ? "At least 8 characters" : undefined}
        />

        {state.error && (
          <p role="alert" className="rounded-md bg-clay/10 px-3 py-2 text-sm text-clay">
            {state.error}
          </p>
        )}

        <SubmitButton
          pendingLabel="One moment…"
          className="w-full rounded-lg bg-sage-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-700 disabled:opacity-60"
        >
          {isRegister ? "Create account" : "Log in"}
        </SubmitButton>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        {isRegister ? "Already have an account? " : "New to MedTrack? "}
        <Link
          href={isRegister ? "/login" : "/register"}
          className="font-medium text-sage-700 hover:underline"
        >
          {isRegister ? "Log in" : "Create one"}
        </Link>
      </p>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  hint,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-sage-500"
      />
      {hint && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}
