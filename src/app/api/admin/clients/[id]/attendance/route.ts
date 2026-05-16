import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { attendance, profiles } from "@/db/schema";

const attendanceSchema = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
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
  const parsed = attendanceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid attendance payload" } },
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

  const day = new Date(`${parsed.data.day}T12:00:00.000Z`);
  await db
    .insert(attendance)
    .values({ clientUserId: parsedId.data, day })
    .onConflictDoNothing({
      target: [attendance.clientUserId, attendance.day],
    });
  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(request: Request, { params }: Params) {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["admin"]);
  if (forbidden) return forbidden;

  const { id } = await params;
  const parsedId = z.string().uuid().safeParse(id);
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day");
  const parsedDay = attendanceSchema.shape.day.safeParse(day);
  if (!parsedId.success || !parsedDay.success) {
    return NextResponse.json(
      { error: { code: "validation", message: "Invalid id or day" } },
      { status: 400 }
    );
  }
  const d = new Date(`${parsedDay.data}T12:00:00.000Z`);
  await db
    .delete(attendance)
    .where(
      and(
        eq(attendance.clientUserId, parsedId.data),
        eq(attendance.day, d)
      )
    );
  return NextResponse.json({ ok: true });
}
