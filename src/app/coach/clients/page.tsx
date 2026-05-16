"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiJson } from "@/lib/api/client";
import { SectionHeader } from "@/components/layout/section-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProfileDto } from "@/features/coach/types";

export default function CoachClientsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["coach", "clients"],
    queryFn: () => apiJson<{ clients: ProfileDto[] }>("/coach/clients"),
  });

  return (
    <div className="space-y-8">
      <SectionHeader title="Your clients">
        Members assigned to you by an admin.
      </SectionHeader>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
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
        <div className="grid gap-4 sm:grid-cols-2">
          {data.clients.map((c) => (
            <Link key={c.id} href={`/coach/clients/${c.id}`}>
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-base">
                    {c.displayName ?? c.email}
                  </CardTitle>
                  <CardDescription>{c.email}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
