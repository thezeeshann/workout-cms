import type { ReactNode } from "react";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  DashboardNav,
  type DashboardNavItem,
} from "@/components/layout/dashboard-nav";

type DashboardShellProps = {
  roleLabel: string;
  title: string;
  items: DashboardNavItem[];
  children: ReactNode;
};

export function DashboardShell({
  roleLabel,
  title,
  items,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-dvh">
      <aside className="border-border bg-card/40 flex w-56 shrink-0 flex-col border-r">
        <div className="border-border border-b px-4 py-5">
          <p className="font-heading text-muted-foreground text-[0.65rem] font-bold tracking-[0.2em] uppercase">
            {roleLabel}
          </p>
          <p className="font-heading mt-1 text-lg font-bold tracking-tight">
            {title}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-6 px-3 py-4">
          <DashboardNav items={items} />
        </div>
        <div className="border-border border-t p-4">
          <LogoutButton className="w-full" />
        </div>
      </aside>
      <main className="bg-background min-w-0 flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
