import type { DashboardFilters } from "../types/dashboard";

// Mirror the public date contract without importing private Worker code.
export function dateRangeError({
  from,
  to,
}: Pick<DashboardFilters, "from" | "to">): string {
  for (const [label, value] of [
    ["From", from],
    ["To", to],
  ] as const) {
    if (!value) continue;
    const time = Date.parse(`${value}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      value < "2000-01-01" ||
      value > "2100-12-31" ||
      !Number.isFinite(time) ||
      new Date(time).toISOString().slice(0, 10) !== value
    ) {
      return `${label} must be a valid date between 2000-01-01 and 2100-12-31.`;
    }
  }
  if (from && to) {
    if (from > to)
      return "From must be on or before To. Adjust either date to continue.";
    if (
      (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) /
        86_400_000 >
      3660
    )
      return "Choose a date range of 3,660 days or less.";
  }
  return "";
}
