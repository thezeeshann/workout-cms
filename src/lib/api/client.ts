export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`/api${path}`, {
    ...init,
    credentials: "include",
    headers,
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const j: { error?: { message?: string } } = await res.json();
      message = j?.error?.message ?? message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}
