import { buildExplorer } from "./explorer";
import demoCsv from "../data/demo/applications.csv?raw";
import { buildDashboard } from "./analytics";
import { parseCsv } from "./csv";
import { todayInTimezone } from "./dates";
import { InvalidFilters, parseFilters } from "./filters";
import { normalizeRecords } from "./normalize";
import { SheetsSource, type DataSource, type SheetConfig } from "./sheets";
import type { SourceRecord } from "./schemas";
export interface Env extends Partial<SheetConfig> {
  DATA_MODE?: string;
  REPORTING_TIMEZONE?: string;
  ASSETS?: { fetch(request: Request): Promise<Response> };
}
const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
export function createHandler(injected?: DataSource) {
  let sourceKey = "",
    source: DataSource | undefined;
  let cached:
    { rows: SourceRecord[]; fetchedAt: string; expires: number } | undefined;
  let pending: Promise<SourceRecord[]> | undefined;
  return async (request: Request, env: Env): Promise<Response> => {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/") && url.pathname !== "/api")
      return (
        env.ASSETS?.fetch(request) ?? new Response("Not found", { status: 404 })
      );
    if (request.method !== "GET")
      return json({ error: "Method not allowed" }, 405);
    if (url.pathname === "/api/health") return json({ status: "ok" });
    if (url.pathname !== "/api/dashboard" && url.pathname !== "/api/explorer")
      return json({ error: "Not found" }, 404);
    try {
      if (url.search.length > 2048) throw new InvalidFilters();
      const filters = parseFilters(url.searchParams);
      const mode = env.DATA_MODE ?? "live";
      if (mode !== "live" && mode !== "demo") throw new Error("Invalid mode");
      const timezone = env.REPORTING_TIMEZONE ?? "Australia/Melbourne";
      const today =
        mode === "demo" ? "2026-10-15" : todayInTimezone(new Date(), timezone);
      // Single-entry cache: bounded, isolate-local, never stored in the Cache API.
      const key = JSON.stringify([
        mode,
        env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        env.GOOGLE_PRIVATE_KEY,
        env.GOOGLE_SHEET_ID,
        env.GOOGLE_SHEET_RANGE,
      ]);
      if (sourceKey !== key) {
        sourceKey = key;
        cached = undefined;
        pending = undefined;
        source = undefined;
        if (injected) source = injected;
        else if (mode === "demo")
          source = { read: async () => parseCsv(demoCsv) };
        else {
          if (
            !env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
            !env.GOOGLE_PRIVATE_KEY ||
            !env.GOOGLE_SHEET_ID ||
            !env.GOOGLE_SHEET_RANGE
          )
            throw new Error("Missing configuration");
          source = new SheetsSource(env as SheetConfig);
        }
      }
      if (!source) throw new Error("Missing source");
      let snapshot = cached;
      if (!snapshot || snapshot.expires <= Date.now()) {
        const read = pending ?? source.read();
        pending = read;
        try {
          const rows = await read;
          snapshot = {
            rows,
            fetchedAt: new Date().toISOString(),
            expires: Date.now() + 60000,
          };
          if (sourceKey === key) cached = snapshot;
        } finally {
          if (pending === read) pending = undefined;
        }
      }
      if (url.pathname === "/api/explorer") {
        return json({
          records: buildExplorer(snapshot.rows, today),
          mode,
          today,
          timezone,
          fetchedAt: snapshot.fetchedAt,
        });
      }
      return json({
        ...buildDashboard(
          normalizeRecords(snapshot.rows, today),
          filters,
          today,
        ),
        mode,
        today,
        timezone,
        fetchedAt: snapshot.fetchedAt,
      });
    } catch (error) {
      return error instanceof InvalidFilters
        ? json({ error: "Invalid filters. Check dates and categories." }, 400)
        : json(
            { error: "Dashboard temporarily unavailable. Please try again." },
            503,
          );
    }
  };
}
export default { fetch: createHandler() };
