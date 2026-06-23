import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { createId } from "@/lib/id";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(createId),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const medications = pgTable(
  "medications",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    dosage: text("dosage").notNull(),
    frequency: text("frequency").notNull(),
    notes: text("notes"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({ userIdx: index("medications_user_idx").on(t.userId) }),
);

export const doseLogs = pgTable(
  "dose_logs",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    medicationId: text("medication_id")
      .notNull()
      .references(() => medications.id, { onDelete: "cascade" }),
    takenAt: timestamp("taken_at").notNull().defaultNow(),
  },
  (t) => ({ medIdx: index("dose_logs_medication_idx").on(t.medicationId) }),
);

export type User = typeof users.$inferSelect;
export type Medication = typeof medications.$inferSelect;
export type DoseLog = typeof doseLogs.$inferSelect;
