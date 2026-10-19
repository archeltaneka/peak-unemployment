import { afterEach, expect, it, vi } from "vitest";
import { dateRangeError } from "../src/lib/filterValidation";
import { fetchDashboard } from "../src/lib/api";

afterEach(() => vi.unstubAllGlobals());

it("accepts empty, open-ended and equal date bounds", () => {
  for (const filters of [
    {},
    { from: "2026-10-15" },
    { to: "2026-10-15" },
    { from: "2026-10-15", to: "2026-10-15" },
  ]) {
    expect(dateRangeError(filters)).toBe("");
  }
});

it("explains inverted dates and excessive ranges", () => {
  expect(dateRangeError({ from: "2026-10-16", to: "2026-10-15" })).toMatch(
    /From.*To/,
  );
  expect(dateRangeError({ from: "2000-01-01", to: "2100-12-31" })).toMatch(
    /3,660/,
  );
  expect(dateRangeError({ from: "2000-01-01", to: "2010-01-08" })).toBe("");
  expect(dateRangeError({ from: "2000-01-01", to: "2010-01-09" })).toMatch(
    /3,660/,
  );
});

it.each(["2026-02-30", "2025-02-29", "1999-12-31", "2101-01-01", "01/02/2026"])(
  "rejects invalid calendar date %s",
  (from) => {
    expect(dateRangeError({ from })).not.toBe("");
  },
);

it("accepts leap days and respects calendar days across daylight saving", () => {
  expect(dateRangeError({ from: "2024-02-29", to: "2024-03-01" })).toBe("");
  expect(dateRangeError({ from: "2026-10-03", to: "2026-10-05" })).toBe("");
});

it("never fetches an invalid range and allows a corrected range", async () => {
  const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
  vi.stubGlobal("fetch", fetch);
  const signal = new AbortController().signal;
  await expect(
    fetchDashboard(
      { dateBasis: "applied", from: "2026-10-16", to: "2026-10-15" },
      signal,
    ),
  ).rejects.toThrow(/From.*To/);
  expect(fetch).not.toHaveBeenCalled();
  await fetchDashboard(
    { dateBasis: "applied", from: "2026-10-15", to: "2026-10-16" },
    signal,
  );
  expect(fetch).toHaveBeenCalledTimes(1);
});
