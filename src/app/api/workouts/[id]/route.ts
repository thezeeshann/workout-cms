import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { workoutExercises, workouts } from "@/db/schema";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const parsed = z.string().uuid().safeParse(id);
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
  const exercises = await db
    .select()
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, w.id))
    .orderBy(asc(workoutExercises.sortOrder));
  return NextResponse.json({ workout: w, exercises });
}
