import type { ExplorerRecord } from "../types/dashboard";
export type SortKey =
  "company" | "role" | "country" | "source" | "tier" | "status" | "applied";
export function filterExplorer(
  rows: ExplorerRecord[],
  filters: { search: string; country: string; status: string },
  sort: SortKey,
  descending: boolean,
): ExplorerRecord[] {
  return rows
    .filter(
      (r) =>
        (!filters.country || r.country === filters.country) &&
        (!filters.status || r.status === filters.status) &&
        [r.company, r.role, r.country, r.source].some((v) =>
          v.toLowerCase().includes(filters.search.trim().toLowerCase()),
        ),
    )
    .sort((a, b) => {
      if (a[sort] === null) return b[sort] === null ? 0 : 1;
      if (b[sort] === null) return -1;
      return (
        String(a[sort]).localeCompare(String(b[sort])) * (descending ? -1 : 1)
      );
    });
}
