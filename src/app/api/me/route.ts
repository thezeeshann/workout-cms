import { and, count, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { attendance, subscriptions } from "@/db/schema";

export async function GET() {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["client"]);
  if (forbidden) return forbidden;

  const profile = auth.profile;
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.clientUserId, profile.id))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  const [presentRow] = await db
    .select({ presentDays: count() })
    .from(attendance)
    .where(eq(attendance.clientUserId, profile.id));

  const [todayAttendance] = await db
    .select()
    .from(attendance)
    .where(
      and(
        eq(attendance.clientUserId, profile.id),
        sql`${attendance.day} = CURRENT_DATE`
      )
    )
    .limit(1);

  return NextResponse.json({
    profile,
    subscription: sub ?? null,
    presentDays: presentRow?.presentDays ?? 0,
    checkedInToday: Boolean(todayAttendance),
  });
}
