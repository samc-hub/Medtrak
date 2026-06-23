import { desc, eq } from "drizzle-orm";
import { db, ensureSchema } from "@/lib/db";
import { medications } from "@/lib/schema";
import { getUserId } from "@/lib/auth";
import { MedicationForm } from "@/components/MedicationForm";
import { deleteMedication, logDose } from "@/app/dashboard/actions";

export const dynamic = "force-dynamic";

export default async function MedicationsPage() {
  const userId = await getUserId();
  await ensureSchema();
  const meds = userId
    ? await db
        .select()
        .from(medications)
        .where(eq(medications.userId, userId))
        .orderBy(desc(medications.createdAt))
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Medications</h1>
        <p className="mt-1 text-sm text-ink/60">
          Everything you&rsquo;re tracking. Log a dose the moment you take it.
        </p>
      </div>

      <MedicationForm />

      {meds.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/15 px-5 py-10 text-center text-sm text-ink/50">
          No medications yet. Add your first one above.
        </p>
      ) : (
        <ul className="space-y-3">
          {meds.map((med) => (
            <li
              key={med.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white p-4"
            >
              <div>
                <p className="font-medium">
                  {med.name} <span className="text-ink/50">· {med.dosage}</span>
                </p>
                <p className="text-sm text-ink/60">
                  {med.frequency}
                  {med.notes ? ` — ${med.notes}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={logDose}>
                  <input type="hidden" name="medicationId" value={med.id} />
                  <button className="rounded-lg bg-sage-100 px-3 py-2 text-sm font-medium text-sage-700 hover:bg-sage-500 hover:text-white">
                    Log dose
                  </button>
                </form>
                <form action={deleteMedication}>
                  <input type="hidden" name="id" value={med.id} />
                  <button
                    aria-label={`Delete ${med.name}`}
                    className="rounded-lg px-3 py-2 text-sm text-ink/50 hover:bg-clay/10 hover:text-clay"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
