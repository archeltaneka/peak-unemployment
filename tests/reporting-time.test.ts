import { expect, it } from "vitest";
import { reportingTime } from "../src/lib/presentation";

it("formats the reporting zone rather than the viewer timezone", () => {
  const instant = "2026-10-19T00:30:00Z";
  expect(reportingTime(instant, "Australia/Melbourne")).toContain("11:30");
  expect(reportingTime(instant, "UTC")).toContain("00:30");
  expect(reportingTime(instant, "America/New_York")).toContain("20:30");
});

it("uses the zone offset applicable to the refresh instant", () => {
  expect(
    reportingTime("2026-07-19T00:30:00Z", "Australia/Melbourne"),
  ).toContain("10:30");
  expect(
    reportingTime("2026-10-19T00:30:00Z", "Australia/Melbourne"),
  ).toContain("11:30");
});
