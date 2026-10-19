import type { DashboardFilters, DashboardData } from "../types/dashboard";
const names = {
  country: "Country",
  roleType: "Role type",
  source: "Source",
  tier: "Tier",
  status: "Current status",
};
export function Filters({
  filters,
  options,
  onChange,
  validationError = "",
}: {
  filters: DashboardFilters;
  options: DashboardData["options"];
  onChange: (f: DashboardFilters) => void;
  validationError?: string;
}) {
  const update = (key: keyof DashboardFilters, value: string) =>
    onChange({ ...filters, [key]: value || undefined });
  const count = Object.entries(filters).filter(
    ([k, v]) => k !== "dateBasis" && v,
  ).length;
  function dimension(key: keyof typeof names) {
    return (
      <label key={key}>
        {names[key]}
        <select
          value={filters[key] ?? ""}
          onChange={(e) => update(key, e.target.value)}
        >
          <option value="">
            All{" "}
            {key === "country"
              ? "countries"
              : key === "roleType"
                ? "roles"
                : key === "status"
                  ? "statuses"
                  : key === "tier"
                    ? "tiers"
                    : "sources"}
          </option>
          {options[key].map((value) => (
            <option key={value} value={value}>
              {key === "tier" && value !== "Unknown" ? "Tier " + value : value}
            </option>
          ))}
        </select>
      </label>
    );
  }
  return (
    <section className="filters" aria-label="Global dashboard filters">
      <div className="filter-main">
        <label>
          Date basis
          <select
            value={filters.dateBasis}
            onChange={(e) => update("dateBasis", e.target.value)}
          >
            <option value="applied">Date Applied</option>
            <option value="found">Date Found</option>
          </select>
        </label>
        {dimension("country")}
        {dimension("roleType")}
        {dimension("status")}
        <button
          className="text-button"
          onClick={() => onChange({ dateBasis: "applied" })}
          disabled={!count && filters.dateBasis === "applied"}
        >
          Reset filters{count ? ` (${count})` : ""}
        </button>
      </div>
      <details className="filter-more">
        <summary>
          Dates, source &amp; tier
          {validationError ? " · check date range" : ""}
          {[filters.from, filters.to, filters.source, filters.tier].filter(
            Boolean,
          ).length
            ? " · active"
            : ""}
        </summary>
        <div className="filter-grid">
          <label>
            From
            <input
              type="date"
              min="2000-01-01"
              max="2100-12-31"
              value={filters.from ?? ""}
              aria-invalid={!!validationError}
              aria-describedby={
                validationError ? "date-range-error" : undefined
              }
              onChange={(e) => update("from", e.target.value)}
            />
          </label>
          <label>
            To
            <input
              type="date"
              min={filters.from ?? "2000-01-01"}
              max="2100-12-31"
              value={filters.to ?? ""}
              aria-invalid={!!validationError}
              aria-describedby={
                validationError ? "date-range-error" : undefined
              }
              onChange={(e) => update("to", e.target.value)}
            />
          </label>
          {dimension("source")}
          {dimension("tier")}
        </div>
        {validationError && (
          <p id="date-range-error" className="filter-error" role="alert">
            {validationError}
          </p>
        )}
        <p className="filter-note">
          Dates select opportunities by{" "}
          <strong>
            {filters.dateBasis === "applied" ? "Date Applied" : "Date Found"}
          </strong>
          . Charts share this cohort; activity always plots submission dates.
        </p>
      </details>
    </section>
  );
}
