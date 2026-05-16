"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={async () => {
        await authClient.signOut();
        toast.success("Signed out successfully.");
        router.push("/login");
        router.refresh();
      }}
    >
      Sign out
    </Button>
  );
}
