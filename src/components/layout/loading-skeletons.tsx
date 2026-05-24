import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardCardClass, dashboardGridClass } from "@/lib/ui/dashboard";

function StatCardSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <Card className={dashboardCardClass}>
      <CardHeader className="gap-3">
        <Skeleton className="h-5 w-28" />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 ${i === 0 ? "w-full max-w-md" : "w-2/3 max-w-xs"}`}
          />
        ))}
      </CardHeader>
    </Card>
  );
}

export function SectionHeaderSkeleton() {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </header>
  );
}

export function MemberHomeCardsSkeleton() {
  return (
    <div className={dashboardGridClass}>
      <StatCardSkeleton />
      <StatCardSkeleton />
      <Card className={`sm:col-span-2 ${dashboardCardClass} min-h-[192px]`}>
        <CardHeader className="gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-56" />
        </CardContent>
      </Card>
    </div>
  );
}

export function MemberCardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={dashboardGridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} lines={3} />
      ))}
    </div>
  );
}

export function MemberProgramSkeleton() {
  return (
    <Card className={`${dashboardCardClass} min-h-[220px]`}>
      <CardHeader className="gap-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-3/4 max-w-sm" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-10 w-36 rounded-md" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function MemberHistoryTableSkeleton() {
  return (
    <div className="min-h-[220px] overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex gap-8">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-8 px-4 py-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemberProfileSkeleton() {
  return (
    <Card className={`${dashboardCardClass} max-w-lg`}>
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="size-14 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </CardContent>
    </Card>
  );
}

export function CoachClientsGridSkeleton() {
  return <MemberCardGridSkeleton count={4} />;
}

export function AdminClientsTableSkeleton() {
  return (
    <div className="min-h-[280px] overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="ml-auto h-4 w-20" />
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6 px-4 py-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="ml-auto h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FormCardSkeleton() {
  return (
    <Card className={`${dashboardCardClass} min-h-[320px]`}>
      <CardHeader className="gap-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full max-w-sm" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </CardContent>
    </Card>
  );
}

export function AdminClientDetailSkeleton() {
  return (
    <div className="space-y-8">
      <SectionHeaderSkeleton />
      <Skeleton className="h-8 w-24 rounded-md" />
      <div className="grid gap-6 lg:grid-cols-2">
        <FormCardSkeleton />
        <FormCardSkeleton />
      </div>
      <Card className={`${dashboardCardClass} min-h-[180px]`}>
        <CardHeader className="gap-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-full max-w-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full max-w-xs rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}

export function CoachClientDetailSkeleton() {
  return (
    <div className="space-y-8">
      <SectionHeaderSkeleton />
      <Skeleton className="h-8 w-16 rounded-md" />
      <FormCardSkeleton />
      <Card className={`${dashboardCardClass} min-h-[220px]`}>
        <CardHeader className="gap-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <MemberHistoryTableSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminPageLoading({
  variant = "clients",
}: {
  variant?: "clients" | "client-detail";
}) {
  return (
    <div className="space-y-8">
      {variant === "clients" ? (
        <>
          <SectionHeaderSkeleton />
          <AdminClientsTableSkeleton />
        </>
      ) : (
        <AdminClientDetailSkeleton />
      )}
    </div>
  );
}

export function CoachClientDetailLoading() {
  return <CoachClientDetailSkeleton />;
}

export function MemberPageLoading({
  variant = "home",
}: {
  variant?: "home" | "grid" | "program" | "history" | "profile";
}) {
  return (
    <div className="space-y-8">
      <SectionHeaderSkeleton />
      {variant === "home" ? <MemberHomeCardsSkeleton /> : null}
      {variant === "grid" ? <MemberCardGridSkeleton /> : null}
      {variant === "program" ? <MemberProgramSkeleton /> : null}
      {variant === "history" ? <MemberHistoryTableSkeleton /> : null}
      {variant === "profile" ? <MemberProfileSkeleton /> : null}
    </div>
  );
}
