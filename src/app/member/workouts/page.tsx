"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiJson } from "@/lib/api/client";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WorkoutRow = {
  id: string;
  name: string;
  description: string | null;
  splitType: string;
  isTemplate: boolean;
};

export default function MemberWorkoutsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["workouts"],
    queryFn: () => apiJson<{ workouts: WorkoutRow[] }>("/workouts"),
  });

  return (
    <div className="space-y-8">
      <SectionHeader title="Workout catalog">
        Templates and custom programs you can assign under My program.
      </SectionHeader>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading workouts…</p>
      ) : error ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load"}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {data?.workouts.map((w) => (
            <Link
              key={w.id}
              href={`/member/workouts/${w.id}`}
              className="block cursor-pointer"
            >
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{w.name}</CardTitle>
                    <Badge variant="outline">{w.splitType}</Badge>
                  </div>
                  <CardDescription>
                    {w.description ?? (w.isTemplate ? "Template" : "Custom")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
