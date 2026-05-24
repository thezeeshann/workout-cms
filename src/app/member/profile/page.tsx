"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiJson } from "@/lib/api/client";
import { profileInitial } from "@/lib/profile/initials";
import { SectionHeader } from "@/components/layout/section-header";
import { MemberProfileSkeleton } from "@/components/layout/loading-skeletons";
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
  dashboardCardClass,
  dashboardCardTitleClass,
} from "@/lib/ui/dashboard";

type MeResponse = {
  profile: {
    displayName: string | null;
    email: string;
  };
};

export default function MemberProfilePage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiJson<MeResponse>("/me"),
  });

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!data?.profile) return;
    setDisplayName(data.profile.displayName ?? "");
    setEmail(data.profile.email);
  }, [data?.profile]);

  const save = useMutation({
    mutationFn: () =>
      apiJson<{ profile: MeResponse["profile"] }>("/me/profile", {
        method: "PATCH",
        body: JSON.stringify({
          displayName: displayName.trim() || undefined,
          email: email.trim(),
        }),
      }),
    onSuccess: (res) => {
      toast.success("Profile updated");
      qc.setQueryData(["me"], (prev: MeResponse | undefined) =>
        prev ? { ...prev, profile: res.profile } : prev
      );
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const profile = data?.profile;
  const initial = profile
    ? profileInitial(profile.displayName, profile.email)
    : "?";

  return (
    <div className="space-y-8">
      <SectionHeader title="Profile">
        Update your name and email.
      </SectionHeader>
      {isLoading ? (
        <MemberProfileSkeleton />
      ) : error ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Error"}
        </p>
      ) : !profile ? null : (
        <Card className={`max-w-lg ${dashboardCardClass}`}>
          <CardHeader className="flex flex-row items-start gap-4">
            <div
              className="bg-primary/15 text-primary flex size-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold"
              aria-hidden
            >
              {initial}
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle className={dashboardCardTitleClass}>Your details</CardTitle>
              <CardDescription>
                Photo uploads are not enabled yet — your initial is shown instead.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <Button
              type="button"
              disabled={save.isPending || !email.trim()}
              onClick={() => save.mutate()}
            >
              {save.isPending ? "Saving…" : "Save changes"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
