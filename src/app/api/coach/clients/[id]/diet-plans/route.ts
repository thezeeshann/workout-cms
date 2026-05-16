import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { coachClients, dietPlans } from "@/db/schema";

type Params = { params: Promise<{ id: string }> };

async function coachHasClient(coachId: string, clientId: string) {
  const [row] = await db
    .select({ id: coachClients.id })
    .from(coachClients)
    .where(
      and(
        eq(coachClients.coachUserId, coachId),
        eq(coachClients.clientUserId, clientId)
      )
    )
    .limit(1);
  return Boolean(row);
}

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["coach"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  const parsed = z.string().uuid().safeParse(id);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid client id" } },
      { status: 400 }
    );
  }
  const allowed = await coachHasClient(auth.profile.id, parsed.data);
  if (!allowed) {
    return NextResponse.json(
      { error: { code: "forbidden", message: "Client not assigned to you" } },
      { status: 403 }
    );
  }
  const plans = await db
    .select()
    .from(dietPlans)
    .where(eq(dietPlans.clientUserId, parsed.data))
    .orderBy(desc(dietPlans.createdAt));
  return NextResponse.json({ dietPlans: plans });
}
