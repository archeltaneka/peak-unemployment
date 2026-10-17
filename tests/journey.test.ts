import { describe, expect, it } from "vitest";
import { journeyStations, cohortShare } from "../src/lib/journey";

describe("current-status journey", () => {
  it("orders current counts without cumulating later stages or rejected outcomes", () => {
    const stations = journeyStations([
      { label: "Offer", count: 2 },
      { label: "Rejected", count: 8 },
      { label: "Applied", count: 3 },
      { label: "Unknown", count: 1 },
    ]);
    expect(stations.map((s) => s.label)).toEqual([
      "Discovered",
      "Preparing",
      "Applied",
      "Recruiter Screen",
      "Interview",
      "Technical",
      "Final",
      "Offer",
      "Rejected",
      "Unknown",
    ]);
    expect(stations.find((s) => s.label === "Applied")?.count).toBe(3);
    expect(stations.find((s) => s.label === "Unknown")?.count).toBe(1);
    expect(stations[0].count).toBeNull();
  });
  it("distinguishes a reported zero from unavailable data", () => {
    expect(journeyStations([{ label: "Offer", count: 0 }])[7].count).toBe(0);
    expect(cohortShare(null, 10)).toBeNull();
    expect(cohortShare(0, 0)).toBeNull();
    expect(cohortShare(0, 10)).toBe(0);
    expect(cohortShare(3, 12)).toBe(25);
  });
});
