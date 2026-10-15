import type { DashboardFilters } from "../src/types/dashboard";
import { dayDifference, parseDate } from "./dates";
import { taxonomies, type NormalizedRecord } from "./schemas";
export class InvalidFilters extends Error {}
export function parseFilters(params: URLSearchParams): DashboardFilters {
  const filters: DashboardFilters = { dateBasis: "applied" };
  const allowed = ["from", "to", "dateBasis", ...Object.keys(taxonomies)];
  for (const [key, value] of params) {
    if (!allowed.includes(key) || params.getAll(key).length !== 1)
      throw new InvalidFilters();
    if (!value) continue;
    if (key === "dateBasis") {
      if (value !== "applied" && value !== "found") throw new InvalidFilters();
      filters.dateBasis = value;
    } else if (key === "from" || key === "to") {
      const parsed = parseDate(value);
      if (!parsed) throw new InvalidFilters();
      filters[key] = parsed;
    } else {
      const dimension = key as keyof typeof taxonomies;
      if (!(taxonomies[dimension] as readonly string[]).includes(value))
        throw new InvalidFilters();
      filters[dimension] = value;
    }
  }
  if (
    filters.from &&
    filters.to &&
    (filters.from > filters.to ||
      dayDifference(filters.from, filters.to) > 3660)
  )
    throw new InvalidFilters();
  return filters;
}
export function matchesDimensions(
  r: NormalizedRecord,
  f: DashboardFilters,
): boolean {
  return (Object.keys(taxonomies) as (keyof typeof taxonomies)[]).every(
    (key) => !f[key] || r[key] === f[key],
  );
}
export function matchesDates(
  r: NormalizedRecord,
  f: DashboardFilters,
): boolean {
  if (!f.from && !f.to) return true;
  const date = r[f.dateBasis];
  return !!date && (!f.from || date >= f.from) && (!f.to || date <= f.to);
}
