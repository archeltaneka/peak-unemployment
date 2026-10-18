# Hiring Gauntlet simplification

On `feat/v1-dashboard`, removed checkpoint buttons, tooltips, selection state and the details panel. All eight route taglines are now inline. Hover artwork motion remains. The route highlights through the furthest positive current-status count among Discovered–Offer, using the existing filtered cohort. Rejected and Unknown never extend it, and missing/empty/Discovered-only data produces no highlighted connecting segments. The route remains explicitly labeled as typical ordering rather than observed history.

Each highlighted segment reveals once in 220ms sequence (maximum 1540ms), on desktop and mobile. The sequence restarts only when the endpoint changes. Reduced motion displays the completed highlight without animation.

## Verification

- `bun run check`: 77 tests across nine files, strict TypeScript and production build passed. The existing Plotly chunk-size advisory remains.
- Added endpoint cases for all eight stages, later zero counts, missing data, terminal-only cohorts, gaps and global-filter changes. Component tests verify inline copy, current counts/shares, removed interactions and the Recruiter Screen endpoint.
- Headless Chromium with synthetic responses: desktop 1440px and mobile 390px showed no page overflow or tagline/count overlap. Eight inline taglines, no journey buttons/tooltips/details, retained hover transforms, sequential reveal styles, endpoint changes (Offer, Applied, Recruiter Screen, Rejected, Discovered) and static reduced-motion highlight passed.
- Local ignored screenshot evidence: `.impeccable/review/gauntlet-simplified/desktop.png` and `mobile.png`. Both show the Recruiter Screen endpoint.

No Worker analytics, API contracts or global filter behavior changed. No dependencies added. This supersedes the detail-panel and tooltip behavior documented in the October 17 verification note.
