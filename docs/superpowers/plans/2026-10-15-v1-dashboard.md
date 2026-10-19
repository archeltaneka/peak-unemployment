# Peak Unemployment V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Deliver a working public analytics dashboard with a private Sheets data source and immediately usable synthetic demo mode.

**Architecture:** One Cloudflare Worker serves the Vite build and aggregate-only API. All source parsing, normalization, filtering, and analytics stay in worker/. The frontend shares only reviewed response types and an explicitly synthetic explorer fixture.

**Tech Stack:** Bun, React, strict TypeScript, Vite, Tailwind CSS, Plotly.js with react-plotly.js, Cloudflare Workers, Google Sheets API, Vitest.

**Spec:** [Approved design](../specs/2026-10-15-v1-dashboard-design.md)

## Global Constraints

- Bun exclusively for package management and scripts.
- Google Sheets is the only persistent source of truth; no database or user authentication system.
- Never import worker/ into src/ or return raw records from public endpoints.
- Only reviewed taxonomy values may enter public dimensions; unknown labels become Unknown.
- Preserve calendar-date semantics; reporting timezone defaults to Australia/Melbourne; weeks start Monday.
- Source rows are cached only in Worker memory; production live mode fails closed.
- Status is a snapshot, not stage history. Rejected is a terminal outcome, not a sequential stage.
- Preserve duplicate-looking records and flag them rather than silently deduplicating.
- Run bun run check before completion; never claim real Sheets access was verified without credentials.

## Review Focus

1. Free-text source values containing sensitive information must never leak through dimension labels or errors (Task 2 API sentinel tests).
2. A country selection followed by a rapid filter change must not render an older response over newer results (Task 3 request cancellation test).
3. A Date Found cohort must retain its distinct meaning while activity plots Date Applied, including applications after the cohort's found-date end (Task 1 cohort test).
4. A map topology fetch failure must leave a usable ranked country table and the rest of the dashboard intact (Task 3 fallback verification).
5. Zero matching rows and an empty source must display explicit empty states without NaN percentages, fabricated dates, or broken charts (Tasks 1 and 3).

## Task 1: Analytics contract and calendar-safe calculations

**Files:** package.json, bun.lock, tsconfig.json, vitest.config.ts, src/types/dashboard.ts, worker/schemas.ts, worker/dates.ts, worker/normalize.ts, worker/analytics.ts, worker/filters.ts, tests/analytics.test.ts, tests/dates.test.ts.

**Interfaces:**
- SourceRecord: string-valued fields corresponding to the supplied sheet headers.
- NormalizedRecord: reviewed dimensions, nullable ISO dates, current status, submission eligibility, quality issue codes; private identity fields remain Worker-only.
- DashboardFilters: optional from/to dates, dateBasis ('applied' or 'found'), country, roleType, source, tier, status.
- DashboardResponse: mode, reporting date/timezone, freshness, effective filters, reviewed filter options, KPIs, activity, snapshot, geographic/role/source/tier groups, follow-ups, numeric quality warnings.
- parseDate(value: string): string | null; todayInTimezone(now: Date, timezone: string): string.
- normalizeRecords(rows: SourceRecord[], today: string): NormalizedRecord[].
- buildDashboard(rows: NormalizedRecord[], filters: DashboardFilters, today: string): aggregate response data without source metadata.
- parseFilters(params: URLSearchParams): DashboardFilters; invalid requests throw a safe validation error.

- [x] Create minimal Bun/Vitest/strict-TypeScript configuration and install dependencies with Bun.
- [x] Write failing date tests: leap day accepted, impossible dates rejected, blank dates remain null, ISO dates retain their day, Melbourne midnight resolves correctly across UTC and daylight-saving boundaries.
- [x] Run bun run test -- tests/dates.test.ts; verify failures arise from missing behavior, then implement strict date parsing and timezone helpers.
- [x] Write failing analytics tests asserting: Preparing with Date Applied is not submitted; Applied without Date Applied is conflicted; eligible Rejected counts as submitted and rejected but not active; Unknown with valid submission counts as submitted but not active; future/inverted submission dates are conflicted.
- [x] Add tests for every filter, Date Found cohort behavior, duplicate preservation, unknown dimensions, missing selected-basis dates, and an empty dataset with zero metrics.
- [x] Add activity tests: Monday week buckets, month boundaries, zero days, partial periods, trailing seven-day mean, and cumulative counts beginning at the display window. Add grouping and due/today/overdue/upcoming follow-up tests with terminal outcomes excluded.
- [x] Run bun run test; implement the pure normalization/filter/aggregation functions until tests pass. Bound query windows and reject malformed filters.
- [x] Run bun run test and strict type checks; inspect metric definitions against the approved spec before moving on.

## Task 2: Private data access and Worker API

**Files:** worker/csv.ts, worker/sheets.ts, worker/index.ts, data/demo/applications.csv, wrangler.jsonc, .dev.vars.example, .gitignore, tests/source.test.ts, tests/api.test.ts.

**Interfaces:**
- DataSource.read(): Promise<SourceRecord[]>; implementations for synthetic CSV and Google Sheets.
- Worker Env: ASSETS binding, DATA_MODE, REPORTING_TIMEZONE, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID, GOOGLE_SHEET_RANGE.
- Worker fetch(request, env): Promise<Response> exposes GET /api/health and GET /api/dashboard; all other /api routes return JSON 404.
- Successful dashboard responses add mode and freshness to Task 1 aggregates; failures use stable public error codes without upstream details.

- [x] Check official Cloudflare Workers/Vite documentation and Google service-account/Sheets documentation for current configuration and authentication compatibility.
- [x] Write failing CSV tests for quoted commas/newlines, escaped quotes, missing required headers, uneven rows, and empty datasets. Write Sheets tests for token exchange, read-only scope, malformed responses, and generic upstream failures using injected/mocked fetch.
- [x] Implement CSV parsing and a synthetic fixture covering all statuses, unknown categories, multiple countries, and meaningful data quality cases. Never use private records as fixture material.
- [x] Implement service-account JWT signing using Web Crypto, OAuth exchange, and Sheets values retrieval; use bounded timeouts and in-memory token/row caching keyed to source configuration.
- [x] Write API tests proving missing live credentials return an error with no demo fallback, unsupported methods fail safely, invalid filters return 400, and unknown API routes never return index.html.
- [x] Add privacy sentinel tests with secrets in Notes, Company, URLs, arbitrary labels, and upstream error bodies; assert none appear anywhere in serialized public responses. Assert response fields are aggregate-only.
- [x] Implement Worker routing and source selection; add explicit synthetic demo mode. Set public response headers to avoid persisting private source rows or accidental intermediary caching of error details.
- [x] Run bun run test. Verify mocked Sheets retrieval, cache reuse, source isolation, and generic error behavior. Document that credentialed integration is still unverified.

## Task 3: Responsive dashboard and demo explorer

**Files:** index.html, vite.config.ts, src/main.tsx, src/pages/Dashboard.tsx, src/styles.css, src/components/{Filters,Kpis,Panel,DataTable,Explorer,Methodology}.tsx, src/charts/{Plot,Activity,Pipeline,Geography,Distribution}.tsx, src/hooks/useDashboard.ts, src/lib/{api,explorer}.ts, src/types/vendor.d.ts if needed, data/demo/explorer.json, public/world_110m.json, tests/explorer.test.ts, tests/client.test.ts.

**Interfaces:**
- useDashboard(filters: DashboardFilters) returns data/loading/error/retry and cancels superseded requests.
- Chart components consume only reviewed aggregate arrays from DashboardResponse.
- Explorer records are fictional display data imported from the reviewed JSON fixture, never fetched from Sheets.
- Explorer search/filter/sort operates locally and independently from global aggregate filters.

- [x] Carry the approved neutral/teal, compact analytics direction into PRODUCT.md and a surface brief through impeccable; resolve remaining design choices without expanding scope.
- [x] Configure Vite, Tailwind, React, Worker local development, and static asset serving. Confirm the local frontend can call the local Worker API.
- [x] Write failing tests for explorer search/filter/sort and request cancellation/stale response protection. Implement the small pure helpers and data-loading hook.
- [x] Build header/provenance, global filters with visible date basis, six KPI definitions, quality notices, loading, retry, and empty states. Use semantic controls and visible keyboard focus.
- [x] Build responsive activity visualization with daily/weekly/monthly controls, daily seven-day average, cumulative mode, partial-period labels, and an accessible table.
- [x] Build current-state snapshot with Rejected separated and Unknown visible. Add role, source, and tier distributions with explicit submitted-application denominators.
- [x] Build Plotly world bubbles with area scaling, local topology where practical, country click-to-filter, and a permanently available ranked table. Unknown geography stays in the table. Verify failure of the map does not disable the table or dashboard.
- [x] Build aggregate follow-up counts and the labeled synthetic explorer with independent search, filters, and sortable column controls.
- [x] Add methodology text explaining snapshot limits, eligibility conflicts, date basis, follow-up definitions, and the distinction between demo explorer and live aggregates.
- [x] Run tests and build, then smoke-test actual demo interactions at desktop and mobile widths. Optional dark mode or city breakdown only if required behavior is already complete.

## Task 4: Documentation and delivery checks

**Files:** README.md, AGENTS.md, package.json, .gitignore, PRODUCT.md, DESIGN.md, .impeccable/design.json and review artifacts as required by impeccable.

**Interfaces:** bun run dev starts the local application; bun run test runs Vitest; bun run typecheck checks strict TypeScript; bun run build builds deployment assets; bun run check runs tests, type checks, and production build; bun run deploy deploys when explicitly requested.

- [x] Document project purpose/stack, Bun setup, synthetic mode, CSV schema, Google Cloud service-account creation, Sheets API enablement, spreadsheet Viewer sharing, exact Worker secret commands, reporting timezone, and deployment commands.
- [x] Document KPI denominators, all date/conflict rules, quality warnings, aggregate privacy limits, caching behavior, and unverified real Sheets access. Keep secrets out of examples.
- [x] Preserve the existing AGENTS.md and add only implementation-specific commands or boundaries not already covered. Ignore secrets, private exports, Worker state, dependencies, and builds.
- [x] Run bun install and bun run check; fix relevant failures. Start the production-equivalent local Worker and verify health, dashboard, static routes, filters, and failure states.
- [x] Use impeccable's bounded desktop/mobile visual inspection, mechanical detector, and required independent finish review; apply material fixes and record the actual review scope.
- [x] Review frontend bundles and public API output for private sentinel strings/source imports. Run git diff --check and inspect changed files for accidental secret or raw-data additions.
- [x] Mark completed steps, report exact verification results, and list remaining manual service-account/Cloudflare configuration. Do not deploy or claim credentialed Sheets success without evidence.

## Recommended execution

Native execution in this session: the tasks share a small response contract and benefit from one implementer maintaining consistency. Use focused commits after verified milestones and one independent final review, plus impeccable's required design review. No extra parallel implementation agents are needed.

## Execution evidence

Implemented on feat/v1-dashboard. See ../../implementation/progress.md for verification and rulings. Live credentialed Sheets access and deployment are explicitly manual, not claimed verified. Changes are preserved in the working branch; no remote push or deployment performed.
