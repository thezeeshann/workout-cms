import type { Metadata } from "next";
import { MemberNav } from "@/components/layout/member-nav";
import { PortalRoleHint } from "@/components/layout/portal-role-hint";
import { requireRole } from "@/lib/auth/require-user";

export const metadata: Metadata = {
  title: "Member",
};

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("client");
  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <div className="space-y-2">
        <MemberNav />
        <PortalRoleHint role="client" />
      </div>
      {children}
    </div>
  );
}
