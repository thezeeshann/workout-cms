import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { userWorkouts, workouts } from "@/db/schema";

type Params = { params: Promise<{ workoutId: string }> };

export async function POST(_request: Request, { params }: Params) {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["client"]);
  if (forbidden) return forbidden;

  const { workoutId } = await params;
  const parsed = z.string().uuid().safeParse(workoutId);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid workout id" } },
      { status: 400 }
    );
  }

  const [w] = await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, parsed.data))
    .limit(1);
  if (!w) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Workout not found" } },
      { status: 404 }
    );
  }

  await db
    .update(userWorkouts)
    .set({ isActive: false })
    .where(eq(userWorkouts.clientUserId, auth.profile.id));

  await db.insert(userWorkouts).values({
    clientUserId: auth.profile.id,
    workoutId: parsed.data,
    isActive: true,
  });

  return NextResponse.json({ ok: true });
}
