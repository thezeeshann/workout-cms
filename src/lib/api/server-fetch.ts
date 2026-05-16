import { headers } from "next/headers";

/**
 * Server Components -> internal API. Forwards auth cookies.
 */
export async function serverFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const base = `${proto}://${host}`;
  const cookie = h.get("cookie") ?? "";
  const merged = new Headers(init?.headers);
  if (cookie) merged.set("cookie", cookie);
  return fetch(`${base}${path}`, {
    ...init,
    cache: "no-store",
    headers: merged,
  });
}
