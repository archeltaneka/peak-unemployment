import { useState } from "react";
import demo from "../../data/demo/explorer.json";
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
  const [filters, setFilters] = useState({
    search: "",
    country: "",
    status: "",
  });
  const [sort, setSort] = useState<SortKey>("applied");
  const [descending, setDescending] = useState(true);
  const [page, setPage] = useState(0);
  const rows = filterExplorer(demo, filters, sort, descending);
  const pageCount = Math.max(1, Math.ceil(rows.length / 8));
  const current = Math.min(page, pageCount - 1);
  const update = (key: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(0);
  };
  return (
    <Panel
      id="explorer"
      title="Application explorer"
      description="Fictional companies. Real dashboard functionality."
      className="explorer"
      actions={<span className="demo-badge">Demo records only</span>}
    >
      <p className="demo-explanation">
        This table uses a separate, reviewed synthetic dataset. It never
        displays private applications and is independent of the dashboard
        filters above.
      </p>
      <div className="explorer-controls">
        <label className="search">
          Search demo records
          <input
            type="search"
            placeholder="Company, role, country or source…"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
          />
        </label>
        <label>
          Demo country
          <select
            value={filters.country}
            onChange={(e) => update("country", e.target.value)}
          >
            <option value="">All countries</option>
            {[...new Set(demo.map((r) => r.country))].sort().map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Demo status
          <select
            value={filters.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="">All statuses</option>
            {[...new Set(demo.map((r) => r.status))].sort().map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="table-scroll explorer-table">
        <table>
          <caption className="sr-only">
            Sanitized fictional application records. Select a column heading to
            sort.
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
                <th scope="row">{r.company}</th>
                <td>{r.role}</td>
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
                <td>{r.applied ?? "Not submitted"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && (
        <Empty>No demo records match. Try a broader search.</Empty>
      )}
      <div className="pagination">
        <span>
          {rows.length ? current * 8 + 1 : 0}–
          {Math.min(current * 8 + 8, rows.length)} of {rows.length} demo records
        </span>
        <div>
          <button disabled={current === 0} onClick={() => setPage(current - 1)}>
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
    </Panel>
  );
}
