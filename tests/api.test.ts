import { describe, expect, it } from "vitest";
import { createHandler, type Env } from "../worker/index";
const base: Env = {
  DATA_MODE: "live",
  REPORTING_TIMEZONE: "Australia/Melbourne",
};
const fetchAt = (path: string, env = base) =>
  createHandler()(new Request("https://example.test" + path), env);
describe("public API boundary", () => {
  it("fails closed on missing live credentials", async () => {
    const r = await fetchAt("/api/dashboard");
    expect(r.status).toBe(503);
    expect(await r.text()).not.toContain("demo");
  });
  it("does not serve SPA content for unknown API paths", async () =>
    expect((await fetchAt("/api/nope")).status).toBe(404));
  it("rejects methods and malformed filters", async () => {
    expect(
      (
        await createHandler()(
          new Request("https://example.test/api/dashboard", { method: "POST" }),
          base,
        )
      ).status,
    ).toBe(405);
    expect((await fetchAt("/api/dashboard?status=secret")).status).toBe(400);
  });
  it("returns aggregates only, never source strings or secrets", async () => {
    const sentinel = "SECRET@example.com";
    const handler = createHandler({
      read: async () => [
        {
          Company: sentinel,
          Notes: sentinel,
          "Job URL": sentinel,
          Status: sentinel,
          Country: sentinel,
          Source: sentinel,
          "Role Type": sentinel,
          Tier: sentinel,
          "Date Applied": "2026-10-01",
        },
      ],
    });
    const r = await handler(
      new Request("https://example.test/api/dashboard"),
      base,
    );
    const text = await r.text();
    expect(r.status).toBe(200);
    expect(text).not.toContain(sentinel);
    expect(text).not.toContain('"Company":');
    expect(text).not.toContain('"Notes":');
    expect(r.headers.get("Cache-Control")).toBe("no-store");
  });
  it("hides upstream error details", async () => {
    const handler = createHandler({
      read: async () => {
        throw Error("private-key-SECRET");
      },
    });
    const r = await handler(
      new Request("https://example.test/api/dashboard"),
      base,
    );
    expect(r.status).toBe(503);
    expect(await r.text()).not.toContain("SECRET");
  });
  it("serves clearly marked synthetic demo aggregates", async () => {
    const r = await fetchAt("/api/dashboard", { ...base, DATA_MODE: "demo" });
    expect(r.status).toBe(200);
    const body = (await r.json()) as {
      mode: string;
      kpis: { submitted: number };
    };
    expect(body.mode).toBe("demo");
    expect(body.kpis.submitted).toBeGreaterThan(0);
  });
});
it("never reuses a demo source after switching to unconfigured live mode", async () => {
  const handler = createHandler();
  const req = () => new Request("https://example.test/api/dashboard");
  expect((await handler(req(), { DATA_MODE: "demo" })).status).toBe(200);
  expect((await handler(req(), { DATA_MODE: "live" })).status).toBe(503);
  expect((await handler(req(), { DATA_MODE: "live" })).status).toBe(503);
});
it("shares concurrent reads, reuses rows for 60 seconds, and fails closed after expiry", async () => {
  const { vi } = await import("vitest");
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-15T00:00:00Z"));
  try {
    let resolve!: (rows: Record<string, string>[]) => void;
    let reads = 0;
    let fail = false;
    const handler = createHandler({
      read: () => {
        reads++;
        if (fail) return Promise.reject(new Error("SECRET"));
        return new Promise((r) => {
          resolve = r;
        });
      },
    });
    const req = () => new Request("https://example.test/api/dashboard");
    const first = handler(req(), base),
      second = handler(req(), base);
    expect(reads).toBe(1);
    resolve([{ Status: "Applied", "Date Applied": "2026-10-01" }]);
    expect((await first).status).toBe(200);
    expect((await second).status).toBe(200);
    await handler(req(), base);
    expect(reads).toBe(1);
    vi.advanceTimersByTime(60001);
    fail = true;
    const expired = await handler(req(), base);
    expect(expired.status).toBe(503);
    expect(await expired.text()).not.toContain("SECRET");
    expect(reads).toBe(2);
  } finally {
    vi.useRealTimers();
  }
});
