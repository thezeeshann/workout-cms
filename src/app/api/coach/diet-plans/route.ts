import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { coachClients, dietPlans } from "@/db/schema";

const dietPlanBody = z.object({
  clientUserId: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().min(1),
  validFrom: z.string().datetime().optional().nullable(),
  validUntil: z.string().datetime().optional().nullable(),
});

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

export async function POST(request: Request) {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["coach"]);
  if (forbidden) return forbidden;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
  const parsed = dietPlanBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid diet plan payload" } },
      { status: 400 }
    );
  }
  const allowed = await coachHasClient(auth.profile.id, parsed.data.clientUserId);
  if (!allowed) {
    return NextResponse.json(
      { error: { code: "forbidden", message: "Client not assigned to you" } },
      { status: 403 }
    );
  }
  const [created] = await db
    .insert(dietPlans)
    .values({
      clientUserId: parsed.data.clientUserId,
      coachUserId: auth.profile.id,
      title: parsed.data.title,
      content: parsed.data.content,
      validFrom: parsed.data.validFrom ? new Date(parsed.data.validFrom) : null,
      validUntil: parsed.data.validUntil
        ? new Date(parsed.data.validUntil)
        : null,
    })
    .returning();
  return NextResponse.json({ dietPlan: created }, { status: 201 });
}
