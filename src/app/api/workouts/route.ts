import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { workoutExercises, workouts } from "@/db/schema";
import { createWorkoutBodySchema } from "@/lib/schemas/workout";

export async function GET() {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const rows = await db
    .select()
    .from(workouts)
    .orderBy(asc(workouts.createdAt));
  return NextResponse.json({ workouts: rows });
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
  const parsed = createWorkoutBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "validation",
          message: parsed.error.flatten().fieldErrors
            ? "Invalid workout payload"
            : "Invalid workout payload",
        },
      },
      { status: 400 }
    );
  }

  const [created] = await db
    .insert(workouts)
    .values({
      name: parsed.data.name,
      description: parsed.data.description,
      splitType: parsed.data.splitType,
      isTemplate: false,
      createdBy: auth.profile.id,
    })
    .returning();

  if (!created) {
    return NextResponse.json(
      { error: { code: "db_error", message: "Could not create workout" } },
      { status: 500 }
    );
  }

  const exerciseRows = parsed.data.exercises.map((ex, index) => ({
    workoutId: created.id,
    exerciseName: ex.exerciseName,
    sets: ex.sets ?? null,
    reps: ex.reps ?? null,
    sortOrder: ex.sortOrder ?? index,
    notes: ex.notes ?? null,
  }));
  await db.insert(workoutExercises).values(exerciseRows);
  return NextResponse.json({ workout: created }, { status: 201 });
}
