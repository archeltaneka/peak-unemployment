import { PriorityBreakdown } from "../charts/PriorityBreakdown";
import { useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import type { DashboardFilters } from "../types/dashboard";
import { Filters } from "../components/Filters";
import { Kpis } from "../components/Kpis";
import { Panel } from "../components/Panel";
import { Explorer } from "../components/Explorer";
import { Methodology } from "../components/Methodology";
import { cohortSummary, reportingTime } from "../lib/presentation";
import { CreatorLinks } from "../components/CreatorLinks";
import { Activity } from "../charts/Activity";
import { Pipeline } from "../charts/Pipeline";
import { Geography } from "../charts/Geography";
import { Distribution } from "../charts/Distribution";
export default function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateBasis: "applied",
  });
  const { data, loading, error, validationError, retry } =
    useDashboard(filters);
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
        <CreatorLinks className="mobile-creator-links" />
        <p className="brand-description">
          Tracking applications, rejections,
          <br />
          and questionable career decisions.
        </p>
        <nav aria-label="Main navigation">
          <a href="#overview">Overview</a>
          <a href="#journey">Current Status</a>
          <a href="#activity">Activity</a>
          <a href="#geography">Geography</a>
          <a href="#explorer">Explorer</a>
          <a href="#methodology">Methodology</a>
        </nav>
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
            <CreatorLinks className="desktop-creator-links" />
            {data && (
              <div className="data-provenance">
                <span
                  className={data.mode === "live" ? "live-badge" : "demo-badge"}
                >
                  {data.mode === "live" ? "Live aggregates" : "Demo aggregates"}
                </span>
                <small>
                  As of {data.today} · {data.timezone}
                  <br />
                  {data.mode === "demo"
                    ? "Fixed demo reporting date"
                    : "Source refreshed " +
                      reportingTime(data.fetchedAt, data.timezone)}
                </small>
              </div>
            )}
          </div>
        </div>
        {data && (
          <Filters
            filters={filters}
            options={data.options}
            onChange={setFilters}
            validationError={validationError}
          />
        )}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="request-status"
        >
          {validationError
            ? data
              ? `Date range not applied. Showing the last successful view: ${data.kpis.opportunities.toLocaleString("en")} opportunities. ${cohortSummary(data.filters)}.`
              : "Correct the date range to load application analytics."
            : loading
              ? data
                ? "Updating your view…"
                : "Loading application analytics…"
              : error
                ? "Dashboard could not be refreshed."
                : data
                  ? `${data.kpis.opportunities.toLocaleString("en")} opportunities in this view. ${cohortSummary(data.filters)}.`
                  : ""}
        </div>
        {error && (
          <div className="error-state" role="alert">
            <h2>Taking a Brief Pause.</h2>
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
            <section
              className="overview-metrics"
              aria-labelledby="metrics-title"
            >
              <h2 id="metrics-title">The Search at a Glance</h2>
              <p>
                Current counts. Submission metrics require valid dates and no
                submission conflicts.
              </p>
              <Kpis values={data.kpis} />
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
            </section>
            <Pipeline groups={data.pipeline} total={data.kpis.opportunities} />
            <div className="evidence-spread" id="activity">
              <Activity activity={data.activity} />
            </div>
            <p className="cohort-context">
              <strong>Aggregate view:</strong> {cohortSummary(data.filters)}.{" "}
              All charts below share these filters; Explorer is separate.
            </p>
            <Geography
              groups={data.geography}
              total={data.kpis.submitted}
              selected={data.filters.country}
              onSelect={(country) =>
                setFilters({ ...filters, country: country || undefined })
              }
            />
            <div className="distribution-grid">
              <Distribution
                title="Role Distribution"
                description="Where the skills might fit"
                groups={data.roles}
                total={data.kpis.submitted}
              />
              <Distribution
                title="Application Sources"
                description="Where the opportunities started"
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
              title="Worth a Follow-Up"
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
                  Calculated from dates and current status.
                </p>
              </div>
            </Panel>
          </div>
        )}
        <Explorer />
        <Methodology />
        <footer>
          <div className="creator-attribution">
            <p className="creator-name">Built by Archel Taneka</p>
            <p>
              <em>
                Still optimizing the job search. At least the dashboard works.
              </em>
            </p>
          </div>
          <CreatorLinks />
          <a className="back-to-top" href="#overview">
            Back to top
          </a>
        </footer>
      </main>
    </>
  );
}
