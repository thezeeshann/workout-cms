"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { apiJson } from "@/lib/api/client";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ClientDetailResponse } from "@/features/admin/types";
import { toInputDate } from "@/features/admin/date";

const subscriptionSchema = z.object({
  status: z.enum(["active", "inactive", "trial"]),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  notes: z.string().optional(),
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;

export function AdminClientDetail({ clientId }: { clientId: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "client", clientId],
    queryFn: () => apiJson<ClientDetailResponse>(`/admin/clients/${clientId}`),
  });

  const { data: coachesData } = useQuery({
    queryKey: ["admin", "coaches"],
    queryFn: () =>
      apiJson<{
        coaches: { id: string; email: string; displayName: string | null }[];
      }>("/admin/coaches"),
  });

  const latestSub = data?.subscriptions?.[0];

  const subForm = useForm<SubscriptionForm>({
    resolver: zodResolver(subscriptionSchema),
    values: {
      status: (latestSub?.status ?? "inactive") as SubscriptionForm["status"],
      startsAt: toInputDate(latestSub?.startsAt ?? undefined),
      endsAt: toInputDate(latestSub?.endsAt ?? undefined),
      notes: latestSub?.notes ?? "",
    },
  });

  const saveSub = useMutation({
    mutationFn: (body: SubscriptionForm) =>
      apiJson(`/admin/clients/${clientId}/subscription`, {
        method: "PATCH",
        body: JSON.stringify({
          status: body.status,
          startsAt: body.startsAt
            ? new Date(`${body.startsAt}T12:00:00.000Z`).toISOString()
            : null,
          endsAt: body.endsAt
            ? new Date(`${body.endsAt}T12:00:00.000Z`).toISOString()
            : null,
          notes: body.notes || null,
        }),
      }),
    onSuccess: () => {
      toast.success("Subscription updated");
      qc.invalidateQueries({ queryKey: ["admin", "client", clientId] });
      qc.invalidateQueries({ queryKey: ["admin", "clients"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addAttendance = useMutation({
    mutationFn: (day: string) =>
      apiJson(`/admin/clients/${clientId}/attendance`, {
        method: "POST",
        body: JSON.stringify({ day }),
      }),
    onSuccess: () => {
      toast.success("Attendance recorded");
      qc.invalidateQueries({ queryKey: ["admin", "client", clientId] });
      qc.invalidateQueries({ queryKey: ["admin", "clients"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const assignCoach = useMutation({
    mutationFn: (coachUserId: string) =>
      apiJson(`/admin/clients/${clientId}/coach`, {
        method: "POST",
        body: JSON.stringify({ coachUserId }),
      }),
    onSuccess: () => {
      toast.success("Coach assigned");
      qc.invalidateQueries({ queryKey: ["admin", "client", clientId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [attendanceDay, setAttendanceDay] = React.useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">Loading client…</p>
    );
  }
  if (error || !data) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Not found"}
      </p>
    );
  }

  const { client, attendance: attRows, coaches } = data;

  return (
    <div className="space-y-8">
      <SectionHeader title={client.displayName ?? client.email}>
        <span className="text-muted-foreground">{client.email}</span>
      </SectionHeader>
      <div className="flex gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
          Back to list
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Current row is the latest subscription for this client.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={subForm.handleSubmit((v) => saveSub.mutate(v))}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={subForm.watch("status")}
                  onValueChange={(v) =>
                    subForm.setValue("status", v as SubscriptionForm["status"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">active</SelectItem>
                    <SelectItem value="inactive">inactive</SelectItem>
                    <SelectItem value="trial">trial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startsAt">Starts</Label>
                <Input id="startsAt" type="date" {...subForm.register("startsAt")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endsAt">Ends</Label>
                <Input id="endsAt" type="date" {...subForm.register("endsAt")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" placeholder="Internal notes" {...subForm.register("notes")} />
              </div>
              <Button type="submit" disabled={saveSub.isPending}>
                Save subscription
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
            <CardDescription>
              Mark a day present. Duplicates are ignored.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-end gap-2">
              <div className="space-y-2">
                <Label htmlFor="att-day">Day</Label>
                <Input
                  id="att-day"
                  type="date"
                  value={attendanceDay}
                  onChange={(e) => setAttendanceDay(e.target.value)}
                />
              </div>
              <Button
                type="button"
                onClick={() => addAttendance.mutate(attendanceDay)}
                disabled={addAttendance.isPending}
              >
                Mark present
              </Button>
            </div>
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attRows.length === 0 ? (
                    <TableRow>
                      <TableCell className="text-muted-foreground">
                        No days recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    attRows.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell>
                          {toInputDate(a.day) || a.day}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned coaches</CardTitle>
          <CardDescription>
            Link a coach so they can manage diet plans for this client.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {coaches.map((coach) => (
              <Badge key={coach.id} variant="outline">
                {coach.displayName ?? coach.email}
              </Badge>
            ))}
            {coaches.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                No coaches assigned.
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[200px] space-y-2">
              <Label>Add coach</Label>
              <Select
                onValueChange={(id) => {
                  if (typeof id === "string") assignCoach.mutate(id);
                }}
                disabled={assignCoach.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose coach" />
                </SelectTrigger>
                <SelectContent>
                  {(coachesData?.coaches ?? []).map((coach) => (
                    <SelectItem key={coach.id} value={coach.id}>
                      {coach.displayName ?? coach.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
