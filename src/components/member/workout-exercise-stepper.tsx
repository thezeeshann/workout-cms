"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type WorkoutExerciseItem = {
  id: string;
  exerciseName: string;
  sets: number | null;
  reps: string | null;
  notes?: string | null;
};

export function WorkoutExerciseStepper({
  exercises,
}: {
  exercises: WorkoutExerciseItem[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (exercises.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No exercises listed.</p>
    );
  }

  const current = exercises[currentIndex];
  const atStart = currentIndex === 0;
  const atEnd = currentIndex === exercises.length - 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
          Exercise {currentIndex + 1} of {exercises.length}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={atStart}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            aria-label="Previous exercise"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={atEnd}
            onClick={() =>
              setCurrentIndex((i) => Math.min(exercises.length - 1, i + 1))
            }
            aria-label="Next exercise"
          >
            Next
            <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div
        className="border-primary/30 bg-primary/5 rounded-lg border-2 px-4 py-4"
        aria-live="polite"
      >
        <p className="font-heading text-primary text-lg font-semibold">
          {current.exerciseName}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {current.sets != null ? `${current.sets} sets` : null}
          {current.reps ? `${current.sets != null ? " · " : ""}${current.reps} reps` : null}
          {current.notes ? ` · ${current.notes}` : null}
        </p>
      </div>

      <ol className="space-y-1.5 text-sm" aria-label="All exercises">
        {exercises.map((ex, index) => {
          const isCurrent = index === currentIndex;
          return (
            <li key={ex.id}>
              <button
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-full cursor-pointer rounded-md px-3 py-2 text-left transition-colors",
                  isCurrent
                    ? "bg-primary/15 text-primary font-medium ring-1 ring-primary/25"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span className="tabular-nums">{index + 1}.</span>{" "}
                {ex.exerciseName}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
