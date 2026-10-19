export const statusColors: Record<string, string> = {
  Discovered: "#818b98",
  Preparing: "#7886aa",
  Applied: "#4b8d86",
  "Recruiter Screen": "#367e91",
  Interview: "#5268a0",
  Technical: "#7c63a2",
  Final: "#a06a91",
  Offer: "#28764e",
  Rejected: "#b36656",
  Unknown: "#91978d",
};
export const number = (n: number) => n.toLocaleString("en");
export function reportingTime(timestamp: string, timezone: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "short",
  }).format(new Date(timestamp));
}
export function shortDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "T12:00:00Z"));
}

/** Describe the applied response cohort, never a pending selection. */
export function cohortSummary(
  filters: import("../types/dashboard").DashboardFilters,
): string {
  return [
    filters.country || "All countries",
    filters.roleType || "all roles",
    filters.status || "all statuses",
    filters.source ? `source: ${filters.source}` : "",
    filters.tier ? `tier: ${filters.tier}` : "",
    filters.dateBasis === "found" ? "Date Found" : "Date Applied",
    filters.from ? `from ${filters.from}` : "",
    filters.to ? `through ${filters.to}` : "",
    !filters.from && !filters.to ? "all dates" : "",
  ]
    .filter(Boolean)
    .join(" · ");
}
