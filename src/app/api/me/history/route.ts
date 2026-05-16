import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { userHistory, workouts } from "@/db/schema";

const logHistorySchema = z.object({
  workoutId: z.string().uuid().optional(),
  snapshot: z.record(z.string(), z.any()).optional(),
});

export async function GET() {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["client"]);
  if (forbidden) return forbidden;

  const rows = await db
    .select({
      entry: userHistory,
      workout: workouts,
    })
    .from(userHistory)
    .leftJoin(workouts, eq(userHistory.workoutId, workouts.id))
    .where(eq(userHistory.clientUserId, auth.profile.id))
    .orderBy(desc(userHistory.performedAt))
    .limit(50);

  return NextResponse.json({
    history: rows.map((r) => ({
      ...r.entry,
      workout: r.workout,
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["client"]);
  if (forbidden) return forbidden;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
  const parsed = logHistorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid payload" } },
      { status: 400 }
    );
  }

  await db.insert(userHistory).values({
    clientUserId: auth.profile.id,
    workoutId: parsed.data.workoutId ?? null,
    snapshot: parsed.data.snapshot ?? null,
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
