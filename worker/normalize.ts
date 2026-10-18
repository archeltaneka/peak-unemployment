import { statuses, type Status } from "../src/types/dashboard";
import { parseDate } from "./dates";
import {
  reviewed,
  normalizeTier,
  taxonomies,
  type NormalizedRecord,
  type SourceRecord,
} from "./schemas";
export function normalizeRecords(
  rows: SourceRecord[],
  today: string,
): NormalizedRecord[] {
  const keys = rows.map((r) =>
    [r.Company, r.Role, r["Date Applied"], r["Date Found"]]
      .map((v) => v?.trim().toLowerCase() ?? "")
      .join("\u0000"),
  );
  const frequencies = new Map<string, number>();
  keys.forEach((k) => frequencies.set(k, (frequencies.get(k) ?? 0) + 1));
  return rows.map((r, i) => {
    const issues: string[] = [];
    const date = (field: string) => {
      const v = parseDate(r[field] ?? "");
      if (r[field]?.trim() && !v) issues.push(`Invalid ${field}`);
      return v;
    };
    const found = date("Date Found"),
      applied = date("Date Applied"),
      followup = date("Follow-up Date");
    const status = reviewed(r.Status, statuses) as Status;
    const pre = status === "Discovered" || status === "Preparing";
    const conflict =
      (!!applied && (pre || applied > today || (!!found && applied < found))) ||
      (!applied && !pre && status !== "Unknown");
    if (conflict) issues.push("Submission conflict");
    if (status === "Unknown") issues.push("Unknown status");
    if (found && found > today) issues.push("Future Date Found");
    if (!found) issues.push("Missing usable Date Found");
    if ((frequencies.get(keys[i]) ?? 0) > 1) issues.push("Possible duplicate");
    const dimensions = {
      country: reviewed(r.Country, taxonomies.country),
      roleType: r["Role Type"]?.trim()
        ? reviewed(r["Role Type"], taxonomies.roleType)
        : "Not specified",
      source: reviewed(r.Source, taxonomies.source),
      tier: normalizeTier(r.Tier),
    };
    if (Object.values(dimensions).includes("Unknown"))
      issues.push("Unknown category");
    if (!r["Role Type"]?.trim()) issues.push("Missing Role Type");
    return {
      ...dimensions,
      status,
      found,
      applied,
      followup,
      submitted: !!applied && !conflict,
      issues,
    };
  });
}
