import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { coachClients, profiles } from "@/db/schema";

const assignCoachSchema = z.object({
  coachUserId: z.string().uuid(),
});

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
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
  const parsed = assignCoachSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid payload" } },
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
  const [coach] = await db
    .select()
    .from(profiles)
    .where(
      and(eq(profiles.id, parsed.data.coachUserId), eq(profiles.role, "coach"))
    )
    .limit(1);
  if (!coach) {
    return NextResponse.json(
      { error: { code: "not_found", message: "Coach not found" } },
      { status: 404 }
    );
  }
  await db
    .insert(coachClients)
    .values({ coachUserId: parsed.data.coachUserId, clientUserId: parsedId.data })
    .onConflictDoNothing({
      target: [coachClients.coachUserId, coachClients.clientUserId],
    });
  return NextResponse.json({ ok: true }, { status: 201 });
}
