import { describe, expect, it } from "vitest";
import {
  parseDate,
  todayInTimezone,
  addDays,
  weekStart,
} from "../worker/dates";
describe("calendar dates", () => {
  it("accepts ISO leap days without shifting them", () => {
    expect(parseDate("2024-02-29")).toBe("2024-02-29");
    expect(addDays("2024-02-29", 1)).toBe("2024-03-01");
  });
  it.each([
    "",
    "2025-02-29",
    "2026-04-31",
    "10/11/2026",
    "2026-01-01T10:00:00Z",
    "garbage",
  ])("rejects missing, impossible or ambiguous %s", (value) =>
    expect(parseDate(value)).toBeNull(),
  );
  it("starts weeks Monday across year boundaries", () =>
    expect(weekStart("2026-01-01")).toBe("2025-12-29"));
  it("resolves reporting day across UTC and daylight saving", () => {
    expect(
      todayInTimezone(new Date("2026-10-14T13:30:00Z"), "Australia/Melbourne"),
    ).toBe("2026-10-15");
    expect(
      todayInTimezone(new Date("2026-07-14T13:30:00Z"), "Australia/Melbourne"),
    ).toBe("2026-07-14");
  });
});
