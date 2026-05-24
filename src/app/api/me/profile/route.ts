import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { assertRoles, requireAuthProfile } from "@/lib/api/auth-context";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { profiles } from "@/db/schema";
import { updateProfileBodySchema } from "@/lib/schemas/profile";

export async function PATCH(request: Request) {
  const auth = await requireAuthProfile();
  if (!auth.ok) return auth.response;
  const forbidden = assertRoles(auth.profile, ["client", "coach"]);
  if (forbidden) return forbidden;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "invalid_json", message: "Invalid JSON body" } },
      { status: 400 }
    );
  }

  const parsed = updateProfileBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Invalid profile data",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 }
    );
  }

  const { displayName, email } = parsed.data;
  if (displayName === undefined && email === undefined) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Provide displayName and/or email to update",
        },
      },
      { status: 400 }
    );
  }

  const profile = auth.profile;
  const nextDisplayName =
    displayName !== undefined ? displayName : profile.displayName;
  const nextEmail = email !== undefined ? email : profile.email;

  if (email !== undefined && email !== profile.email) {
    const [existing] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);
    if (existing && existing.id !== profile.id) {
      return NextResponse.json(
        { error: { code: "conflict", message: "Email is already in use" } },
        { status: 409 }
      );
    }
  }

  const [updated] = await db
    .update(profiles)
    .set({
      displayName: nextDisplayName,
      email: nextEmail,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, profile.id))
    .returning();

  await db
    .update(user)
    .set({
      name: nextDisplayName ?? nextEmail,
      email: nextEmail,
      updatedAt: new Date(),
    })
    .where(eq(user.id, profile.id));

  return NextResponse.json({ profile: updated });
}
