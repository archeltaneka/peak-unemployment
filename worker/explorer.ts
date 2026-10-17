import type { ExplorerRecord } from "../src/types/dashboard";
import { normalizeRecords } from "./normalize";
import type { SourceRecord } from "./schemas";

export function buildExplorer(
  rows: SourceRecord[],
  today: string,
): ExplorerRecord[] {
  const normalized = normalizeRecords(rows, today);
  return rows.map((row, index) => {
    const record = normalized[index];
    // Explicit public allowlist: never spread a source or normalized record here.
    return {
      id: index + 1,
      company: row.Company?.trim() ?? "",
      role: row.Role?.trim() ?? "",
      country: record.country,
      source: record.source,
      tier: record.tier,
      status: record.status,
      applied: record.applied,
    };
  });
}
