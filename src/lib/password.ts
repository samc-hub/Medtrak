import bcrypt from "bcryptjs";

// Password hashing lives in its own module (no "server-only" guard) so it can
// be used both by server actions and by standalone scripts like the seeder.
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
