import { expect, it } from "vitest";
import { buildDashboard } from "../worker/analytics";
import { normalizeRecords } from "../worker/normalize";
import { todayInTimezone } from "../worker/dates";
import type { DashboardFilters } from "../src/types/dashboard";
import type { SourceRecord } from "../worker/schemas";

const application = (
  date: string,
  overrides: SourceRecord = {},
): SourceRecord => ({
  Status: "Applied",
  Country: "Australia",
  "Date Applied": date,
  ...overrides,
});
const metrics = (
  rows: SourceRecord[],
  today = "2026-10-15",
  filters: DashboardFilters = { dateBasis: "applied" },
) => buildDashboard(normalizeRecords(rows, today), filters, today).kpis;

it("counts today's eligible submissions and averages across elapsed calendar days", () => {
  const result = metrics([
    application("2026-10-15"),
    application("2026-10-15"),
    application("2026-10-12"),
    application("2026-10-11"),
    application("2026-10-01"),
    application("2026-09-30"),
  ]);
  expect(result.submittedToday).toBe(2);
  expect(result.weeklyDailyAverage).toBe(3 / 4);
  expect(result.monthlyDailyAverage).toBe(5 / 15);
});

it("does not count missing, invalid, future or conflicting submission dates", () => {
  const result = metrics([
    application(""),
    application("15/10/2026"),
    application("2026-10-16"),
    application("2026-10-15", { Status: "Preparing" }),
    application("2026-10-15", { "Date Found": "2026-10-16" }),
    application("2026-10-15", { Status: "Unknown" }),
    application("2026-10-15", { Status: "Rejected" }),
  ]);
  expect(result.submittedToday).toBe(2);
  expect(result.weeklyDailyAverage).toBe(2 / 4);
  expect(result.monthlyDailyAverage).toBe(2 / 15);
});

it("uses the selected cohort without shortening calendar denominators", () => {
  const rows = [
    application("2026-10-15"),
    application("2026-10-15", { Country: "Canada" }),
    application("2026-10-12"),
  ];
  const result = metrics(rows, "2026-10-15", {
    dateBasis: "applied",
    country: "Australia",
    from: "2026-10-15",
    to: "2026-10-15",
  });
  expect(result.submittedToday).toBe(1);
  expect(result.weeklyDailyAverage).toBe(1 / 4);
  expect(result.monthlyDailyAverage).toBe(1 / 15);
  const historical = metrics(rows, "2026-10-15", {
    dateBasis: "applied",
    to: "2026-10-11",
  });
  expect(historical.submittedToday).toBe(0);
  expect(historical.weeklyDailyAverage).toBe(0);
  expect(historical.monthlyDailyAverage).toBe(0);
});

it("uses applied dates for pace within a found-date cohort", () => {
  const result = metrics(
    [application("2026-10-15", { "Date Found": "2026-09-01" })],
    "2026-10-15",
    { dateBasis: "found", from: "2026-09-01", to: "2026-09-01" },
  );
  expect(result.submittedToday).toBe(1);
  expect(result.weeklyDailyAverage).toBe(1 / 4);
  expect(result.monthlyDailyAverage).toBe(1 / 15);
});

it("starts weeks on Monday, includes Sunday and crosses month/year boundaries", () => {
  const sunday = metrics(
    [application("2026-10-12"), application("2026-10-18")],
    "2026-10-18",
  );
  expect(sunday.weeklyDailyAverage).toBe(2 / 7);
  const monday = metrics(
    [application("2026-10-18"), application("2026-10-19")],
    "2026-10-19",
  );
  expect(monday.weeklyDailyAverage).toBe(1);
  const newYear = metrics(
    [application("2025-12-29"), application("2026-01-01")],
    "2026-01-01",
  );
  expect(newYear.weeklyDailyAverage).toBe(2 / 4);
  expect(newYear.monthlyDailyAverage).toBe(1);
});

it("uses reporting-zone today and counts leap-month calendar days", () => {
  const today = todayInTimezone(
    new Date("2026-10-18T13:30:00Z"),
    "Australia/Melbourne",
  );
  const result = metrics([application("2026-10-19")], today);
  expect(result.submittedToday).toBe(1);
  expect(result.weeklyDailyAverage).toBe(1);
  expect(
    metrics([application("2024-02-29")], "2024-02-29").monthlyDailyAverage,
  ).toBe(1 / 29);
});

it("returns zero recorded submissions for an empty cohort", () => {
  const result = metrics([]);
  expect(result.submittedToday).toBe(0);
  expect(result.weeklyDailyAverage).toBe(0);
  expect(result.monthlyDailyAverage).toBe(0);
});
