import { eq } from "drizzle-orm";
import { db, ensureSchema } from "@/lib/db";
import { users, medications } from "@/lib/schema";
import { hashPassword } from "@/lib/password";

// Seeds a demo account so you can log in immediately:
//   email: demo@medtrack.app   password: password123
async function main() {
  await ensureSchema();

  const email = "demo@medtrack.app";
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    console.log("Demo user already exists — skipping seed.");
    return;
  }

  const [user] = await db
    .insert(users)
    .values({ name: "Demo User", email, passwordHash: await hashPassword("password123") })
    .returning({ id: users.id });

  await db.insert(medications).values([
    { userId: user.id, name: "Lisinopril", dosage: "10 mg", frequency: "Once daily", notes: "Morning, with food" },
    { userId: user.id, name: "Metformin", dosage: "500 mg", frequency: "Twice daily", notes: null },
    { userId: user.id, name: "Vitamin D", dosage: "2000 IU", frequency: "Once daily", notes: null },
  ]);

  console.log("Seeded demo user: demo@medtrack.app / password123");
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
