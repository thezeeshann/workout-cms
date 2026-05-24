"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiJson } from "@/lib/api/client";
import { SectionHeader } from "@/components/layout/section-header";
import { AdminClientsTableSkeleton } from "@/components/layout/loading-skeletons";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminClientRow } from "@/features/admin/types";

export default function AdminClientsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "clients"],
    queryFn: () => apiJson<{ clients: AdminClientRow[] }>("/admin/clients"),
  });

  return (
    <div className="space-y-8">
      <SectionHeader title="Clients">
        Subscription status, attendance days, and assignments.
      </SectionHeader>
      {isLoading ? (
        <AdminClientsTableSkeleton />
      ) : error ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load"}
        </p>
      ) : !data?.clients.length ? (
        <p className="text-sm text-muted-foreground">
          No clients yet. Have members sign up with Google, then promote coaches
          from the admin client screen as needed.
        </p>
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Ends</TableHead>
                <TableHead className="text-right tabular-nums">
                  Present days
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.clients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link
                      href={`/admin/clients/${c.id}`}
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {c.email}
                    </Link>
                  </TableCell>
                  <TableCell>{c.displayName ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {c.subscription?.status ?? "none"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.subscription?.endsAt
                      ? new Date(c.subscription.endsAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.presentDays}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
