---
target: application tracker dashboard after improvements
total_score: 31
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 0
target_identity: "file:/home/archel/Documents/Personal Projects/peak-unemployment/src/pages/Dashboard.tsx"
target_fingerprint: "sha256:893ec81ea6bcb4ae7934a888f6e3de91a3057cf337b070cb2a0fada89e2c1313"
target_path: /home/archel/Documents/Personal Projects/peak-unemployment/src/pages/Dashboard.tsx
timestamp: 2026-10-19T09-22-38Z
slug: src-pages-dashboard-tsx
closed: true
---
Method: dual-agent (A: /root/critique2_a · B: /root/critique2_b).

The dashboard is clearer and more credible, while retaining its authored Atlas identity. The next work should be targeted correctness and responsive fixes, not another redesign.

Scope: src/pages/Dashboard.tsx and current associated UI. Both independent reviews were source-backed because browser selection failed and documented discovery returned no connected browsers. No new desktop/mobile screenshots or interaction verification. Scores are provisional heuristic judgments.

Design specificity: Paper/navy surfaces, serif metrics, illustrated status checkpoints, restrained job-search humor and the ledger remain coherent and specific to this product. Snapshot disclaimers and separation of rejection now give the metaphor clearer analytical boundaries.

What improved: Metrics precede the board. Current status and one-record-per-status semantics are explicit above a static route. Live/demo provenance, independent Explorer controls, reset and result announcements are clear. The mobile implementation reduces status-row minimum height from 142px to 88px, enlarges controls and retains company identity while horizontally scrolling. Actual rendered usability remains unverified.

| Heuristic | Score / 4 | Assessment |
|---|---:|---|
| System status | 3 | Useful announcements; refresh timezone is ambiguous. |
| Match with real world | 3 | Clear current-state language and familiar labels. |
| Control and freedom | 4 | Appropriate resets, country deselection and navigation. |
| Consistency | 3 | Coherent interface; obsolete responsive chart rule remains. |
| Error prevention | 2 | Complete date range is not checked before requesting data. |
| Recognition over recall | 3 | Cohort context is repeated; quality flags arrive late. |
| Efficiency | 3 | Search, sorting, filters, pagination and interval controls. |
| Aesthetic restraint | 3 | Authored hierarchy; chart width is wasted at intermediate sizes. |
| Error recovery | 3 | Retry/clear exist; invalid dates disrupt the whole aggregate body. |
| Help and documentation | 4 | Definitions, denominators, methodology and chart tables. |
| Total | 31/40 | Good; provisional source-backed assessment. |

Priority issues:

1. [P2] Fix the leftover two-column Activity layout. src/styles.css:911 restores two columns at max-width 1250px, while src/pages/Dashboard.tsx:143 now supplies only Activity. Between 651 and 1250px, the empty second track consumes chart space. This is a regression from the prior refinement, established by the CSS/component structure; clipping itself was not visually observed. Remove the obsolete override and verify at 768, 1024 and 1250px. Suggested command: impeccable adapt.

2. [P2] Validate date ranges before requesting data. src/components/Filters.tsx:88 sends each date change immediately. Moving From past an existing To can submit an inverted range; the To minimum does not repair an already-selected value. The server rejects the request, and Dashboard.tsx:124 hides the aggregate body on error. Show an associated inline range error, avoid invalid requests, and clearly label any retained last-successful cohort while correction is pending. Suggested command: impeccable harden.

3. [P2] Make refresh timezone unambiguous. Dashboard.tsx:72 and Explorer.tsx:54 put the reporting timezone beside a refresh clock formatted without a timeZone option. Visitors elsewhere see local time without that distinction. Use data.timezone in both formatters, or explicitly label viewer-local time. Suggested command: impeccable clarify.

4. [P2] Put data-quality flags near the metrics they qualify. Dashboard.tsx:146 renders the actual flagged-record count after metrics, the board and Activity. Put a concise conditional summary beside the overview and link to existing detailed notes. Readers can then understand opportunity/submission differences without searching down the page. Suggested command: impeccable clarify.

No P0/P1 issue was established in this review.

Cognitive load: Manageable for an analytics surface. Six navigation destinations, six KPIs and seven sortable columns exceed the playbook's simple thresholds but represent meaningful information, not automatic defects. Progressive disclosure and repeated cohort context help. Distance to quality notes creates avoidable recall.

Emotional journey: The playful opening now leads more cleanly into analytical evidence and scrutiny. Invalid date ranges remain a valley: Taking a Brief Pause sounds like an outage when the visitor needs to correct input.

Persona risks: Alex, an analytical visitor, loses chart workspace at medium widths. Sam, an accessibility-dependent visitor, lacks associated inline date errors; actual screen-reader/zoom behavior was not tested. Casey, a mobile visitor, benefits from explicit phone adaptations, but tablet/landscape widths still encounter the chart-grid issue.

Minor observations: Navigation lacks a current-section indicator. Distribution.tsx compares the title Role distribution while the caller uses Role Distribution, so the intended wider role-label margin is not selected; actual clipping needs visual inspection. Documentation calls the visible Waiting Game section Hiring Gauntlet internally.

Detector: 101 advisories, all advisory severity and exit 0: 71 design-system-font-size, 29 design-system-color, one design-system-radius. Locations are primarily src/styles.css and src/charts/HiringGauntlet.css, with color findings in Activity.tsx, Geography.tsx and Plot.tsx. Many font sizes are documented in DESIGN.md prose and only missing from its machine-readable scale. The 3px tier-chip radius at styles.css:736 is minor token drift. These are not 101 demonstrated design defects; they do not contradict the improved heuristic assessment. No browser overlay exists.

Questions: For a follow-up, address all four remaining issues or only Activity layout and date recovery? Should refresh clocks use the reporting timezone or explicitly labeled visitor-local time?
