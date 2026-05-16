import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { coachClients, profiles } from "@/db/schema";

export async function GET() {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["coach"]);
  if (forbidden) return forbidden;

  const rows = await db
    .select({ client: profiles })
    .from(coachClients)
    .innerJoin(profiles, eq(coachClients.clientUserId, profiles.id))
    .where(eq(coachClients.coachUserId, auth.profile.id))
    .orderBy(desc(profiles.createdAt));
  return NextResponse.json({ clients: rows.map((r) => r.client) });
}
