# Peak Unemployment

[![Live site](https://img.shields.io/badge/Live_site-Visit_dashboard-2563EB?style=flat)](https://peak-unemployment.archeltaneka.workers.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-22A06B?style=flat)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/archeltaneka/peak-unemployment?style=flat)](https://github.com/archeltaneka/peak-unemployment/commits)
[![Repository size](https://img.shields.io/github/repo-size/archeltaneka/peak-unemployment?style=flat)](https://github.com/archeltaneka/peak-unemployment)

**Because apparently even unemployment needs KPIs.**

A public job application analytics dashboard and Product Analytics / Data Science portfolio project. Google Sheets stays private; the browser receives aggregates and the approved fields shown in the Live Application Explorer. Explorer reads company, role, country, source, tier, current status and application date through the Worker.

Public site: [peak-unemployment.archeltaneka.workers.dev](https://peak-unemployment.archeltaneka.workers.dev).

## Stack and architecture

[![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)](https://bun.sh/)
[![React](https://img.shields.io/badge/React-149ECA?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Strict TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0891B2?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Plotly.js with react-plotly.js](https://img.shields.io/badge/Plotly.js-3F4F75?style=flat)](https://github.com/plotly/react-plotly.js)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?style=flat&logo=cloudflareworkers&logoColor=white)](https://developers.cloudflare.com/workers/)
[![Google Sheets API](https://img.shields.io/badge/Google_Sheets_API-188038?style=flat&logo=googlesheets&logoColor=white)](https://developers.google.com/workspace/sheets/api)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat&logo=vitest&logoColor=white)](https://vitest.dev/)

One Cloudflare Worker serves the frontend and `/api/*`. There is no database, account system, or secondary persistent data store.

- `worker/` — CSV/Sheets access, private row validation, normalization, filtering, aggregation, and API routing.
- `src/types/dashboard.ts` — public aggregate contracts. Frontend code never imports `worker/`.
- `src/components/`, `src/charts/`, `src/pages/` — responsive UI, chart alternatives, and application explorer.
- `data/demo/applications.csv` — fictional source fixture, bundled into the Worker only.
- `data/demo/explorer.json` — legacy fictional fixture; the Explorer API now uses the configured source in both modes.
- `tests/` — calendar, analytics, source/authentication, public API privacy, and client race-condition tests.

## Run locally

Install [Bun](https://bun.sh/) (tested with 1.4.2), then:

```sh
bun install
cp .dev.vars.example .dev.vars
bun run dev
```

Open the localhost URL printed by Vite, normally `http://127.0.0.1:5173`. The Cloudflare Vite plugin runs the Worker alongside the frontend in the Workers runtime. Local demo mode needs no Google or Cloudflare credentials.

**Demo data uses a fixed reporting date of 2026-10-15.** This makes the fixture and follow-up examples reproducible and is labeled in the UI. Live mode uses today's date in the reporting timezone.

```sh
bun run test       # Vitest
bun run typecheck  # strict TypeScript
bun run build      # client + Worker production build
bun run check      # all three checks above
bun run preview    # build and run the built Worker locally
```

The initial frontend is separate from the lazy-loaded chart library. The Plotly bundle registers only bar, scatter, scattergeo, and pie traces. Fonts and map topology are self-hosted; charts do not request a third-party CDN at runtime.

## Portfolio and source links

The header, footer, and Methodology section use `src/lib/externalLinks.ts` as
the single configuration for the public portfolio and GitHub URLs. Update
`EXTERNAL_LINKS.portfolio` or `EXTERNAL_LINKS.github` there and rebuild to change
destinations. All external links open in a new tab with `noopener noreferrer`.

## Google Sheets setup

1. Create or choose a project in [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Sheets API** under APIs & Services → Library.
3. Under IAM & Admin → Service Accounts, create a service account. No project-wide IAM role is needed just to read a shared sheet.
4. Create a JSON key for that service account. Store it securely outside this repository. Use its `client_email` and `private_key` values below; never commit or paste the entire key into frontend files.
5. In the private Google Sheet, share the spreadsheet with the service account's email as **Viewer**. Do not enable public link sharing.
6. Obtain the spreadsheet ID from its URL, and choose the tab/range, for example `Applications!A1:O10001`. Treat the ID and range as private configuration.
7. Set the date columns to the custom date display format **yyyy-mm-dd**. The integration requests formatted values and accepts ISO dates only; it deliberately does not guess ambiguous local date formats.

Row 1 must contain these exact headers, in any order:

```text
Company, Role, City, Country, Role Type, Source, Job URL,
Date Found, Date Applied, Tier, Status, Follow-up Date,
Days Since Applied, Follow-up Flag, Notes
```

A header-only sheet is a valid empty dataset. Completely empty rows are skipped. Invalid date cells become missing/invalid dates with aggregate quality warnings. Missing/duplicate headers and structurally malformed data produce a generic unavailable response. Source size is bounded to 10,000 data rows and 5 MB; use a bounded range and do not silently truncate a larger tracker.

### Local live mode

Edit the ignored `.dev.vars` file:

```dotenv
DATA_MODE=live
REPORTING_TIMEZONE=Australia/Melbourne
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-private-spreadsheet-id
GOOGLE_SHEET_RANGE="Applications!A1:O10001"
```

The private key accepts real newlines or escaped `\n`. Restart the dev server after configuration changes. Never expose these variables using Vite's `VITE_` prefix.

The Worker signs an RS256 service-account JWT with Web Crypto, exchanges it for an OAuth token, and requests `https://www.googleapis.com/auth/spreadsheets.readonly`. See [Google's server-to-server authentication documentation](https://developers.google.com/identity/protocols/oauth2/service-account).

## Deploy to Cloudflare

The checked-in Wrangler configuration defaults to **live**, not demo. `.dev.vars` is local configuration, not a replacement for deployed secrets. The build may copy it into the ignored Worker output for local preview; never publish `dist/` manually or use the Worker output as a public asset directory. The plugin publishes only `dist/client` as static assets.

```sh
bunx wrangler login
bunx wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
bunx wrangler secret put GOOGLE_PRIVATE_KEY
bunx wrangler secret put GOOGLE_SHEET_ID
bunx wrangler secret put GOOGLE_SHEET_RANGE
bun run check
bun run deploy
```

Run each `secret put` command separately. The argument after `put` is the secret's name; enter its actual value at the interactive prompt, rather than appending it to the command.

| Secret | Value to enter |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | The service-account JSON key's `client_email` value. |
| `GOOGLE_PRIVATE_KEY` | Only the `private_key` value, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`. Real newlines or literal `\n` are accepted. |
| `GOOGLE_SHEET_ID` | Only the spreadsheet ID between `/d/` and `/edit` in its URL. |
| `GOOGLE_SHEET_RANGE` | The actual tab name and bounded range, such as `Applications!A1:O10001`. Tab names with spaces use A1 notation such as `'Job Applications'!A1:O10001`. |

Do not include the JSON field labels, the entire JSON key file, or surrounding double quotes in prompted values. The surrounding double quotes in the `.dev.vars` example are file syntax, not part of the secret. For the private key, you can also securely pipe a PEM file into the command. Keep files containing credentials outside this repository. Rotate/revoke service-account keys when no longer needed.

To edit secrets through the Cloudflare dashboard, open **Workers & Pages → peak-unemployment → Settings → Variables and Secrets**. After updating values, choose **Deploy** to activate them. **Save version** alone does not activate the saved version; deploy that version separately. See [Cloudflare's secrets documentation](https://developers.cloudflare.com/workers/configuration/secrets/).

If Wrangler needs the Worker to exist before uploading secrets, create it in the Cloudflare dashboard first, or deploy once before adding secrets. An unconfigured live deployment returns 503 for both `/api/dashboard` and `/api/explorer`; neither endpoint substitutes demo data.

`REPORTING_TIMEZONE` is a non-secret Wrangler variable; set it to your reporting IANA timezone. To deliberately publish a **demo-only** version, change `DATA_MODE` to `demo` in `wrangler.jsonc`, then deploy. The public UI will label it synthetic. Return that setting to `live` for live data.

Static assets and the API share one origin. `/api` and `/api/*` always run the Worker first, including browser navigation; unknown API routes return JSON 404 instead of the SPA. See the [Cloudflare React SPA + API guide](https://developers.cloudflare.com/workers/vite-plugin/tutorial/).

### Verify and troubleshoot deployment

After deployment, open the public URL printed by Wrangler. Confirm the live/demo label, dashboard metrics, Explorer, charts, and filters load. Check `/api/dashboard` and `/api/explorer` return HTTP 200 with the intended mode. `/api/health` only confirms Worker liveness; it does not validate credentials or spreadsheet access.

If the site loads but the dashboard API returns **503**, check:

1. The updated secrets belong to this Worker and their version has been deployed. A listed secret name does not confirm that its value is valid.
2. The private key has both PEM markers and no surrounding double quotes, and belongs to the configured service account.
3. The Google Sheets API is enabled in the service account's Google Cloud project, and the spreadsheet is shared with that exact service-account email as Viewer.
4. The spreadsheet ID and tab/range are correct. The range starts at the header row and includes all 15 required columns listed above, even if their data cells are empty.
5. `DATA_MODE` is exactly `live` or `demo`, and `REPORTING_TIMEZONE` is a valid IANA timezone, such as `Australia/Melbourne`.

The public API deliberately returns a generic unavailable message without exposing Google errors or private source data.

If a newly deployed `workers.dev` hostname reports **ERR_SSL_VERSION_OR_CIPHER_MISMATCH**, confirm its route is enabled under **Settings → Domains & Routes**. Certificate activation can be delayed; retry after a short wait. A TLS handshake failure occurs before the Worker handles a request, so changing Google secrets cannot resolve it. See [Cloudflare's TLS troubleshooting guidance](https://developers.cloudflare.com/ssl/troubleshooting/version-cipher-mismatch/).

For later code changes, run `bun run check` followed by `bun run deploy`. Spreadsheet edits do not require deployment; successful source reads are cached for 60 seconds in Worker memory.

## API and caching

- `GET /api/explorer` — approved application fields from the configured source, with live/demo provenance, reporting date and source refresh time.
- `GET /api/health` — Worker liveness only; does not test Google credentials.
- `GET /api/dashboard` — reviewed aggregate statistics, quality issue counts, filter choices, source mode, reporting date, and source refresh time.

Optional query parameters: `from`, `to`, `dateBasis=applied|found`, `country`, `roleType`, `source`, `tier`, `status`. Dates are inclusive ISO calendar dates. Dimensions must match the reviewed choices. Unknown parameters, duplicate keys, invalid categories/dates, reversed dates, and explicitly requested spans longer than 3,660 days return 400. Activity series are bounded to the latest 3,661 days; truncation is disclosed. Full-cohort KPIs remain unchanged by that display limit.

Source rows are cached for **60 seconds in Worker isolate memory**, keyed by source configuration. Concurrent reads share a pending fetch; expired data is not silently served after a source error. OAuth tokens are cached until one minute before expiry. Cold isolates fetch again, so this is not a global cache or a request-rate guarantee. Source rows never enter Cloudflare's public Cache API, KV, or another persistent store. API responses use `Cache-Control: no-store`; frontend assets retain platform caching.

Missing configuration, Google errors, invalid source structure, or invalid timezone configuration return a generic 503. No upstream response text or credentials are returned or logged by application code.

## Metric definitions

All aggregate panels share the global filtered cohort. With no date bounds, missing dates do not remove opportunities. With a date bound, a row needs a valid date in the selected date basis; the number excluded for missing dates is disclosed. A **Date Found** cohort may have submission activity after the found-date end because activity always plots **Date Applied**.

Submission eligibility requires a valid, nonfuture Date Applied and no submission conflict. Conflicts include:

- Discovered/Preparing with a Date Applied.
- A known post-submission status without a usable Date Applied.
- Date Applied before a valid Date Found, or in the future.

Unknown status with a valid, consistent applied date counts as submitted but cannot be assigned an active or terminal outcome. Invalid dates are never converted to zero. A missing/invalid Date Found is flagged and does not by itself invalidate an otherwise eligible submission. Quality issue counts can overlap.

| Metric                             | Definition                                                                                                                                                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Total opportunities                | All records in the filtered cohort, including conflicts and pre-submission states                                                                                                                                    |
| Submitted applications             | Eligible submissions in that cohort                                                                                                                                                                                  |
| Active applications                | Eligible records currently Applied, Recruiter Screen, Interview, Technical, or Final                                                                                                                                 |
| Current interview pipeline         | Eligible records currently Recruiter Screen, Interview, Technical, or Final                                                                                                                                          |
| Offers                             | Eligible records currently Offer                                                                                                                                                                                     |
| Rejections                         | Eligible records currently Rejected; never inferred from silence                                                                                                                                                     |
| Current status route               | All filtered opportunities by current status, including pre-submission states, conflicts, and Unknown; Rejected is shown separately. Station shares divide by all filtered opportunities, not submitted applications |
| Country / role / source / priority | Eligible submissions; percentages divide by the filtered submitted count                                                                                                                                             |
| Follow-ups                         | Eligible active applications with valid Follow-up Date: before today = overdue, today = due, after today = upcoming                                                                                                  |

Overview also includes **Submitted today**, **Daily average this week**, and **Daily average this month**. These count eligible submissions within the same selected cohort using Date Applied, even when the cohort uses Date Found. “Today” is the API reporting date in the configured reporting timezone (fixed at 2026-10-15 in demo mode). The week-to-date numerator covers Monday through today; the month-to-date numerator covers the first of the month through today. Each average divides by elapsed calendar days **including today and days with zero recorded submissions**, not just days with applications. Today is partial. Filters affect the numerator but do not shorten the calendar denominator. An empty cohort returns zero recorded submissions and zero averages. Averages retain full precision in the API and display up to two decimal places; they are not rolling or completed-period averages.

Weeks start Monday. Activity includes intervening zero days. Today and buckets clipped by display boundaries are marked partial. Cumulative totals start at the display window. In daily mode, the trailing seven-calendar-day average is available only after seven observed days; it retains earlier applied-date history outside the displayed applied-date window, with all other cohort filters preserved. There is no invented observation history before the earliest eligible application.

`Days Since Applied` and `Follow-up Flag` are ignored. Possible duplicates are flagged using Company + Role + Date Applied + Date Found (trimmed, case-insensitive), but never removed. This heuristic does not establish identity.

Application Priority Breakdown is a donut chart of eligible submissions after all global filters, with fixed tier colors and an accessible count/share table. Its denominator is submitted applications, not all source rows; a historical CSV snapshot need not match current live counts.

## Taxonomies and privacy

Only reviewed public categories in `worker/schemas.ts` may appear in live responses. Matching ignores surrounding whitespace and letter case. Unknown/missing values become **Unknown** rather than being echoed. Priority tiers are `A`, `B`, `C`, and Unknown. `Tier A`, `Tier B`, and `Tier C` are accepted case-insensitively, with surrounding or repeated whitespace ignored. Missing and unrecognized values (including legacy numeric values) remain Unknown. Source headers are matched case-insensitively after trimming and collapsing whitespace; duplicate normalized headers are rejected. Synthetic demo tiers use the same A/B/C contract. Review and extend the country/role/source/tier allowlists deliberately if your tracker uses different categories; do not automatically expose arbitrary sheet cells. Country coordinates are approximate country centers, not applicant locations.

`/api/dashboard` is aggregate-only. `/api/explorer` publishes only Company, Role, Country, Source, Tier, Status and Date Applied, plus a snapshot-local row ID. Company and role are public text; only put content intended for publication in these columns. Notes, City, Job URL, contacts, follow-up dates, spreadsheet identifiers, credentials and all other source fields stay private. Category values use reviewed taxonomies; missing or invalid dates remain null and are never interpreted as “not submitted.”

Explorer controls are independent of aggregate filters. Both endpoints share the same 60-second Worker-memory source cache and return `Cache-Control: no-store`. Explorer loads independently and offers retry on errors. Live mode fails closed on source/configuration errors; it never substitutes fictional records. Demo mode uses the fictional CSV source with the fixed reporting date 2026-10-15. Explorer requires the same existing Sheet configuration as the aggregates; no new variables or columns are needed.

Aggregates, especially small filtered groups, are **not a statistical anonymity guarantee**. Do not use this public dashboard for sensitive datasets requiring minimum-count suppression. Source row and raw error logging is intentionally absent. Keep `.dev.vars`, `.env`, PEM keys, raw CSV exports, build artifacts, and `data/private/` out of Git.

## Limits and verification

- The Hiring Gauntlet orders current statuses; connectors do not show observed transitions. The filtered total includes opportunities not yet submitted. Checkpoints are read-only and do not filter the cohort or Explorer. Current status is not a stage history. No historical conversion funnel, Sankey, response rate, or inferred rejection is calculated.
- Dates must be ISO `yyyy-mm-dd`, within 2000–2100. Invalid cells are surfaced, not silently repaired.
- City detail, choropleth mode, and dark mode are optional scope and are not included in V1.
- Mocked service-account tests verify JWT signatures, read-only scope, token exchange, and Sheets retrieval. These checks do not establish production credential validity or underlying private-row accuracy. Verify the deployed APIs using the steps above. Only synthetic fixtures are committed.
- The project is not deployed automatically. Follow the manual deployment instructions above.

Tests cover missing/invalid dates, inconsistent submission states, unknown labels, outcomes, duplicates, zero days, partial periods, Monday weeks, timezone boundaries, filtering, follow-ups, source parsing, API privacy, cache source isolation, and stale browser requests.

Role distribution preserves the reviewed sheet labels `AI Engineer` and `ML Engineer` (separately from `Machine Learning Engineer`). Blank Role Type cells appear as `Not specified` and are flagged as missing; unreviewed nonempty categories still map to `Unknown`. New role categories must be added to `worker/schemas.ts` before publication.
