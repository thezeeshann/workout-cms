import type { AppRole } from "@/lib/auth/dashboard-path";

const ROLE_LABELS: Record<Extract<AppRole, "client" | "coach">, string> = {
  client: "Client",
  coach: "Coach",
};

export function PortalRoleHint({
  role,
}: {
  role: Extract<AppRole, "client" | "coach">;
}) {
  return (
    <p className="text-xs text-muted-foreground" aria-label={`Role: ${ROLE_LABELS[role]}`}>
      {ROLE_LABELS[role]}
    </p>
  );
}
