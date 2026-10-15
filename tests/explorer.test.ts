import { expect, it } from "vitest";
import { filterExplorer } from "../src/lib/explorer";
const rows = [
  {
    id: 1,
    company: "Kite",
    role: "Analyst",
    country: "Australia",
    roleType: "Data Analyst",
    source: "SEEK",
    tier: "1",
    status: "Applied",
    applied: "2026-10-01",
  },
  {
    id: 2,
    company: "Cedar",
    role: "Scientist",
    country: "Canada",
    roleType: "Data Scientist",
    source: "LinkedIn",
    tier: "2",
    status: "Preparing",
    applied: null,
  },
];
it("searches and filters only demo records", () => {
  expect(
    filterExplorer(
      rows,
      { search: "kite", status: "", country: "" },
      "company",
      false,
    ).map((r) => r.id),
  ).toEqual([1]);
  expect(
    filterExplorer(
      rows,
      { search: "", status: "Preparing", country: "Canada" },
      "company",
      false,
    ).map((r) => r.id),
  ).toEqual([2]);
});
it("sorts without mutating input and preserves missing dates", () => {
  expect(
    filterExplorer(
      rows,
      { search: "", status: "", country: "" },
      "company",
      false,
    )[0].company,
  ).toBe("Cedar");
  expect(rows[0].company).toBe("Kite");
  expect(
    filterExplorer(
      rows,
      { search: "", status: "", country: "" },
      "applied",
      false,
    ).at(-1)?.applied,
  ).toBeNull();
});
