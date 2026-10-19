---
version: 1
slug: "src-charts-pipeline-tsx"
primary_target: "src/charts/Pipeline.tsx"
related_targets: ["src/charts/HiringGauntlet.css","src/charts/CheckpointArt.tsx"]
---

# Hiring Gauntlet

Scope: Application Journey only. Mode: Read, with read-only current-status comparison. Audience: portfolio visitors interpreting the current filtered job search. User approved direct SVG implementation.

## Direction contract

THESIS: A vintage recruitment board game whose checkpoints explain current status, never imply historical movement.

OWN-WORLD: Warm cream, navy outline illustrations, forest-green route, amber paperwork accents, muted-red rejection area. Retain the surrounding dashboard typography. Small consistent SVG objects, no raster assets.

STORY: Read the filtered total, inspect the eight current counts, read each cohort share; secondary taglines remain on desktop. Rejection and Unknown remain separate. Global filters refresh the same cohort denominator.

FIRST VIEWPORT: Title and filtered total above a four-by-two serpentine board. Top row reads left to right; bottom row returns right to left. Numbered checkpoints have an illustration, professional label, count and share. A separate rejection strip follows. Mobile becomes a compact vertical list with 88px minimum rows and 60×54px artwork, following the overview metrics. Snapshot semantics and the decorative route explanation appear before the counts. The route remains static and never highlights from current status data. Hover lifts artwork. Checkpoints have no click behavior, tooltips or details. Entrance is one short board reveal. Reduced motion disables entrance and hover transitions.

FORM: User-pinned board-game route; precisely scoped component replacement, no concept seed needed. Direct SVG build explicitly approved.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
