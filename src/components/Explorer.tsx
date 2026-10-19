import { useState } from "react";
import { useExplorer } from "../hooks/useExplorer";
import { filterExplorer, type SortKey } from "../lib/explorer";
import { statusColors } from "../lib/presentation";
import { Panel, Empty } from "./Panel";
const columns: [SortKey, string][] = [
  ["company", "Company"],
  ["role", "Role"],
  ["country", "Country"],
  ["source", "Source"],
  ["tier", "Tier"],
  ["status", "Current status"],
  ["applied", "Date applied"],
];
export function Explorer() {
  const { data, loading, error, retry } = useExplorer();
  const records = data?.records ?? [];
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    status: "",
  });
  const [sort, setSort] = useState<SortKey>("applied");
  const [descending, setDescending] = useState(true);
  const [page, setPage] = useState(0);
  const rows = filterExplorer(records, filters, sort, descending);
  const pageCount = Math.max(1, Math.ceil(rows.length / 8));
  const current = Math.min(page, pageCount - 1);
  const update = (key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(0);
  };
  return (
    <Panel
      id="explorer"
      title="Application Explorer"
      description="Explore applications by company, role and current status."
      className="explorer"
    >
      <p className="demo-explanation">
        {data?.mode === "live"
          ? "Approved application fields. Notes, URLs and contacts stay private."
          : data
            ? "Demo mode uses fictional application records."
            : "Application records are loaded from the configured data source."}{" "}
        These controls are independent of the dashboard filters above.
        {data && (
          <span>
            {" "}
            Source refreshed {new Date(data.fetchedAt).toLocaleTimeString()}.
            {data.mode === "demo" &&
              ` Fixed demo reporting date: ${data.today}.`}
          </span>
        )}
      </p>
      {loading && <p role="status">Loading application records…</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button onClick={retry}>Try again</button>
        </div>
      )}
      {data && !error && !loading && (
        <>
          <div className="explorer-controls">
            <label className="search">
              Search applications
              <input
                type="search"
                placeholder="Company, role, country or source…"
                value={filters.search}
                onChange={(e) => update("search", e.target.value)}
              />
            </label>
            <label>
              Country
              <select
                value={filters.country}
                onChange={(e) => update("country", e.target.value)}
              >
                <option value="">All countries</option>
                {[...new Set(records.map((r) => r.country))].sort().map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Current status
              <select
                value={filters.status}
                onChange={(e) => update("status", e.target.value)}
              >
                <option value="">All statuses</option>
                {[...new Set(records.map((r) => r.status))].sort().map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="table-scroll-hint" id="explorer-scroll-hint">
            Scroll horizontally to view all columns.
          </p>
          <div
            className="table-scroll explorer-table"
            tabIndex={0}
            role="region"
            aria-label="Application explorer records"
            aria-describedby="explorer-scroll-hint"
          >
            <table>
              <caption className="sr-only">
                Application records with approved public fields. Select a column
                heading to sort.
              </caption>
              <thead>
                <tr>
                  {columns.map(([key, label]) => (
                    <th
                      key={key}
                      scope="col"
                      aria-sort={
                        sort === key
                          ? descending
                            ? "descending"
                            : "ascending"
                          : "none"
                      }
                    >
                      <button
                        onClick={() => {
                          setSort(key);
                          setDescending(sort === key ? !descending : false);
                          setPage(0);
                        }}
                      >
                        {label}
                        <svg
                          aria-hidden="true"
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                        >
                          <path
                            d={
                              sort === key && !descending
                                ? "m3 8 3-4 3 4"
                                : "m3 4 3 4 3-4"
                            }
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(current * 8, current * 8 + 8).map((r) => (
                  <tr key={r.id}>
                    <th scope="row">{r.company || "Not provided"}</th>
                    <td>{r.role || "Not provided"}</td>
                    <td>{r.country}</td>
                    <td>{r.source}</td>
                    <td>
                      <span className="tier-label">{r.tier}</span>
                    </td>
                    <td>
                      <span className="status-label">
                        <i style={{ background: statusColors[r.status] }} />
                        {r.status}
                      </span>
                    </td>
                    <td>{r.applied ?? "Missing or invalid"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!rows.length && (
            <Empty>No application records match. Try a broader search.</Empty>
          )}
          <div className="pagination">
            <span>
              {rows.length ? current * 8 + 1 : 0}–
              {Math.min(current * 8 + 8, rows.length)} of {rows.length} records
            </span>
            <div>
              <button
                disabled={current === 0}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </button>
              <span>
                {current + 1} / {pageCount}
              </span>
              <button
                disabled={current === pageCount - 1}
                onClick={() => setPage(current + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </Panel>
  );
}
