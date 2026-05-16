import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "Coach",
};

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("coach");

  return (
    <DashboardShell
      roleLabel="Coach"
      title="Dashboard"
      items={[{ href: "/coach/clients", label: "Clients", icon: "users" }]}
    >
      {children}
    </DashboardShell>
  );
}
