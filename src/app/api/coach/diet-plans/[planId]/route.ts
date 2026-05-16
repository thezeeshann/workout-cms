import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { coachClients, dietPlans } from "@/db/schema";

const dietPlanPatch = z
  .object({
    clientUserId: z.string().uuid().optional(),
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    validFrom: z.string().datetime().optional().nullable(),
    validUntil: z.string().datetime().optional().nullable(),
  })
  .strict();

type Params = { params: Promise<{ planId: string }> };

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

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["coach"]);
  if (forbidden) return forbidden;

  const { planId } = await params;
  const parsedId = z.string().uuid().safeParse(planId);
  if (!parsedId.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid plan id" } },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }
  const parsed = dietPlanPatch.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid patch payload" } },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select()
    .from(dietPlans)
    .where(
      and(eq(dietPlans.id, parsedId.data), eq(dietPlans.coachUserId, auth.profile.id))
    )
    .limit(1);
  if (!existing) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Diet plan not found" } },
      { status: 404 }
    );
  }
  if (parsed.data.clientUserId) {
    const allowed = await coachHasClient(
      auth.profile.id,
      parsed.data.clientUserId
    );
    if (!allowed) {
      return NextResponse.json(
        { error: { code: "forbidden", message: "Client not assigned to you" } },
        { status: 403 }
      );
    }
  }

  const [updated] = await db
    .update(dietPlans)
    .set({
      title: parsed.data.title ?? existing.title,
      content: parsed.data.content ?? existing.content,
      clientUserId: parsed.data.clientUserId ?? existing.clientUserId,
      validFrom:
        parsed.data.validFrom !== undefined
          ? parsed.data.validFrom
            ? new Date(parsed.data.validFrom)
            : null
          : existing.validFrom,
      validUntil:
        parsed.data.validUntil !== undefined
          ? parsed.data.validUntil
            ? new Date(parsed.data.validUntil)
            : null
          : existing.validUntil,
      updatedAt: new Date(),
    })
    .where(eq(dietPlans.id, parsedId.data))
    .returning();
  return NextResponse.json({ dietPlan: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["coach"]);
  if (forbidden) return forbidden;

  const { planId } = await params;
  const parsed = z.string().uuid().safeParse(planId);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid plan id" } },
      { status: 400 }
    );
  }
  await db
    .delete(dietPlans)
    .where(
      and(eq(dietPlans.id, parsed.data), eq(dietPlans.coachUserId, auth.profile.id))
    );
  return NextResponse.json({ ok: true });
}
