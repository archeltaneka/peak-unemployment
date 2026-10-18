# Hiring Gauntlet verification

Scope: Application Journey only, on `feat/v1-dashboard`. The user approved direct SVG implementation of the two-row board and accessible detail panel. Existing Worker aggregation, shared API contracts, global filters, and unrelated dashboard sections are unchanged.

## Checks

- `bun run check`: 65 tests passed across nine files, strict TypeScript passed, production build passed. The pre-existing Plotly chunk-size advisory remains.
- New journey tests cover interactive stage rendering, country/status/date-filtered counts and denominators, zero-count stages, empty cohorts, and retention of submission conflicts in snapshots without adding them to submitted metrics.
- Headless Chromium checks at 1440, 1024 and 390px: no horizontal page overflow or JavaScript errors. Keyboard activation focuses details; Escape closes details and restores the trigger. Pointer-only tooltips dismiss with Escape even when focus is elsewhere. If filtering removes the selected Unknown trigger, closing details focuses the journey heading.
- An open Applied detail panel updates to zero of one opportunities when the global filter changes to Offer. Empty cohorts retain all eight checkpoints without fabricated percentages. Reduced motion disables the entrance animation.
- Browser responses used explicitly synthetic fixtures generated through the existing normalization, filtering and aggregation functions. No private records were captured. This is local UI verification, not production deployment or source-data accuracy verification.

## Design review

A separate Impeccable finish reviewer inspected desktop/tablet/mobile captures, details, and source. The initial review requested mobile label spacing, pointer-tooltip Escape handling, and a missing-trigger focus fallback. The final verdict scored all three resolved and approved shipping after checks and documentation. Detector findings were advisory component palette/type additions, documented in the journey specification.

Captures are ignored local artifacts under `.impeccable/review/gauntlet/`. Artwork is authored SVG source in `src/charts/CheckpointArt.tsx`; no generated raster assets or graph libraries were added. The approved direction contract is `.impeccable/surfaces/src-charts-pipeline-tsx.md`.
