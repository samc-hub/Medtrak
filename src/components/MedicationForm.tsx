"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { addMedication, type MedState } from "@/app/dashboard/actions";
import { SubmitButton } from "@/components/SubmitButton";

export function MedicationForm() {
  const [state, formAction] = useFormState<MedState, FormData>(addMedication, {});
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form once an add succeeds (state resets to {} with no error).
  useEffect(() => {
    if (!state.error) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="rounded-xl border border-ink/10 bg-white p-5">
      <h2 className="font-display text-lg font-semibold">Add a medication</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Input name="name" label="Name" placeholder="Lisinopril" />
        <Input name="dosage" label="Dosage" placeholder="10 mg" />
        <Input name="frequency" label="Frequency" placeholder="Once daily" />
        <Input name="notes" label="Notes (optional)" placeholder="With breakfast" required={false} />
      </div>

      {state.error && (
        <p role="alert" className="mt-3 text-sm text-clay">
          {state.error}
        </p>
      )}

      <SubmitButton
        pendingLabel="Adding…"
        className="mt-4 rounded-lg bg-sage-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-700 disabled:opacity-60"
      >
        Add medication
      </SubmitButton>
    </form>
  );
}

function Input({
  name,
  label,
  placeholder,
  required = true,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink/70">{label}</span>
      <input
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm outline-none focus:border-sage-500"
      />
    </label>
  );
}
