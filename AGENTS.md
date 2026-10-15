# AGENTS.md — Peak Unemployment

## Project purpose

Peak Unemployment is a lightweight, public-facing analytics dashboard built around a personal job application pipeline.

The project is a Data Science / Product Analytics portfolio piece.

Prioritize analytical correctness, privacy, maintainability, and clear visual communication.

## Technology conventions

- Use Bun exclusively for package management and scripts.
- Frontend: React, TypeScript, Vite, Tailwind CSS.
- Visualizations: Plotly.js.
- Backend: Cloudflare Workers.
- Data source: Google Sheets.
- Tests: Vitest.
- Use strict TypeScript.
- Prefer native platform features over unnecessary dependencies.
- Do not introduce additional backend frameworks, databases, ORMs, or microservices without explicit approval.

## Architecture

- Google Sheets is the single persistent source of truth.
- The Cloudflare Worker handles authentication, data retrieval, validation, aggregation, and caching.
- The frontend consumes sanitized API responses.
- Keep business logic separate from React components.
- Prefer small, pure, testable functions.
- Keep deployment and local development simple.

## Data integrity

- Never invent missing values.
- Never treat missing dates as zero.
- Never assume an unanswered application is rejected.
- Treat Status as the current state, not historical stage data.
- Do not fabricate recruitment transitions or conversion funnels.
- Rejected is a terminal outcome, not a sequential stage.
- Use consistent metric definitions and denominators.
- Flag inconsistent records rather than silently correcting them.
- Preserve calendar-date semantics and avoid timezone-related date shifts.

## Privacy and security

- The Google Sheet is private.
- Never expose service-account credentials or secrets.
- Never return raw private spreadsheet records through public endpoints.
- Never expose Notes, private URLs, recruiter contact information, or unreviewed individual application details.
- Use aggregated live data and sanitized demo records.
- Never commit raw CSV exports or credentials.
- Keep production secrets in Cloudflare Worker secrets.
- Review API responses for potential sensitive-data leakage.

## Frontend guidelines

- Build a clean, responsive, accessible analytics interface.
- Prefer meaningful visualizations over decorative complexity.
- Provide readable labels, tooltips, and chart alternatives.
- Use consistent colors for recruitment statuses.
- Keep animations minimal.
- Distinguish live data from demo data.
- Support empty, loading, and error states.

## Testing and quality

- Write unit tests for analytics calculations and date handling.
- Test missing, invalid, and inconsistent records.
- Run tests, type checks, and production builds before declaring work complete.
- Fix relevant failures rather than ignoring them.
- Do not remove tests to make the build pass.

## Scope discipline

This is a small side project.

Do not overengineer.

Prefer the simplest correct implementation.

Avoid speculative features, premature abstractions, unnecessary infrastructure, and unrelated refactoring.

## Documentation

Keep README.md updated with:

- Project overview
- Technology stack
- Local setup
- Google Sheets configuration
- Environment variables
- Testing commands
- Deployment instructions
- Data privacy considerations

Document important analytical assumptions and limitations.

## Agent workflow

Before implementation:

1. Inspect existing repository files.
2. Identify the smallest viable change.
3. Explain significant architectural decisions.

During implementation:

1. Make focused changes.
2. Preserve existing conventions.
3. Add tests for meaningful analytics logic.
4. Avoid unrelated modifications.

After implementation:

1. Run relevant checks.
2. Summarize changes.
3. Report remaining limitations.
4. Identify any manual configuration required.

Never claim functionality has been verified unless the relevant checks actually ran successfully.

## V1 implementation conventions

- Use `bun run check` before reporting completion; it runs Vitest, strict TypeScript, and the production build.
- `worker/` owns private source data, normalization, and aggregation. Never import it into `src/`.
- Shared API contracts live in `src/types/dashboard.ts`; only reviewed demo records may enter the frontend.
- Public dimensions must use the reviewed taxonomies in `worker/schemas.ts`. Unrecognized source labels become Unknown; never echo arbitrary sheet cells.
- Use date-only ISO strings and an explicit reporting timezone. Weekly buckets start Monday.
- Cache source rows only in Worker memory. Never persist private rows in the public Cache API.
- Production live mode must fail closed on missing credentials; never silently substitute demo data.

## Local commands and source contract

- `bun run dev` runs Vite and the Worker together; copy `.dev.vars.example` to `.dev.vars` for synthetic local mode.
- `bun run preview` exercises the built Worker locally. Never publish the Worker output directory as static assets.
- Production Wrangler configuration defaults to `DATA_MODE=live`; missing credentials must return a generic 503.
- Demo reporting date is fixed at 2026-10-15 for reproducible examples and must stay visibly labeled.
- Source date cells must be formatted as ISO `yyyy-mm-dd`; never guess regional date formats.
- Plotly uses a custom bar/scatter/scattergeo bundle in `src/charts/plotly.ts`; keep map topology and fonts self-hosted.
- Application Explorer controls are independent of the live aggregate cohort and operate only on the reviewed synthetic JSON fixture.
