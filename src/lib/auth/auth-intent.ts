export const AUTH_INTENT_KEY = "workout-cms-auth-intent";

export type AuthIntent = "signin" | "signup";

export function setAuthIntent(intent: AuthIntent) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_INTENT_KEY, intent);
}

export function consumeAuthIntent(): AuthIntent | null {
  if (typeof window === "undefined") return null;
  const value = sessionStorage.getItem(AUTH_INTENT_KEY);
  if (value !== "signin" && value !== "signup") return null;
  sessionStorage.removeItem(AUTH_INTENT_KEY);
  return value;
}
