import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { profiles, subscriptions } from "@/db/schema";
import { subscriptionStatusSchema } from "@/lib/schemas/common";

const subscriptionPatchSchema = z.object({
  status: subscriptionStatusSchema,
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["admin"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid client id" } },
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
  const parsed = subscriptionPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid subscription payload" } },
      { status: 400 }
    );
  }

  const [client] = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.id, parsedId.data), eq(profiles.role, "client")))
    .limit(1);
  if (!client) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Client not found" } },
      { status: 404 }
    );
  }

  const [latest] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.clientUserId, parsedId.data))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);

  const startsAt = parsed.data.startsAt ? new Date(parsed.data.startsAt) : null;
  const endsAt = parsed.data.endsAt ? new Date(parsed.data.endsAt) : null;

  if (latest) {
    await db
      .update(subscriptions)
      .set({
        status: parsed.data.status,
        startsAt,
        endsAt,
        notes: parsed.data.notes ?? null,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, latest.id));
  } else {
    await db.insert(subscriptions).values({
      clientUserId: parsedId.data,
      status: parsed.data.status,
      startsAt,
      endsAt,
      notes: parsed.data.notes ?? null,
    });
  }
  return NextResponse.json({ ok: true });
}
