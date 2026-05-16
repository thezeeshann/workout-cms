import type { Metadata } from "next";
import { MemberNav } from "@/components/layout/member-nav";
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
    <div className="mx-auto flex min-h-full max-w-4xl flex-col gap-8 px-4 py-8">
      <MemberNav />
      {children}
    </div>
  );
}
