"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { apiJson } from "@/lib/api/client";
import { SectionHeader } from "@/components/layout/section-header";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DietPlanDto } from "@/features/coach/types";
import { toInputDate } from "@/features/admin/date";

const planSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
});

type PlanForm = z.infer<typeof planSchema>;

export function CoachClientDetail({ clientId }: { clientId: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["coach", "diet-plans", clientId],
    queryFn: () =>
      apiJson<{ dietPlans: DietPlanDto[] }>(
        `/coach/clients/${clientId}/diet-plans`
      ),
  });

  const form = useForm<PlanForm>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      title: "",
      content: "",
      validFrom: "",
      validUntil: "",
    },
  });

  const createPlan = useMutation({
    mutationFn: (body: PlanForm) =>
      apiJson("/coach/diet-plans", {
        method: "POST",
        body: JSON.stringify({
          clientUserId: clientId,
          title: body.title,
          content: body.content,
          validFrom: body.validFrom
            ? new Date(`${body.validFrom}T12:00:00.000Z`).toISOString()
            : null,
          validUntil: body.validUntil
            ? new Date(`${body.validUntil}T12:00:00.000Z`).toISOString()
            : null,
        }),
      }),
    onSuccess: () => {
      toast.success("Diet plan created");
      form.reset();
      qc.invalidateQueries({ queryKey: ["coach", "diet-plans", clientId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deletePlan = useMutation({
    mutationFn: (planId: string) =>
      apiJson(`/coach/diet-plans/${planId}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Removed");
      qc.invalidateQueries({ queryKey: ["coach", "diet-plans", clientId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Error"}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="Client diet plans">
        Create and maintain nutrition guidance for this member.
      </SectionHeader>
      <Button type="button" variant="ghost" size="sm" onClick={() => router.back()}>
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New diet plan</CardTitle>
          <CardDescription>
            Plain text or markdown-style notes work for MVP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit((v) => createPlan.mutate(v))}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-32 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                {...form.register("content")}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vf">Valid from</Label>
                <Input id="vf" type="date" {...form.register("validFrom")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vu">Valid until</Label>
                <Input id="vu" type="date" {...form.register("validUntil")} />
              </div>
            </div>
            <Button type="submit" disabled={createPlan.isPending}>
              Save plan
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Existing plans</CardTitle>
        </CardHeader>
        <CardContent className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Valid</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!data?.dietPlans.length ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    No plans yet.
                  </TableCell>
                </TableRow>
              ) : (
                data.dietPlans.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {p.validFrom || p.validUntil
                        ? `${p.validFrom ? toInputDate(p.validFrom) : "—"} → ${p.validUntil ? toInputDate(p.validUntil) : "—"}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (
                            typeof window !== "undefined" &&
                            window.confirm(
                              "Delete this diet plan? You cannot undo this."
                            )
                          ) {
                            deletePlan.mutate(p.id);
                          }
                        }}
                        disabled={deletePlan.isPending}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
