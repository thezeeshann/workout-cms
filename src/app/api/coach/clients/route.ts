import { desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { coachClients, profiles, subscriptions } from "@/db/schema";

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

  const clients = rows.map((r) => r.client);
  const ids = clients.map((c) => c.id);

  if (ids.length === 0) {
    return NextResponse.json({ clients: [] });
  }

  const allSubs = await db
    .select()
    .from(subscriptions)
    .where(inArray(subscriptions.clientUserId, ids));

  const latestSubByClient = new Map<string, (typeof allSubs)[number]>();
  for (const s of allSubs.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )) {
    if (!latestSubByClient.has(s.clientUserId)) {
      latestSubByClient.set(s.clientUserId, s);
    }
  }

  return NextResponse.json({
    clients: clients.map((cl) => ({
      ...cl,
      subscription: latestSubByClient.get(cl.id) ?? null,
    })),
  });
}
