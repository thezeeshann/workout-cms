"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { setAuthIntent } from "@/lib/auth/auth-intent";
import { formatAuthError } from "@/lib/auth/format-auth-error";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const callbackURL =
    typeof window !== "undefined" ? `${window.location.origin}/` : "/";

  async function onGoogle() {
    setLoading(true);
    setAuthIntent("signup");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
        newUserCallbackURL: callbackURL,
      });
    } catch (err) {
      toast.error(formatAuthError(err));
      setLoading(false);
    }
  }

  return (
    <AuthPageShell>
      <Card className="border-border/80 shadow-sm">
        <CardHeader className="gap-3 px-6 pt-8 sm:px-10 sm:pt-10">
          <CardTitle className="text-2xl sm:text-[1.75rem]">
            Create account
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Sign up with Google. Your member profile is created on first sign-in.
            Admins can be assigned via{" "}
            <code className="text-foreground/90 rounded bg-muted px-1.5 py-0.5 text-xs">
              INITIAL_ADMIN_EMAIL
            </code>{" "}
            or role updates in the admin console.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-8 pt-2 sm:px-10 sm:pb-10">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full"
            size="lg"
            disabled={loading}
            onClick={() => void onGoogle()}
          >
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthPageShell>
  );
}
