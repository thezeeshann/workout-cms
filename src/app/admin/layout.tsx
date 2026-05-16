import type { Metadata } from "next";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");

  return (
    <DashboardShell
      roleLabel="Admin"
      title="Dashboard"
      items={[{ href: "/admin/clients", label: "Clients", icon: "users" }]}
    >
      {children}
    </DashboardShell>
  );
}
