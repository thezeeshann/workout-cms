"use client";

import { useQuery } from "@tanstack/react-query";
import { apiJson } from "@/lib/api/client";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type MeResponse = {
  profile: {
    displayName: string | null;
    email: string;
  };
  subscription: {
    status: string;
    endsAt: string | null;
  } | null;
  presentDays: number;
  checkedInToday: boolean;
};

export default function MemberHomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiJson<MeResponse>("/me"),
  });

  return (
    <div className="space-y-8">
      <SectionHeader title="Member home">
        Attendance and subscription snapshot.
      </SectionHeader>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : error ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Error"}
        </p>
      ) : !data ? null : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Today</CardTitle>
              <CardDescription>
                {data.checkedInToday
                  ? "You are checked in for today."
                  : "No check-in recorded for today (ask staff to mark attendance)."}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Present days</CardTitle>
              <CardDescription>
                Total days marked present:{" "}
                <span className="font-medium text-foreground">
                  {data.presentDays}
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="sm:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Subscription</CardTitle>
              <CardDescription>
                {data.subscription ? (
                  <span className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{data.subscription.status}</Badge>
                    {data.subscription.endsAt ? (
                      <span>
                        Ends{" "}
                        {new Date(
                          data.subscription.endsAt
                        ).toLocaleDateString()}
                      </span>
                    ) : (
                      <span>No end date set.</span>
                    )}
                  </span>
                ) : (
                  "No subscription on file yet."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Signed in as {data.profile.displayName ?? data.profile.email}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
