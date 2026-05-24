"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiJson } from "@/lib/api/client";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkoutExerciseStepper } from "@/components/member/workout-exercise-stepper";

type WorkoutDetail = {
  workout: {
    id: string;
    name: string;
    description: string | null;
    splitType: string;
  };
  exercises: {
    id: string;
    exerciseName: string;
    sets: number | null;
    reps: string | null;
    sortOrder: number;
    notes: string | null;
  }[];
};

export function MemberWorkoutDetail({ workoutId }: { workoutId: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["workout", workoutId],
    queryFn: () => apiJson<WorkoutDetail>(`/workouts/${workoutId}`),
  });

  const assign = useMutation({
    mutationFn: () =>
      apiJson(`/me/workouts/${workoutId}/assign`, { method: "POST" }),
    onSuccess: () => {
      toast.success("Program updated");
      qc.invalidateQueries({ queryKey: ["me", "active"] });
      router.push("/member/program");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }
  if (error || !data) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Not found"}
      </p>
    );
  }

  const { workout, exercises } = data;

  return (
    <div className="space-y-8">
      <SectionHeader title={workout.name}>
        <Badge variant="secondary">{workout.splitType}</Badge>
      </SectionHeader>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/member/workouts"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Back
        </Link>
        <Button
          size="sm"
          onClick={() => assign.mutate()}
          disabled={assign.isPending}
        >
          Use as my program
        </Button>
      </div>
      {workout.description ? (
        <p className="text-sm text-muted-foreground">{workout.description}</p>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exercises</CardTitle>
          <CardDescription>Order and prescriptions for this day.</CardDescription>
        </CardHeader>
        <CardContent>
          <WorkoutExerciseStepper exercises={exercises} />
        </CardContent>
      </Card>
    </div>
  );
}
