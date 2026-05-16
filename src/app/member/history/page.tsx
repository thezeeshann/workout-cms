"use client";

import { useQuery } from "@tanstack/react-query";
import { apiJson } from "@/lib/api/client";
import { SectionHeader } from "@/components/layout/section-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type HistoryEntry = {
  id: string;
  performedAt: string;
  workoutId: string | null;
  workout: { name: string } | null;
};

export default function MemberHistoryPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me", "history"],
    queryFn: () => apiJson<{ history: HistoryEntry[] }>("/me/history"),
  });

  return (
    <div className="space-y-8">
      <SectionHeader title="Workout history">
        Recent sessions you have logged.
      </SectionHeader>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Error"}
        </p>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Workout</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data?.history.length ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-muted-foreground">
                    No sessions yet. Log one from My program.
                  </TableCell>
                </TableRow>
              ) : (
                data.history.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>
                      {new Date(h.performedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{h.workout?.name ?? "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
