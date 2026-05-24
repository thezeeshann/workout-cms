"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiJson } from "@/lib/api/client";
import { SectionHeader } from "@/components/layout/section-header";
import { CoachClientsGridSkeleton } from "@/components/layout/loading-skeletons";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  dashboardCardClass,
  dashboardCardTitleClass,
  dashboardGridClass,
} from "@/lib/ui/dashboard";
import type { CoachClientRow } from "@/features/coach/types";

export default function CoachClientsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["coach", "clients"],
    queryFn: () => apiJson<{ clients: CoachClientRow[] }>("/coach/clients"),
  });

  return (
    <div className="space-y-8">
      <SectionHeader title="Your clients">
        Members assigned to you by an admin.
      </SectionHeader>
      {isLoading ? (
        <CoachClientsGridSkeleton />
      ) : error ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed"}
        </p>
      ) : !data?.clients.length ? (
        <p className="text-sm text-muted-foreground">
          No assigned clients yet. Ask an admin to link you from the client
          screen.
        </p>
      ) : (
        <div className={dashboardGridClass}>
          {data.clients.map((c) => (
            <Link key={c.id} href={`/coach/clients/${c.id}`}>
              <Card
                className={`h-full transition-colors hover:bg-muted/40 ${dashboardCardClass}`}
              >
                <CardHeader>
                  <CardTitle className={dashboardCardTitleClass}>
                    {c.displayName ?? c.email}
                  </CardTitle>
                  <CardDescription>{c.email}</CardDescription>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">
                      {c.subscription?.status ?? "none"}
                    </Badge>
                    {c.subscription?.endsAt ? (
                      <span className="text-xs text-muted-foreground">
                        Ends{" "}
                        {new Date(c.subscription.endsAt).toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
