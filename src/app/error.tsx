"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-4 px-4 py-16">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
