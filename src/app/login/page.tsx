"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const authError = searchParams.get("error");
  const [loading, setLoading] = useState(false);

  const callbackURL =
    next && next.startsWith("/")
      ? next
      : typeof window !== "undefined"
        ? `${window.location.origin}/`
        : "/";

  async function onGoogle() {
    setLoading(true);
    setAuthIntent("signin");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
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
          <CardTitle className="text-2xl sm:text-[1.75rem]">Sign in</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Continue with Google. Use the same account you registered with.
          </CardDescription>
          {authError ? (
            <p className="text-destructive text-sm">
              Sign-in could not be completed ({authError}). Try again.
            </p>
          ) : null}
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
            New here?{" "}
            <Link href="/register" className="text-primary underline">
              Create account
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthPageShell>
  );
}
