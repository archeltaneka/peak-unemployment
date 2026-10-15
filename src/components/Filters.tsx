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
}: {
  filters: DashboardFilters;
  options: DashboardData["options"];
  onChange: (f: DashboardFilters) => void;
}) {
  const update = (key: keyof DashboardFilters, value: string) =>
    onChange({ ...filters, [key]: value || undefined });
  const count = Object.entries(filters).filter(
    ([k, v]) => k !== "dateBasis" && v,
  ).length;
  return (
    <section className="filters" aria-label="Global dashboard filters">
      <div className="filter-intro">
        <span className="filter-title">Your lens on the search</span>
        <button
          className="text-button"
          onClick={() => onChange({ dateBasis: "applied" })}
          disabled={!count && filters.dateBasis === "applied"}
        >
          Reset filters{count ? ` (${count})` : ""}
        </button>
      </div>
      <div className="filter-grid">
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
        <label>
          From
          <input
            type="date"
            min="2000-01-01"
            max="2100-12-31"
            value={filters.from ?? ""}
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
            onChange={(e) => update("to", e.target.value)}
          />
        </label>
        {(Object.keys(names) as (keyof typeof names)[]).map((key) => (
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
                  : key === "status"
                    ? "statuses"
                    : key === "roleType"
                      ? "roles"
                      : key === "tier"
                        ? "tiers"
                        : "sources"}
              </option>
              {options[key].map((value) => (
                <option key={value} value={value}>
                  {key === "tier" && value !== "Unknown"
                    ? "Tier " + value
                    : value}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <p className="filter-note">
        Dates select opportunities by{" "}
        <strong>
          {filters.dateBasis === "applied" ? "Date Applied" : "Date Found"}
        </strong>
        . Charts share this cohort; activity always plots submission dates.
      </p>
    </section>
  );
}
