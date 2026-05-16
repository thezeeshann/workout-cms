import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { AppRole } from "@/lib/auth/dashboard-path";
import { auth } from "@/lib/auth";
import { ensureProfile } from "@/lib/profile/ensure";
import type { ProfileRow } from "@/types/profile";

export type SessionUserRef = {
  id: string;
  email: string;
};

/** For /api/session/context — allows anonymous (null user/profile). */
export async function resolveSessionProfile(): Promise<{
  user: SessionUserRef | null;
  profile: ProfileRow | null;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return { user: null, profile: null };
  }
  const u = session.user;
  const userRef: SessionUserRef = {
    id: u.id,
    email: u.email,
  };
  const profile = await ensureProfile({
    id: u.id,
    email: u.email,
    name: u.name,
  });
  return { user: userRef, profile: profile ?? null };
}

/** For protected API routes — returns 401/500 Response or authenticated context. */
export async function requireAuthProfile(): Promise<
  | { ok: true; user: SessionUserRef; profile: ProfileRow }
  | { ok: false; response: NextResponse }
> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: { code: "unauthorized", message: "Unauthorized" } },
        { status: 401 }
      ),
    };
  }
  const u = session.user;
  const profile = await ensureProfile({
    id: u.id,
    email: u.email,
    name: u.name,
  });
  if (!profile) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: { code: "profile_error", message: "Could not load profile" },
        },
        { status: 500 }
      ),
    };
  }
  return {
    ok: true,
    user: { id: u.id, email: u.email },
    profile,
  };
}

export function assertRoles(
  profile: ProfileRow,
  allowed: AppRole[]
): NextResponse | null {
  if (!allowed.includes(profile.role)) {
    return NextResponse.json(
      { error: { code: "forbidden", message: "Forbidden" } },
      { status: 403 }
    );
  }
  return null;
}
