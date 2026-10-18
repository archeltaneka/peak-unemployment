import { PriorityBreakdown } from "../charts/PriorityBreakdown";
import { useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import type { DashboardFilters } from "../types/dashboard";
import { Filters } from "../components/Filters";
import { Kpis } from "../components/Kpis";
import { Panel } from "../components/Panel";
import { Explorer } from "../components/Explorer";
import { Methodology } from "../components/Methodology";
import { Activity } from "../charts/Activity";
import { Pipeline } from "../charts/Pipeline";
import { Geography } from "../charts/Geography";
import { Distribution } from "../charts/Distribution";
export default function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateBasis: "applied",
  });
  const { data, loading, error, retry } = useDashboard(filters);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to dashboard
      </a>
      <header className="site-header">
        <a
          href="#overview"
          className="wordmark"
          aria-label="Peak Unemployment home"
        >
          Peak
          <br />
          Unemployment<span className="wordmark-dot">.</span>
        </a>
        <p className="brand-description">
          A job search, quantified.
          <br />A personal analytics portfolio.
        </p>
        <nav aria-label="Main navigation">
          <a href="#overview">Overview</a>
          <a href="#journey">The journey</a>
          <a href="#activity">Activity</a>
          <a href="#geography">Geography</a>
          <a href="#explorer">Explorer</a>
          <a href="#methodology">Methodology</a>
        </nav>
        <p className="header-note">
          Same applications.
          <br />A different perspective.
        </p>
      </header>
      <main id="main">
        <div className="page-heading" id="overview">
          <div>
            <h1>
              <span className="title-line">Peak</span>
              <span className="title-line">
                Unemployment<span className="wordmark-dot">.</span>
              </span>
            </h1>
            <p>Because apparently even unemployment needs KPIs.</p>
          </div>
          <div className="provenance">
            {data && (
              <small>
                As of {data.today} · {data.timezone}
                <br />
                {data.mode === "demo"
                  ? "Fixed demo reporting date"
                  : "Source refreshed " +
                    new Date(data.fetchedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
              </small>
            )}
          </div>
        </div>
        {data && (
          <Filters
            filters={filters}
            options={data.options}
            onChange={setFilters}
          />
        )}
        <div aria-live="polite" className="request-status">
          {loading
            ? data
              ? "Updating your view…"
              : "Loading application analytics…"
            : error
              ? "Dashboard could not be refreshed."
              : data
                ? ``
                : ""}
        </div>
        {error && (
          <div className="error-state" role="alert">
            <h2>Taking a brief pause.</h2>
            <p>{error}</p>
            <button onClick={retry}>Try again</button>
          </div>
        )}
        {!data && loading && (
          <div className="loading-state">
            <div />
            <div />
            <div />
            <p>Crunching the numbers. No cover letter required.</p>
          </div>
        )}
        {data && !error && (
          <div
            className={
              loading ? "dashboard-content updating" : "dashboard-content"
            }
            aria-busy={loading}
          >
            <Pipeline groups={data.pipeline} total={data.kpis.opportunities} />
            <div className="evidence-spread" id="activity">
              <Activity activity={data.activity} />
              <aside className="metrics-aside" aria-labelledby="metrics-title">
                <h2 id="metrics-title">Submission metrics</h2>
                <p>Dates verified. Definitions included.</p>
                <Kpis values={data.kpis} />
              </aside>
            </div>
            {(data.quality.records > 0 ||
              data.quality.missingFilterDates > 0) && (
              <details className="quality">
                <summary>
                  <span className="quality-icon">!</span>Data quality:{" "}
                  {data.quality.records} flagged records
                  {data.quality.missingFilterDates
                    ? ` · ${data.quality.missingFilterDates} excluded for missing filter dates`
                    : ""}
                  <span className="quality-link">Review notes</span>
                </summary>
                <p>
                  Conflicting records are excluded from affected submission
                  metrics. Issue counts can overlap.
                </p>
                <ul>
                  {data.quality.issues.map((i) => (
                    <li key={i.label}>
                      {i.label}: <strong>{i.count}</strong>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            <Geography
              groups={data.geography}
              total={data.kpis.submitted}
              selected={filters.country}
              onSelect={(country) =>
                setFilters({ ...filters, country: country || undefined })
              }
            />
            <div className="distribution-grid">
              <Distribution
                title="Role distribution"
                description="Where the skills might fit · submissions"
                groups={data.roles}
                total={data.kpis.submitted}
              />
              <Distribution
                title="Application sources"
                description="Where the opportunities started · submissions"
                groups={data.sources}
                total={data.kpis.submitted}
                color="#59799a"
              />
              <PriorityBreakdown
                groups={data.tiers}
                total={data.kpis.submitted}
              />
            </div>
            <Panel
              title="Worth a follow-up"
              description="Valid follow-up dates for active applications in this cohort."
              className="followup"
            >
              <div className="followup-grid">
                <div>
                  <span className="followup-label">
                    <i className="overdue-dot" />
                    Overdue
                  </span>
                  <strong>{data.followups.overdue}</strong>
                  <p>Before {data.today}</p>
                </div>
                <div>
                  <span className="followup-label">
                    <i className="due-dot" />
                    Due today
                  </span>
                  <strong>{data.followups.due}</strong>
                  <p>Today might be the day.</p>
                </div>
                <div>
                  <span className="followup-label">
                    <i className="upcoming-dot" />
                    Upcoming
                  </span>
                  <strong>{data.followups.upcoming}</strong>
                  <p>After {data.today}</p>
                </div>
                <p className="followup-note">
                  A gentle nudge, not a crystal ball.
                  <br />
                  Calculated from dates and current status, never stored
                  spreadsheet flags.
                </p>
              </div>
            </Panel>
          </div>
        )}
        <Explorer />
        <Methodology />
        <footer>
          <span>
            Peak Unemployment<span className="wordmark-dot">.</span>
          </span>
          <p>Built with data. Sustained by optimism.</p>
          <a href="#overview">Back to top</a>
        </footer>
      </main>
    </>
  );
}
