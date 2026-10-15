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
export function shortDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "T12:00:00Z"));
}
