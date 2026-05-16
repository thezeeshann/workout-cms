import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export type EnsureProfileInput = {
  id: string;
  email: string;
  name?: string | null;
};

export async function ensureProfile(user: EnsureProfileInput) {
  const [existing] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);
  if (existing) return existing;

  const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
  const role =
    adminEmail && user.email && user.email === adminEmail ? "admin" : "client";

  await db.insert(profiles).values({
    id: user.id,
    email: user.email,
    displayName: user.name ?? null,
    role,
  });

  const [created] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);
  return created ?? null;
}
