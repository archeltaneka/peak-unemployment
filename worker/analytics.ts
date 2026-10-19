import {
  statuses,
  type ActivityPoint,
  type DashboardData,
  type DashboardFilters,
  type Group,
} from "../src/types/dashboard";
import { addDays, dayDifference, monthEnd, weekStart } from "./dates";
import { matchesDates, matchesDimensions } from "./filters";
import {
  activeStatuses,
  countries,
  taxonomies,
  type NormalizedRecord,
} from "./schemas";
const group = (labels: string[]): Group[] => {
  const counts = new Map<string, number>();
  labels.forEach((l) => counts.set(l, (counts.get(l) ?? 0) + 1));
  return [...counts]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
};
function activity(
  rows: NormalizedRecord[],
  history: NormalizedRecord[],
  f: DashboardFilters,
  today: string,
): DashboardData["activity"] {
  const dates = rows.map((r) => r.applied!).sort();
  let start = f.dateBasis === "applied" ? (f.from ?? dates[0]) : dates[0];
  const requestedEnd = f.dateBasis === "applied" ? (f.to ?? today) : today;
  const end = requestedEnd > today ? today : requestedEnd;
  if (!start || start > end || !dates.length)
    return {
      daily: [],
      weekly: [],
      monthly: [],
      start: null,
      end: null,
      truncated: false,
    };
  const truncated = dayDifference(start, end) > 3660;
  if (truncated) start = addDays(end, -3660);
  const counts = new Map(group(dates).map((g) => [g.label, g.count]));
  // Ignore applied-date bounds only for the trailing mean; keep all other cohort filters.
  const historyCounts = new Map(
    group(history.map((r) => r.applied!)).map((g) => [g.label, g.count]),
  );
  const firstObserved = history.map((r) => r.applied!).sort()[0];
  const daily: ActivityPoint[] = [];
  let cumulative = 0;
  for (let date = start; date <= end; date = addDays(date, 1)) {
    const count = counts.get(date) ?? 0;
    cumulative += count;
    let sum = 0;
    for (let i = 0; i < 7; i++)
      sum += historyCounts.get(addDays(date, -i)) ?? 0;
    daily.push({
      date,
      count,
      cumulative,
      average:
        firstObserved && addDays(date, -6) >= firstObserved ? sum / 7 : null,
      partial: date === today,
    });
  }
  const bucket = (kind: "weekly" | "monthly"): ActivityPoint[] => {
    const result = new Map<string, ActivityPoint>();
    for (const p of daily) {
      const key =
        kind === "weekly" ? weekStart(p.date) : `${p.date.slice(0, 7)}-01`;
      const finish = kind === "weekly" ? addDays(key, 6) : monthEnd(key);
      const current = result.get(key) ?? {
        date: key,
        count: 0,
        cumulative: 0,
        average: null,
        partial: key < start || finish > end || finish >= today,
      };
      current.count += p.count;
      current.cumulative = p.cumulative;
      result.set(key, current);
    }
    return [...result.values()];
  };
  return {
    daily,
    weekly: bucket("weekly"),
    monthly: bucket("monthly"),
    start,
    end,
    truncated,
  };
}
export function buildDashboard(
  all: NormalizedRecord[],
  filters: DashboardFilters,
  today: string,
): DashboardData {
  const dimensions = all.filter((r) => matchesDimensions(r, filters));
  const rows = dimensions.filter((r) => matchesDates(r, filters));
  const submitted = rows.filter((r) => r.submitted);
  const currentWeekStart = weekStart(today);
  const currentMonthStart = `${today.slice(0, 7)}-01`;
  // Calendar denominators include today (in progress) and zero-submission days.
  // Cohort filters affect the numerator, never the elapsed calendar period.
  const dailyAverageSince = (start: string) =>
    submitted.filter((r) => r.applied! >= start && r.applied! <= today).length /
    (dayDifference(start, today) + 1);
  const active = submitted.filter((r) => activeStatuses.includes(r.status));
  const history = (filters.dateBasis === "applied" ? dimensions : rows).filter(
    (r) => r.submitted,
  );
  const options = Object.fromEntries(
    Object.entries(taxonomies).map(([key, values]) => [key, values]),
  ) as DashboardData["options"];
  return {
    filters,
    options,
    kpis: {
      opportunities: rows.length,
      submitted: submitted.length,
      active: active.length,
      interviews: active.filter((r) => r.status !== "Applied").length,
      offers: submitted.filter((r) => r.status === "Offer").length,
      rejections: submitted.filter((r) => r.status === "Rejected").length,
      submittedToday: submitted.filter((r) => r.applied === today).length,
      weeklyDailyAverage: dailyAverageSince(currentWeekStart),
      monthlyDailyAverage: dailyAverageSince(currentMonthStart),
    },
    activity: activity(submitted, history, filters, today),
    pipeline: statuses.map((label) => ({
      label,
      count: rows.filter((r) => r.status === label).length,
    })),
    geography: group(submitted.map((r) => r.country)).map((g) => ({
      ...g,
      iso: countries[g.label]?.iso ?? null,
      lat: countries[g.label]?.lat ?? null,
      lon: countries[g.label]?.lon ?? null,
    })),
    roles: group(submitted.map((r) => r.roleType)),
    sources: group(submitted.map((r) => r.source)),
    tiers: group(submitted.map((r) => r.tier)),
    followups: {
      due: active.filter((r) => r.followup === today).length,
      overdue: active.filter((r) => r.followup && r.followup < today).length,
      upcoming: active.filter((r) => r.followup && r.followup > today).length,
    },
    quality: {
      records: rows.filter((r) => r.issues.length).length,
      issues: group(rows.flatMap((r) => r.issues)),
      missingFilterDates:
        filters.from || filters.to
          ? dimensions.filter((r) => !r[filters.dateBasis]).length
          : 0,
    },
  };
}
