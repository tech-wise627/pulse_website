const IST_SHORT = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

export function formatISTCompact(value: string | number | Date): string {
  return IST_SHORT.format(new Date(value));
}

export function formatIST(iso: string | null | undefined): string {
  if (!iso) return "—";
  return `${formatISTCompact(iso)} IST`;
}
