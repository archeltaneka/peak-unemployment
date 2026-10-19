---
target: application tracker dashboard
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/home/archel/Documents/Personal Projects/peak-unemployment/src/pages/Dashboard.tsx"
target_fingerprint: "sha256:33520959eb1ba51c2ae2897d63775bbe8d37547628789e21c0b9b7c99ecd3ccb"
target_path: /home/archel/Documents/Personal Projects/peak-unemployment/src/pages/Dashboard.tsx
timestamp: 2026-10-19T08-59-07Z
slug: src-pages-dashboard-tsx
closed: true
---
Method: dual-agent (A: /root/assessment_a · B: /root/assessment_b)

Scope: src/pages/Dashboard.tsx and associated UI. Source-backed review only: the browser runtime reported no available browser. No current desktop/mobile rendering or interactions were verified. Scores are provisional heuristic judgments.

The dashboard has a distinctive identity, but its personality currently communicates faster than its analytical meaning. Preserve the paper/navy editorial system; strengthen provenance, snapshot semantics, and the path to useful evidence.

Design specificity: Authored for this product. Illustrated hiring checkpoints, an application ledger, serif headlines, and restrained paper surfaces form a coherent identity. The main issue is interpretation, not generic styling.

| Heuristic | Score / 4 | Main finding |
|---|---:|---|
| System status | 2 | Loading feedback exists; successful refresh gives no result summary. |
| Match with real world | 2 | A progressing route represents current statuses, not historical movement. |
| Control and freedom | 3 | Aggregate reset exists; Explorer lacks its own clear-all. |
| Consistency | 2 | Explorer provenance copy conflicts with the supplied synthetic-only contract. |
| Error prevention | 3 | Constrained inputs and missing-data rules; date-range feedback needs review. |
| Recognition | 2 | Lower sections require remembering the selected cohort. |
| Efficiency | 2 | Useful filters/sorting; cohort state is not shareable. |
| Aesthetic restraint | 2 | Strong identity; the long illustrated board delays analytical evidence. |
| Error recovery | 3 | Retry and empty states exist; Explorer recovery copy is incomplete. |
| Help and documentation | 3 | Definitions and tables are substantial; critical caveats appear late. |
| Total | 24/40 | Acceptable; meaningful UX improvements needed. |

What works: The editorial identity is coherent. Separate rejection handling, explicit unavailable values, and metric definitions support analytical honesty. Native controls, chart table alternatives, skip links, focus styles, and reduced-motion handling provide strong accessibility foundations in source.

Priority issues:

1. [P1] Make provenance unmistakable. Dashboard.tsx:60 renders dates and refresh times without an explicit live-data label. Explorer.tsx:40 and Methodology.tsx:59 describe live individual records, conflicting with the user's synthetic-only Explorer requirement. This is a confirmed content contradiction, not a verified data leak. Show Live aggregates or Demo aggregates beside the reporting date; explicitly identify the synthetic Explorer and align its explanation with the actual authorized contract. Suggested command: impeccable clarify.

2. [P1] Stop the route from implying historical progression. Pipeline.tsx:118 highlights a path to the furthest populated status; the snapshot caveat follows the entire board at line 195. Readers can infer movement that the source does not establish. Put Current status snapshot — each record counted once above the board. Preserve the approved illustrations and separate rejection area; prefer a static illustrative route over a data-dependent progress animation. Suggested command: impeccable clarify, then quieter if motion changes are wanted.

3. [P2] Shorten the mobile path to evidence. HiringGauntlet.css:406 gives eight mobile checkpoints a minimum 142px each: at least 1,136px before separate outcomes. Pipeline precedes submission metrics. Important supporting text reaches 9–10px; the KPI definition affordance is 15×15px. These are source-confirmed dimensions, not observed rendering failures. Move a compact metric summary earlier, condense mobile status rows, and enlarge supporting text and interactive hit areas. Suggested command: impeccable adapt.

4. [P2] Keep cohort context and recovery available. Dashboard.tsx:84 clears its announcement after an update; map selection changes the global country filter. Explorer.tsx:182 says to broaden the search even when dropdown filters caused the empty result, and has no local clear-all. Show a concise cohort summary, announce updated counts, explain the map's scope, and add Clear Explorer filters without coupling it to aggregate controls. Suggested command: impeccable harden.

5. [P2] Keep humor from undermining competence or accuracy. Pipeline.tsx:13 includes qualification/AI self-disparagement; Geography.tsx:22 frames applications as international rejection. The latter misdescribes submissions with other outcomes. Keep the masthead joke; target recruitment friction in secondary humor and use factual chart subtitles such as Submitted applications by country. Suggested command: impeccable clarify.

Cognitive load: Moderate. The main costs are reconciling the route with snapshot data, remembering filter scope down the page, and maintaining navigation context. Six navigation links and seven sortable columns are not inherently defects. Secondary-filter disclosure is useful.

Emotional journey: The opening is memorable and playful; repeated self-disparagement weakens that confidence. Definitions and quality notes restore trust later. Bring provenance and key evidence closer to the opening.

Persona risks: Alex (analytical power user) loses cohort context and cannot share a filtered URL. Sam (accessibility-dependent user) gets weak completion feedback and small definition targets; actual assistive-technology behavior remains untested. Casey (mobile visitor) must pass a long status sequence before submission evidence and horizontally scroll the Explorer.

Minor observations: Inactive sorting columns also display directional arrows. Dates verified implies more than format/consistency validation establishes. Navigation lacks a current-section indicator.

Detector: 90 advisory findings, zero non-advisory findings, exit 0. Breakdown: 29 design-system-color, 59 design-system-font-size, 2 design-system-radius. Locations span styles.css, HiringGauntlet.css, Activity.tsx, Geography.tsx and Plot.tsx. Several responsive sizes are documented in DESIGN.md prose and are parser false positives. Treat this as token/documentation reconciliation, not 90 visual defects. No browser overlay was created.

Questions: Which should come first: analytical clarity, mobile readability, or copy/tone? Should a follow-up address only the top two issues or all five while retaining the current visual identity?
