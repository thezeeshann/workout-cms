export type AppRole = "admin" | "coach" | "client";

export function dashboardPathForRole(role: AppRole): string {
  switch (role) {
    case "admin":
      return "/admin/clients";
    case "coach":
      return "/coach/clients";
    default:
      return "/member";
  }
}
