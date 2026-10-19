import { expect, it } from "vitest";
import { headers, parseCsv, recordsFromValues } from "../worker/csv";
import { normalizeRecords } from "../worker/normalize";
import { buildDashboard } from "../worker/analytics";
import { parseFilters } from "../worker/filters";
import { createHandler } from "../worker/index";
const today = "2026-10-15";
const row = (Tier: string, Country = "Australia") => ({
  Tier,
  Country,
  Status: "Applied",
  "Date Applied": "2026-10-01",
});
it.each([
  ["A", "A"],
  [" b ", "B"],
  ["\u00a0C\u00a0", "C"],
  ["Tier A", "A"],
  [" tier   b ", "B"],
  ["TIER\tC", "C"],
  ["", "Unknown"],
  ["  ", "Unknown"],
  ["D", "Unknown"],
  ["1", "Unknown"],
  ["Tier AB", "Unknown"],
  ["private@example.com", "Unknown"],
])("normalizes %j to %s", (input, expected) => {
  expect(normalizeRecords([row(input)], today)[0].tier).toBe(expected);
});
it("maps reordered, case/whitespace-normalized headers for Sheets and CSV", () => {
  const names = [...headers]
    .reverse()
    .map((h) => `\uFEFF ${h.toLowerCase().replaceAll(" ", "  ")} `);
  const values = [...headers]
    .reverse()
    .map((h) => (h === "Tier" ? " Tier B " : ""));
  expect(recordsFromValues([names, values])[0].Tier).toBe(" Tier B ");
  const records = parseCsv([names.join(","), values.join(",")].join("\n"));
  expect(normalizeRecords(records, today)[0].tier).toBe("B");
  expect(() => recordsFromValues([[...headers, " tier "]])).toThrow(
    "Invalid headers",
  );
});
it("reproduces the historical category counts with synthetic eligible rows", () => {
  const records = [
    ["A", 94],
    ["B", 69],
    ["C", 14],
    ["", 1],
  ].flatMap(([tier, count]) =>
    Array.from({ length: Number(count) }, () => row(String(tier))),
  );
  const d = buildDashboard(
    normalizeRecords(records, today),
    parseFilters(new URLSearchParams()),
    today,
  );
  expect(d.tiers).toEqual([
    { label: "A", count: 94 },
    { label: "B", count: 69 },
    { label: "C", count: 14 },
    { label: "Unknown", count: 1 },
  ]);
  expect(d.kpis.submitted).toBe(178);
});
it("updates API tier aggregation and denominator with global filters", async () => {
  const handler = createHandler({
    read: async () => [
      row("A"),
      row("Tier B"),
      row("C", "Canada"),
      row(""),
      { ...row("A"), Status: "Preparing", "Date Applied": "" },
    ],
  });
  for (const [query, expected] of [
    [
      "country=Australia",
      [
        { label: "A", count: 1 },
        { label: "B", count: 1 },
        { label: "Unknown", count: 1 },
      ],
    ],
    ["tier=B", [{ label: "B", count: 1 }]],
    ["tier=Unknown", [{ label: "Unknown", count: 1 }]],
    ["status=Preparing", []],
    ["from=2026-10-02", []],
    ["country=Germany", []],
  ] as const) {
    const response = await handler(
      new Request(`https://example.test/api/dashboard?${query}`),
      { DATA_MODE: "demo" },
    );
    expect(response.status).toBe(200);
    const data = (await response.json()) as {
      tiers: unknown;
      kpis: { submitted: number };
      options: { tier: string[] };
    };
    expect(data.tiers).toEqual(expected);
    expect(data.kpis.submitted).toBe(
      expected.reduce((sum, g) => sum + g.count, 0),
    );
    expect(data.options.tier).toEqual(["A", "B", "C", "Unknown"]);
  }
});
