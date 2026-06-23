import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6">
      <header className="flex items-center justify-between py-6">
        <span className="font-display text-xl font-semibold tracking-tight">
          Med<span className="text-sage-600">Track</span>
        </span>
        <nav className="text-sm">
          {user ? (
            <Link href="/dashboard" className="font-medium text-sage-700 hover:underline">
              Go to dashboard →
            </Link>
          ) : (
            <span className="flex gap-4">
              <Link href="/login" className="text-ink/70 hover:text-ink">
                Log in
              </Link>
              <Link href="/register" className="font-medium text-sage-700 hover:underline">
                Get started
              </Link>
            </span>
          )}
        </nav>
      </header>

      <section className="flex flex-1 flex-col justify-center pb-24 pt-10">
        <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-sage-700">
          <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
          Private by default
        </p>
        <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Keep every dose
          <br />
          on the record.
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/70">
          MedTrack is a quiet, focused place to list your medications and log
          when you take them — so the answer to &ldquo;did I take it?&rdquo; is
          never a guess.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-sage-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-700"
          >
            Create your tracker
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-ink/15 px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink/30"
          >
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
