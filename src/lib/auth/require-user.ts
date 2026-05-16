import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/api/server-fetch";
import {
  dashboardPathForRole,
  type AppRole,
} from "@/lib/auth/dashboard-path";
import type { ProfileRow } from "@/types/profile";

type SessionContextBody = {
  user: { id: string; email?: string | null } | null;
  profile: ProfileRow | null;
};

export async function requireRole(role: AppRole): Promise<{
  user: NonNullable<SessionContextBody["user"]>;
  profile: ProfileRow;
}> {
  const res = await serverFetch("/api/session/context");
  if (!res.ok) {
    redirect("/login");
  }
  const data = (await res.json()) as SessionContextBody;
  if (!data.user || !data.profile) {
    redirect("/login");
  }
  if (data.profile.role !== role) {
    redirect(dashboardPathForRole(data.profile.role));
  }
  return { user: data.user, profile: data.profile };
}
