import { randomBytes } from "crypto";

// Small, dependency-free unique id generator (URL-safe, ~22 chars).
export function createId(): string {
  return randomBytes(16).toString("base64url");
}
