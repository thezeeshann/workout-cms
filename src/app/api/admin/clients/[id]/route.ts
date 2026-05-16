import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { attendance, coachClients, profiles, subscriptions } from "@/db/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["admin"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid client id" } },
      { status: 400 }
    );
  }

  const [client] = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.id, parsed.data), eq(profiles.role, "client")))
    .limit(1);
  if (!client) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Client not found" } },
      { status: 404 }
    );
  }

  const subs = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.clientUserId, client.id))
    .orderBy(desc(subscriptions.createdAt));

  const days = await db
    .select()
    .from(attendance)
    .where(eq(attendance.clientUserId, client.id))
    .orderBy(desc(attendance.day))
    .limit(60);

  const assignments = await db
    .select({
      coach: profiles,
    })
    .from(coachClients)
    .innerJoin(profiles, eq(coachClients.coachUserId, profiles.id))
    .where(eq(coachClients.clientUserId, client.id));

  return NextResponse.json({
    client,
    subscriptions: subs,
    attendance: days,
    coaches: assignments.map((a) => a.coach),
  });
}
