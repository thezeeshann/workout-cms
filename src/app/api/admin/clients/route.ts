import { count, desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { attendance, profiles, subscriptions } from "@/db/schema";

export async function GET() {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["admin"]);
  if (forbidden) return forbidden;

  const clients = await db
    .select()
    .from(profiles)
    .where(eq(profiles.role, "client"))
    .orderBy(desc(profiles.createdAt));

  const ids = clients.map((cl) => cl.id);
  if (ids.length === 0) {
    return NextResponse.json({ clients: [] });
  }

  const allSubs = await db
    .select()
    .from(subscriptions)
    .where(inArray(subscriptions.clientUserId, ids));

  const counts = await db
    .select({
      clientUserId: attendance.clientUserId,
      presentDays: count(),
    })
    .from(attendance)
    .where(inArray(attendance.clientUserId, ids))
    .groupBy(attendance.clientUserId);

  const countMap = new Map(
    counts.map((row) => [row.clientUserId, row.presentDays])
  );

  const latestSubByClient = new Map<string, (typeof allSubs)[number]>();
  for (const s of allSubs.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )) {
    if (!latestSubByClient.has(s.clientUserId)) {
      latestSubByClient.set(s.clientUserId, s);
    }
  }

  return NextResponse.json({
    clients: clients.map((cl) => {
      const sub = latestSubByClient.get(cl.id);
      return {
        ...cl,
        subscription: sub ?? null,
        presentDays: countMap.get(cl.id) ?? 0,
      };
    }),
  });
}
