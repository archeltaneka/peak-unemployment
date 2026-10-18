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

/** Furthest populated current status on the typical route; not historical progress. */
export function furthestJourneyStage(groups: Group[]): number {
  return journeyStations(groups)
    .slice(0, 8)
    .reduce(
      (furthest, station, index) =>
        (station.count ?? 0) > 0 ? index : furthest,
      -1,
    );
}
