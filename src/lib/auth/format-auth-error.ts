export function formatAuthError(err: unknown): string {
  if (!(err instanceof Error)) {
    return "Something went wrong.";
  }
  const m = err.message;
  if (
    m === "Failed to fetch" ||
    m === "Load failed" ||
    m.includes("NetworkError") ||
    m.includes("Network request failed")
  ) {
    return "Could not reach the authentication server. Check `BETTER_AUTH_URL`, confirm your app is running, and verify your Google and email provider settings.";
  }
  return m;
}
