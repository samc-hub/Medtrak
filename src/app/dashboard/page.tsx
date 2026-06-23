import Link from "next/link";
import { desc, eq, gte } from "drizzle-orm";
import { db, ensureSchema } from "@/lib/db";
import { medications, doseLogs } from "@/lib/schema";
import { getCurrentUser, getUserId } from "@/lib/auth";
import { logDose } from "@/app/dashboard/actions";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const user = await getCurrentUser();
  const userId = await getUserId();
  await ensureSchema();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const meds = userId
    ? await db
        .select()
        .from(medications)
        .where(eq(medications.userId, userId))
        .orderBy(desc(medications.createdAt))
    : [];

  // Join today's dose logs to their medication name.
  const todaysDoses = userId
    ? await db
        .select({
          id: doseLogs.id,
          takenAt: doseLogs.takenAt,
          name: medications.name,
          dosage: medications.dosage,
        })
        .from(doseLogs)
        .innerJoin(medications, eq(doseLogs.medicationId, medications.id))
        .where(eq(medications.userId, userId))
        .orderBy(desc(doseLogs.takenAt))
    : [];

  const today = todaysDoses.filter((d) => new Date(d.takenAt) >= startOfToday);

  return (
    <div className="space-y-10">
      <div>
        <p className="text-sm text-ink/50">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Good to see you, {user?.name?.split(" ")[0] ?? "there"}.
        </h1>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Medications tracked" value={meds.length} />
        <Stat label="Doses logged today" value={today.length} />
        <Stat
          label="Last dose"
          value={
            today[0]
              ? new Date(today[0].takenAt).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "—"
          }
        />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Quick log</h2>
          <Link href="/dashboard/medications" className="text-sm text-sage-700 hover:underline">
            Manage medications →
          </Link>
        </div>
        {meds.length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink/15 px-5 py-8 text-center text-sm text-ink/50">
            Add a medication to start logging doses.{" "}
            <Link href="/dashboard/medications" className="text-sage-700 hover:underline">
              Add one →
            </Link>
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {meds.map((med) => (
              <li
                key={med.id}
                className="flex items-center justify-between rounded-xl border border-ink/10 bg-white p-3"
              >
                <span className="text-sm">
                  {med.name} <span className="text-ink/50">· {med.dosage}</span>
                </span>
                <form action={logDose}>
                  <input type="hidden" name="medicationId" value={med.id} />
                  <button className="rounded-lg bg-sage-100 px-3 py-1.5 text-sm font-medium text-sage-700 hover:bg-sage-500 hover:text-white">
                    Log
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Today&rsquo;s log</h2>
        {today.length === 0 ? (
          <p className="text-sm text-ink/50">Nothing logged yet today.</p>
        ) : (
          <ul className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white">
            {today.map((dose) => (
              <li key={dose.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>
                  {dose.name} <span className="text-ink/50">· {dose.dosage}</span>
                </span>
                <span className="text-ink/50">
                  {new Date(dose.takenAt).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <p className="font-display text-3xl font-semibold text-sage-700">{value}</p>
      <p className="mt-1 text-sm text-ink/60">{label}</p>
    </div>
  );
}
