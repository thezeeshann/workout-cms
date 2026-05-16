import { NextResponse } from "next/server";
import { resolveSessionProfile } from "@/lib/api/auth-context";

/** Public for Server Components: null user/profile when logged out (200). */
export async function GET() {
  const { user, profile } = await resolveSessionProfile();
  return NextResponse.json({
    user: user ? { id: user.id, email: user.email } : null,
    profile,
  });
}
