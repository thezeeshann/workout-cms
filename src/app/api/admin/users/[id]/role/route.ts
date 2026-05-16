import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { profiles } from "@/db/schema";

const roleBodySchema = z.object({
  role: z.enum(["admin", "coach", "client"]),
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
      { error: { code: "validation", message: "Invalid user id" } },
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
  const parsed = roleBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid role" } },
      { status: 400 }
    );
  }

  await db
    .update(profiles)
    .set({ role: parsed.data.role, updatedAt: new Date() })
    .where(eq(profiles.id, parsedId.data));
  return NextResponse.json({ ok: true });
}
