"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db, ensureSchema } from "@/lib/db";
import { medications, doseLogs } from "@/lib/schema";
import { medicationSchema } from "@/lib/validation";
import { getUserId } from "@/lib/auth";

export type MedState = { error?: string };

async function requireUser(): Promise<string> {
  const id = await getUserId();
  if (!id) throw new Error("Not authenticated");
  return id;
}

export async function addMedication(_prev: MedState, formData: FormData): Promise<MedState> {
  const userId = await requireUser();
  const parsed = medicationSchema.safeParse({
    name: formData.get("name"),
    dosage: formData.get("dosage"),
    frequency: formData.get("frequency"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  await ensureSchema();
  const { name, dosage, frequency, notes } = parsed.data;
  await db.insert(medications).values({
    userId,
    name,
    dosage,
    frequency,
    notes: notes ? notes : null,
  });

  revalidatePath("/dashboard/medications");
  revalidatePath("/dashboard");
  return {};
}

export async function deleteMedication(formData: FormData): Promise<void> {
  const userId = await requireUser();
  const id = String(formData.get("id"));
  await ensureSchema();
  await db.delete(medications).where(and(eq(medications.id, id), eq(medications.userId, userId)));
  revalidatePath("/dashboard/medications");
  revalidatePath("/dashboard");
}

export async function logDose(formData: FormData): Promise<void> {
  const userId = await requireUser();
  const medicationId = String(formData.get("medicationId"));
  await ensureSchema();

  const [med] = await db
    .select({ id: medications.id })
    .from(medications)
    .where(and(eq(medications.id, medicationId), eq(medications.userId, userId)))
    .limit(1);
  if (!med) return;

  await db.insert(doseLogs).values({ medicationId });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/medications");
}
