import type { SourceRecord } from "./schemas";
export const headers = [
  "Company",
  "Role",
  "City",
  "Country",
  "Role Type",
  "Source",
  "Job URL",
  "Date Found",
  "Date Applied",
  "Tier",
  "Status",
  "Follow-up Date",
  "Days Since Applied",
  "Follow-up Flag",
  "Notes",
];
export function recordsFromValues(values: unknown): SourceRecord[] {
  if (
    !Array.isArray(values) ||
    !Array.isArray(values[0]) ||
    values.length > 10001
  )
    throw new Error("Invalid source");
  const names = values[0].map((v: unknown) => {
    const name = typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "";
    return (
      headers.find((header) => header.toLowerCase() === name.toLowerCase()) ??
      name
    );
  });
  if (
    new Set(names).size !== names.length ||
    headers.some((h) => !names.includes(h))
  )
    throw new Error("Invalid headers");
  if (values.slice(1).some((r: unknown) => !Array.isArray(r)))
    throw new Error("Invalid source row");
  return values
    .slice(1)
    .filter((r: unknown[]) => r.some((v) => v !== "" && v !== null))
    .map((row: unknown) => {
      if (
        !Array.isArray(row) ||
        row.length > names.length ||
        row.some(
          (v) =>
            v !== null &&
            typeof v !== "string" &&
            typeof v !== "number" &&
            typeof v !== "boolean",
        )
      )
        throw new Error("Invalid source row");
      return Object.fromEntries(names.map((h, i) => [h, String(row[i] ?? "")]));
    });
}
export function parseCsv(csv: string): SourceRecord[] {
  if (csv.length > 5_000_000) throw new Error("Source too large");
  const rows: string[][] = [];
  let row: string[] = [],
    cell = "",
    quoted = false,
    closed = false;
  const pushCell = () => {
    row.push(cell);
    cell = "";
    closed = false;
  };
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (quoted) {
      if (c === '"') {
        if (csv[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = false;
          closed = true;
        }
      } else cell += c;
    } else if (c === '"') {
      if (cell || closed) throw new Error("Invalid CSV");
      quoted = true;
    } else if (c === ",") pushCell();
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && csv[i + 1] === "\n") i++;
      pushCell();
      rows.push(row);
      row = [];
    } else {
      if (closed) throw new Error("Invalid CSV");
      cell += c;
    }
  }
  if (quoted) throw new Error("Invalid CSV");
  if (cell || row.length || closed) {
    pushCell();
    rows.push(row);
  }
  if (rows[0]?.[0]) rows[0][0] = rows[0][0].replace(/^\uFEFF/, "");
  return recordsFromValues(rows);
}
