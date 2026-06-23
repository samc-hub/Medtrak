import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="font-display text-lg font-semibold tracking-tight">
              Med<span className="text-sage-600">Track</span>
            </Link>
            <nav className="flex gap-5 text-sm">
              <Link href="/dashboard" className="text-ink/70 hover:text-ink">
                Today
              </Link>
              <Link href="/dashboard/medications" className="text-ink/70 hover:text-ink">
                Medications
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-ink/50 sm:inline">{user?.name}</span>
            <form action={logout}>
              <button className="rounded-md px-2 py-1 text-ink/70 hover:bg-ink/5 hover:text-ink">
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
