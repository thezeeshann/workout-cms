"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { apiJson } from "@/lib/api/client";
import { SectionHeader } from "@/components/layout/section-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkoutExerciseStepper } from "@/components/member/workout-exercise-stepper";

type ActiveResponse = {
  active: {
    workout: { id: string; name: string; description: string | null };
    exercises: {
      id: string;
      exerciseName: string;
      sets: number | null;
      reps: string | null;
      notes: string | null;
    }[];
  } | null;
};

export default function MemberProgramPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["me", "active"],
    queryFn: () => apiJson<ActiveResponse>("/me/workouts/active"),
  });

  const logSession = useMutation({
    mutationFn: (workoutId: string) =>
      apiJson("/me/history", {
        method: "POST",
        body: JSON.stringify({ workoutId }),
      }),
    onSuccess: () => {
      toast.success("Session logged");
      qc.invalidateQueries({ queryKey: ["me", "history"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-8">
      <SectionHeader title="My program">
        Active workout and quick log for history.
      </SectionHeader>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Error"}
        </p>
      ) : !data?.active ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No active program</CardTitle>
            <CardDescription>
              Pick a workout from the catalog and tap &quot;Use as my
              program&quot;.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href="/member/workouts"
              className={cn(buttonVariants())}
            >
              Browse workouts
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/member/workouts/${data.active.workout.id}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Open detail
            </Link>
            <Button
              size="sm"
              onClick={() => logSession.mutate(data.active!.workout.id)}
              disabled={logSession.isPending}
            >
              Log session
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {data.active.workout.name}
              </CardTitle>
              {data.active.workout.description ? (
                <CardDescription>
                  {data.active.workout.description}
                </CardDescription>
              ) : null}
            </CardHeader>
            <CardContent>
              <WorkoutExerciseStepper exercises={data.active.exercises} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
