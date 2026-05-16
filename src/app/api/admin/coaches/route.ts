import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { profiles } from "@/db/schema";

export async function GET() {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["admin"]);
  if (forbidden) return forbidden;

  const coaches = await db
    .select({
      id: profiles.id,
      email: profiles.email,
      displayName: profiles.displayName,
    })
    .from(profiles)
    .where(eq(profiles.role, "coach"))
    .orderBy(asc(profiles.email));
  return NextResponse.json({ coaches });
}
