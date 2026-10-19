import { statuses, type Group } from "../types/dashboard";

export function journeyStations(groups: Group[]) {
  return statuses.map((label) => ({
    label,
    count: groups.find((g) => g.label === label)?.count ?? null,
  }));
}

export function cohortShare(
  count: number | null,
  total: number,
): number | null {
  return count === null || total <= 0 ? null : (count / total) * 100;
}
