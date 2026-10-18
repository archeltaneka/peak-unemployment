import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { Pipeline } from "../src/charts/Pipeline";
import { buildDashboard } from "../worker/analytics";
import { normalizeRecords } from "../worker/normalize";
import { parseFilters } from "../worker/filters";
import {
  cohortShare,
  journeyStations,
  furthestJourneyStage,
} from "../src/lib/journey";
import type { SourceRecord } from "../worker/schemas";
const today = "2026-10-15";
const rows: SourceRecord[] = [
  {
    Company: "A",
    Status: "Applied",
    Country: "Australia",
    "Date Applied": "2026-10-01",
  },
  {
    Company: "B",
    Status: "Rejected",
    Country: "Australia",
    "Date Applied": "2026-10-02",
  },
  {
    Company: "C",
    Status: "Offer",
    Country: "Canada",
    "Date Applied": "2026-10-03",
  },
  { Company: "D", Status: "Applied", Country: "Australia", "Date Applied": "" },
];
function dashboard(query = "") {
  return buildDashboard(
    normalizeRecords(rows, today),
    parseFilters(new URLSearchParams(query)),
    today,
  );
}
it("renders static checkpoints with current counts, cohort shares and a separate rejection outcome", () => {
  const data = dashboard();
  const html = renderToStaticMarkup(
    createElement(Pipeline, {
      groups: data.pipeline,
      total: data.kpis.opportunities,
    }),
  );
  expect(html).toContain("The Hiring Gauntlet");
  expect(html).toContain("AI found my dream job. The requirements found my nightmares.");
  expect(html).not.toContain("<button");
  expect(html).not.toContain('role="tooltip"');
  expect(html).not.toContain('id="gauntlet-details"');
  expect(html).toContain("Typical hiring journey");
  expect(html).toContain(
    'aria-label="Applied: 2 current records, 50% of filtered opportunities."',
  );
  expect(html).toContain(
    'aria-label="Interview: 0 current records, 0% of filtered opportunities."',
  );
  expect(html).toContain('aria-label="Separate outcomes"');
  expect(html).toContain(
    'aria-label="Rejected: 1 current record, 25% of filtered opportunities."',
  );
});
it.each([
  ["country=Australia", 3, 2, 1],
  ["status=Rejected", 1, 0, 1],
  ["from=2026-10-02&to=2026-10-03", 2, 0, 1],
  ["country=Canada", 1, 0, 0],
] as const)(
  "keeps status counts and denominators synchronized with %s",
  (query, total, applied, rejected) => {
    const data = dashboard(query);
    const stages = journeyStations(data.pipeline);
    expect(data.kpis.opportunities).toBe(total);
    expect(stages.find((s) => s.label === "Applied")?.count).toBe(applied);
    expect(stages.find((s) => s.label === "Rejected")?.count).toBe(rejected);
    expect(cohortShare(rejected, total)).toBe((rejected / total) * 100);
    expect(stages.reduce((n, s) => n + (s.count ?? 0), 0)).toBe(total);
  },
);
it("keeps conflicts in the snapshot but out of submitted metrics", () => {
  const data = dashboard("country=Australia");
  expect(data.kpis.opportunities).toBe(3);
  expect(data.kpis.submitted).toBe(2);
  expect(data.pipeline.find((s) => s.label === "Applied")?.count).toBe(2);
});
it("shows all eight zero-count checkpoints for an empty filtered cohort without invented percentages", () => {
  const data = dashboard("country=Germany");
  const html = renderToStaticMarkup(
    createElement(Pipeline, {
      groups: data.pipeline,
      total: data.kpis.opportunities,
    }),
  );
  expect(html).toContain(
    'aria-label="Offer: 0 current records, share unavailable."',
  );
  expect(html).toContain("No opportunities match these filters");
  expect(html).not.toContain("NaN");
});

it("shortens the route highlight when global filtering removes later stages", () => {
  const all = dashboard();
  const australia = dashboard("country=Australia");
  const rejected = dashboard("status=Rejected");
  expect(furthestJourneyStage(all.pipeline)).toBe(7);
  expect(furthestJourneyStage(australia.pipeline)).toBe(2);
  expect(furthestJourneyStage(rejected.pipeline)).toBe(-1);
});

it("draws only the three route segments up to Recruiter Screen", () => {
  const html = renderToStaticMarkup(
    createElement(Pipeline, {
      groups: [
        { label: "Recruiter Screen", count: 2 },
        { label: "Rejected", count: 3 },
      ],
      total: 5,
    }),
  );
  expect(html.match(/class="gauntlet-track-progress"/g)).toHaveLength(3);
  expect(html).toContain('d="M125 60H375 H625 H875"');
  expect(html).toContain('d="M5 0V3"');
});
