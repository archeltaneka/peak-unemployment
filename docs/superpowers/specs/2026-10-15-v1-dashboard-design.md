# Peak Unemployment V1 — proposed design

Status: proposed for review; implementation has not started.

## Purpose and scope

A public Data Science / Product Analytics portfolio dashboard for a private,
manually maintained job application tracker. Tagline: “Because apparently even
unemployment needs KPIs.” Deliver all nine requested dashboard sections, six
global filters, a sanitized demo explorer, a Sheets-backed Worker API, tests,
and setup documentation. Keep this a single small application without a database,
user accounts, historical transition reconstruction, or additional services.

## Architecture

Use Bun, React, strict TypeScript, Vite, Tailwind, Plotly with react-plotly.js,
Cloudflare Workers, and Vitest. One Worker deployment serves built static assets
and handles GET /api/health and GET /api/dashboard. API routes must never fall
through to the frontend's SPA fallback.

The alternative of separate frontend hosting adds deployment and CORS work;
client-side Sheets access violates the privacy boundary. Prefer the single Worker.

worker/sheets.ts owns a small data-access interface with Sheets and synthetic CSV
implementations. worker/schemas.ts owns source types and reviewed public label
taxonomies. Pure normalization, dates, filtering, and aggregation functions stay
under worker/. Shared response contracts live in src/types/dashboard.ts. No
frontend import may reach worker/ or private source files.

The Sheets adapter uses a service-account JWT signed with Web Crypto and the
read-only Sheets scope. Tokens and source rows have bounded in-memory caches;
private rows never enter the public Cache API. Cache keys include source identity.
Public responses contain only constructed aggregate objects, reviewed labels,
and numeric quality counts. Raw errors, source rows, sheet identifiers, URLs,
company names, notes, and credentials are never returned or logged.

Development defaults to an explicitly labeled synthetic CSV fixture. Production
live mode requires configured credentials and fails closed. An explicit demo
deployment remains possible; it must never masquerade as live data.

## Analytical contract

- Preserve each source row. Flag duplicate-looking rows without deduplication.
- Recognize the nine requested statuses; retain missing/unrecognized states as
  Unknown. Public dimensions use reviewed taxonomies, never arbitrary cell text.
- Accept documented calendar-date formats strictly; reject impossible dates.
  Use date-only ISO strings internally. Determine today in the configured IANA
  reporting timezone, default Australia/Melbourne; weeks start Monday.
- A valid, nonfuture Date Applied is submission evidence. Pre-submission status
  with an applied date, post-submission status without one, invalid submission
  dates, and an applied date before a valid found date are conflicts. Affected
  records stay in opportunity/status counts but are excluded from submission,
  application activity, active pipeline, and follow-up metrics.
- A valid applied date with Unknown status counts as submitted when no date
  conflict exists, but is not assigned an active or terminal outcome.
- Total opportunities counts all filtered rows. Submitted counts eligible rows.
  Active counts eligible Applied, Recruiter Screen, Interview, Technical, Final.
  Current interview pipeline counts eligible Recruiter Screen through Final.
  Offers and rejections count eligible rows currently in those respective states.
- The recruitment snapshot counts current statuses across filtered opportunities,
  including Unknown, with Rejected separate. It is not a conversion funnel.
- Geographic, role, source, and priority charts count eligible submissions and
  disclose that denominator. Unknown categories remain visible. Geographic
  records without reviewed coordinates appear in the ranked table, not on the map.
- Follow-ups require eligible active applications and a valid follow-up date.
  Overdue means before today; due means today; upcoming means after today.
  Stored Days Since Applied and Follow-up Flag are ignored.

## Filters and activity

Global filters: inclusive date range, country, role type, source, tier, and current
status. Date basis is visibly selectable between Date Applied (default) and Date
Found. With no date bounds, missing dates do not remove opportunities. When a
date bound is set, rows lacking a valid selected-basis date are excluded and the
number is disclosed. All aggregate sections use the same filtered cohort.

Activity uses eligible Date Applied values, regardless of the cohort's filter
basis. The UI explains this distinction. Fill intervening zero days, support
daily/weekly/monthly periods and cumulative counts. Daily mode has a trailing
seven-calendar-day average using actual eligible history before the display
window where available; incomplete observation windows are labeled. Cumulative
counts start at the selected display window, clearly labeled. Mark any bucket
clipped by the display boundaries or reporting date as partial. Return empty
states without inventing a reporting window for a dataset with no usable dates.

Country clicks apply the global country filter. Public query parameters are
validated against allowed keys, calendar dates, and reviewed dimensions. Reject
invalid or excessive ranges with generic client errors and bound generated
calendar series to prevent unbounded work.

## Interface proposal

Operate-mode dashboard: neutral background, readable typography, restrained teal
accent, stable status colors, subtle borders, minimal animation. A compact title
and data provenance indicator precede the filters and six KPIs. Activity receives
the widest chart area, followed by the current snapshot and country map/table,
distribution charts, follow-ups, and demo explorer. No decorative hero or fake
trend deltas. Light/dark mode is optional after required behavior is complete.

Plotly charts resize with their containers and load lazily where practical.
World bubbles use area scaling; the country table is always available. Supply
accessible tabular alternatives for charts and keyboard-operable controls.
Keep map topology assets local when practical to avoid a runtime CDN dependency.

Explorer uses only reviewed, fictional records, includes search, sorting, and
filters, and has its own unmistakable Demo data label. Global live filters do not
silently constrain the separate demo dataset; explorer controls are local.

Loading, retryable error, no-data, and no-filter-match states are required.
Quality warnings report aggregate issue counts without private examples.
Tooltips and visible methodology explain KPI definitions and snapshot limitations.

## Verification and delivery

Use unit tests for normalization, strict date parsing, submission conflicts,
active counts, all filter dimensions, Monday weeks, partial months, zero days,
moving averages, geography, follow-ups, duplicates, empty inputs, and timezone
boundaries. Add API privacy tests with sensitive sentinel values, malformed
upstream data, absent live credentials, and mocked Sheets authentication/retrieval.

Verify Bun installation, local frontend/API startup, demo interactions, responsive
desktop/mobile rendering, country filtering, and accessible alternatives. Run
bun run check covering Vitest, strict TypeScript, and production build. A mocked
Sheets test does not establish that real credentials work: live access remains
explicitly unverified unless valid credentials are supplied securely.

README documents commands, metric definitions, known limitations, CSV format,
service-account creation, read-only sheet sharing, Worker secrets, reporting
timezone, caching, deployment, and privacy. Ignore local secrets, raw private
exports, build artifacts, and local Worker state. Preserve existing AGENTS.md
instructions and add only concrete implementation conventions when needed.

## Compatibility concerns and manual configuration

Confirm current Cloudflare/Vite integration and Plotly packaging against official
documentation during implementation. Plotly bundle size and geographic topology
loading need explicit verification. The user must enable the Sheets API, create
a service account, share the sheet as Viewer, and supply Worker secrets before
live access can be exercised. Source dates must use a documented format; arbitrary
locale guessing is deliberately unsupported. Aggregates can describe small
cohorts; this design does not promise statistical anonymity.
