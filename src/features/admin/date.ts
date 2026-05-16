export function toInputDate(value: string | null | undefined): string {
  if (!value) return "";
  if (value.length >= 10) return value.slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
}
