import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters").max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export const medicationSchema = z.object({
  name: z.string().trim().min(1, "Name the medication").max(120),
  dosage: z.string().trim().min(1, "Add a dosage, e.g. 10 mg").max(80),
  frequency: z.string().trim().min(1, "How often? e.g. Once daily").max(80),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});
