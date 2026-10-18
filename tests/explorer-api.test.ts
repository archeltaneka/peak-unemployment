import { expect, it } from "vitest";
import type { SourceRecord } from "../worker/schemas";
import { createHandler } from "../worker/index";

const request = () => new Request("https://example.test/api/explorer");
it("publishes only approved fields with normalized categories and dates", async () => {
  const handler = createHandler({
    read: async (): Promise<SourceRecord[]> => [
      {
        Company: " Public Company ",
        Role: " Analyst ",
        Country: "Australia",
        Source: "PRIVATE",
        Tier: "A",
        Status: "Applied",
        "Role Type": "Data Analyst",
        "Date Applied": "2026-10-01",
        Notes: "PRIVATE",
        "Job URL": "PRIVATE",
        City: "PRIVATE",
        Contact: "PRIVATE",
        "Follow-up Date": "2026-10-20",
      },
      {
        Company: "",
        Role: "",
        Status: "Applied",
        "Date Applied": "01/02/2026",
      },
    ],
  });
  const response = await handler(request(), { DATA_MODE: "live" });
  expect(response.status).toBe(200);
  expect(response.headers.get("Cache-Control")).toBe("no-store");
  const body = (await response.json()) as { mode: string; records: unknown[] };
  expect(body.mode).toBe("live");
  expect(body.records[0]).toEqual({
    id: 1,
    company: "Public Company",
    role: "Analyst",
    country: "Australia",
    source: "Unknown",
    tier: "A",
    status: "Applied",
    applied: "2026-10-01",
  });
  expect(body.records[1]).toEqual({
    id: 2,
    company: "",
    role: "",
    country: "Unknown",
    source: "Unknown",
    tier: "Unknown",
    status: "Applied",
    applied: null,
  });
  expect(JSON.stringify(body)).not.toContain("PRIVATE");
});
it("fails closed without credentials and hides source errors", async () => {
  expect((await createHandler()(request(), { DATA_MODE: "live" })).status).toBe(
    503,
  );
  const response = await createHandler({
    read: async () => {
      throw Error("SECRET");
    },
  })(request(), { DATA_MODE: "live" });
  expect(response.status).toBe(503);
  expect(await response.text()).not.toContain("SECRET");
});
it("shares the sheet snapshot with aggregates and ignores aggregate cohort filters", async () => {
  let reads = 0;
  const handler = createHandler({
    read: async () => {
      reads++;
      return [{ Company: "Example", Country: "Australia" }];
    },
  });
  await handler(
    new Request("https://example.test/api/dashboard?country=Canada"),
    { DATA_MODE: "live" },
  );
  const response = await handler(request(), { DATA_MODE: "live" });
  expect(response.status).toBe(200);
  expect(
    ((await response.json()) as { records: unknown[] }).records,
  ).toHaveLength(1);
  expect(reads).toBe(1);
});
it("labels demo records and never carries them into unconfigured live mode", async () => {
  const handler = createHandler();
  const response = await handler(request(), { DATA_MODE: "demo" });
  expect(response.status).toBe(200);
  const body = (await response.json()) as {
    mode: string;
    records: unknown[];
    today: string;
  };
  expect(body.mode).toBe("demo");
  expect(body.today).toBe("2026-10-15");
  expect(body.records.length).toBeGreaterThan(0);
  expect((await handler(request(), { DATA_MODE: "live" })).status).toBe(503);
});
