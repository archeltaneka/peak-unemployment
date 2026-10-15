import { describe, expect, it } from "vitest";
import { normalizeRecords } from "../worker/normalize";
import { buildDashboard } from "../worker/analytics";
import { parseFilters } from "../worker/filters";
import type { SourceRecord } from "../worker/schemas";
const today = "2026-10-15";
const row = (overrides: SourceRecord = {}): SourceRecord => ({
  Company: "Private",
  Role: "Analyst",
  Status: "Applied",
  Country: "Australia",
  "Role Type": "Data Analyst",
  Source: "LinkedIn",
  Tier: "1",
  "Date Found": "2026-10-01",
  "Date Applied": "2026-10-02",
  ...overrides,
});
const run = (rows: SourceRecord[], query = "") =>
  buildDashboard(
    normalizeRecords(rows, today),
    parseFilters(new URLSearchParams(query)),
    today,
  );
describe("eligibility and quality", () => {
  it("counts outcomes without inventing transitions", () => {
    expect(
      run([
        row(),
        row({ Status: "Rejected" }),
        row({ Status: "Offer" }),
        row({ Status: "Interview" }),
      ]).kpis,
    ).toEqual({
      opportunities: 4,
      submitted: 4,
      active: 2,
      interviews: 1,
      offers: 1,
      rejections: 1,
    });
  });
  it("excludes submission conflicts but retains opportunities and snapshot", () => {
    const d = run([
      row({ Status: "Preparing" }),
      row({ "Date Applied": "" }),
      row({ "Date Applied": "2026-10-16" }),
      row({ "Date Applied": "2026-09-30" }),
      row({ "Date Applied": "invalid" }),
    ]);
    expect(d.kpis.submitted).toBe(0);
    expect(d.kpis.opportunities).toBe(5);
    expect(d.quality.records).toBe(5);
    expect(d.pipeline.reduce((n, g) => n + g.count, 0)).toBe(5);
  });
  it("keeps unknown status with valid submission out of active outcomes", () => {
    const d = run([
      row({ Status: "secret label", Country: "private@example.com" }),
    ]);
    expect(d.kpis.submitted).toBe(1);
    expect(d.kpis.active).toBe(0);
    expect(d.geography[0].label).toBe("Unknown");
    expect(JSON.stringify(d)).not.toContain("private@");
  });
  it("flags duplicate-looking records and preserves counts", () => {
    const d = run([row(), row()]);
    expect(d.kpis.submitted).toBe(2);
    expect(d.quality.issues).toContainEqual({
      label: "Possible duplicate",
      count: 2,
    });
  });
  it("returns safe empty aggregates", () => {
    const d = run([]);
    expect(d.kpis.opportunities).toBe(0);
    expect(d.activity.daily).toEqual([]);
    expect(d.followups).toEqual({ due: 0, overdue: 0, upcoming: 0 });
  });
});
describe("filters and distribution", () => {
  it.each([
    "country=Australia",
    "roleType=Data+Analyst",
    "source=LinkedIn",
    "tier=1",
    "status=Applied",
  ])("uses filter %s", (query) => {
    expect(
      run(
        [
          row(),
          row({
            Country: "Canada",
            "Role Type": "Data Scientist",
            Source: "Indeed",
            Tier: "2",
            Status: "Interview",
          }),
        ],
        query,
      ).kpis.opportunities,
    ).toBe(1);
  });
  it("filters by found dates without clipping later submission activity", () => {
    const d = run(
      [row({ "Date Applied": "2026-10-10" })],
      "dateBasis=found&from=2026-10-01&to=2026-10-01",
    );
    expect(d.kpis.submitted).toBe(1);
    expect(d.activity.daily.find((p) => p.date === "2026-10-10")?.count).toBe(
      1,
    );
  });
  it("excludes and discloses missing selected-basis dates only with bounds", () => {
    const rows = [row({ "Date Applied": "", Status: "Preparing" })];
    expect(run(rows).kpis.opportunities).toBe(1);
    const d = run(rows, "from=2026-10-01");
    expect(d.kpis.opportunities).toBe(0);
    expect(d.quality.missingFilterDates).toBe(1);
  });
  it("preserves unknown categories in submission distributions", () => {
    expect(run([row({ Tier: "" })]).tiers).toContainEqual({
      label: "Unknown",
      count: 1,
    });
  });
  it.each([
    "from=invalid",
    "from=2026-10-10&to=2026-10-01",
    "status=private",
    "dateBasis=other",
    "secret=1",
    "from=2000-01-01&to=2026-10-15",
    "country=Australia&country=Canada",
  ])("rejects invalid query %s", (q) =>
    expect(() => parseFilters(new URLSearchParams(q))).toThrow(),
  );
});
describe("activity and follow-ups", () => {
  it("includes zero days, cumulative counts and partial weeks/months", () => {
    const d = run(
      [row(), row({ "Date Applied": "2026-10-04" })],
      "from=2026-10-01&to=2026-10-05",
    );
    expect(d.activity.daily.map((p) => p.count)).toEqual([0, 1, 0, 1, 0]);
    expect(d.activity.daily.at(-1)?.cumulative).toBe(2);
    expect(d.activity.weekly[0].date).toBe("2026-09-28");
    expect(d.activity.weekly[0].partial).toBe(true);
    expect(d.activity.monthly[0].partial).toBe(true);
  });
  it("uses pre-window history for a complete seven-day mean", () => {
    const d = run(
      [
        row({ "Date Found": "2026-09-01", "Date Applied": "2026-09-29" }),
        row({ "Date Applied": "2026-10-05" }),
      ],
      "from=2026-10-05&to=2026-10-05",
    );
    expect(d.activity.daily[0].count).toBe(1);
    expect(d.activity.daily[0].average).toBeCloseTo(2 / 7);
  });
  it("derives follow-ups only from eligible active states and valid dates", () => {
    const d = run([
      row({ "Follow-up Date": today }),
      row({ "Follow-up Date": "2026-10-14" }),
      row({ "Follow-up Date": "2026-10-16" }),
      row({ Status: "Rejected", "Follow-up Date": today }),
      row({ "Follow-up Date": "bad", "Follow-up Flag": "Due" }),
    ]);
    expect(d.followups).toEqual({ due: 1, overdue: 1, upcoming: 1 });
  });
});
it("canonicalizes accepted whitespace around filter dates", () => {
  const d = run([row()], "from=%202026-10-01%20&to=%202026-10-15%20");
  expect(d.filters.from).toBe("2026-10-01");
  expect(d.filters.to).toBe("2026-10-15");
  expect(d.kpis.submitted).toBe(1);
});
