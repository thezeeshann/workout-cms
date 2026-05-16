import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { userWorkouts, workoutExercises, workouts } from "@/db/schema";

export async function GET() {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["client"]);
  if (forbidden) return forbidden;

  const profile = auth.profile;
  const [active] = await db
    .select({
      userWorkout: userWorkouts,
      workout: workouts,
    })
    .from(userWorkouts)
    .innerJoin(workouts, eq(userWorkouts.workoutId, workouts.id))
    .where(
      and(
        eq(userWorkouts.clientUserId, profile.id),
        eq(userWorkouts.isActive, true)
      )
    )
    .limit(1);

  if (!active) {
    return NextResponse.json({ active: null });
  }
  const exercises = await db
    .select()
    .from(workoutExercises)
    .where(eq(workoutExercises.workoutId, active.workout.id))
    .orderBy(asc(workoutExercises.sortOrder));
  return NextResponse.json({
    active: {
      workout: active.workout,
      userWorkout: active.userWorkout,
      exercises,
    },
  });
}
