---
name: "Peak Unemployment"
description: "Atlas: an editorial job-search dashboard on paper, with navy ink and cobalt selection."
colors:
  accent: "#325ec4"
  ink: "#172d4d"
  muted: "#52627b"
  surface: "#f5f1e8"
  border: "#cbd0d5"
  ledger: "#eeece5"
  gauntlet-paper: "#fff9eb"
  gauntlet-green: "#285840"
  gauntlet-amber: "#e7bd69"
  gauntlet-red: "#873f39"
  gauntlet-red-paper: "#f1dfd6"
  gauntlet-selected: "#e2ebd7"
  gauntlet-track: "#bfd0b2"
  hover-surface: "#e5e9ef"
  demo-surface: "#e0e7f3"
  demo-ink: "#294d9d"
  live-surface: "#dce9e1"
  live-ink: "#20583d"
  status-discovered: "#818b98"
  status-preparing: "#7886aa"
  status-applied: "#4b8d86"
  status-recruiter-screen: "#367e91"
  status-interview: "#5268a0"
  status-technical: "#7c63a2"
  status-final: "#a06a91"
  status-offer: "#28764e"
  status-rejected: "#b36656"
  status-unknown: "#91978d"
typography:
  display:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "clamp(76px, 8vw, 123px)"
    fontWeight: 400
    lineHeight: 0.78
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  metric:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Manrope Variable, sans-serif"
    fontWeight: 450
    lineHeight: 1.6
  label:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "11px"
    fontWeight: 650
  navigation:
    fontFamily: "Georgia, serif"
    fontSize: "20px"
rounded:
  control: "4px"
  segment: "2px"
  badge: "20px"
spacing:
  small: "12px"
  medium: "24px"
  large: "32px"
components:
  button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 13px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "38px"
    padding: "0 9px"
  demo-badge:
    backgroundColor: "{colors.demo-surface}"
    textColor: "{colors.demo-ink}"
    rounded: "{rounded.badge}"
    padding: "5px 10px"
---

# Design System: Peak Unemployment

## Overview

**Creative North Star: “Atlas”**

An editorial atlas of a personal job search: paper, navy ink, serif headlines, illustrated Hiring Gauntlet checkpoints, a forest-green route and a separate muted-red rejection area. The approved direction is `.impeccable/mocks/decision/atlas.webp`. The identity applies across the dashboard, from its fixed index to its ruled chart spreads and application ledger.

The voice stays professional and lightly playful. Strong headline and number hierarchy introduces the story; explicit definitions, provenance, and chart alternatives support scrutiny.

Key characteristics:

- Paper canvas with flat, ruled analytical sections.
- DM Serif Display headlines and numbers, Manrope controls and evidence.
- A current-status board with authored SVG illustrations, inline counts and cohort shares, and always-visible taglines.
- Compact global controls and an independently filtered application ledger.

## Colors

Cobalt is the dashboard control accent; navy supplies text. The Hiring Gauntlet adds a scoped cream board, forest-green route, amber illustration accents, and muted-red rejection area. Labels accompany every color. Muted blue-gray supports labels, while warm paper and ledger surfaces keep long analytical sections cohesive. The normative values are in the frontmatter, `src/styles.css`, and `src/charts/HiringGauntlet.css`.

Checkpoint hover uses pale green and a gentle artwork lift; checkpoints have no click action. Empty checkpoints use subdued neutral artwork while retaining readable counts. The rejection area retains its red treatment, and Unknown stays outside the numbered route. Status dots in the Explorer retain the reviewed mapping in `src/lib/presentation.ts`. Live and demo badges have distinct labeled treatments; color never replaces their text.

## Typography

DM Serif Display and Manrope Variable are bundled locally through Fontsource. Georgia provides the desktop index and tagline. Headings use regular serif weight; compact labels and controls use Manrope. Chart labels use Manrope at 12px with muted ink, and numbers use tabular figures where supported.

The desktop masthead uses the display token above; at 1250px it becomes `clamp(64px, 7.5vw, 100px)`, at 950px `clamp(56px, 10.7vw, 100px)`, and at 650px `clamp(38px, 10.4vw, 68px)` with 0.94 line height. Section headings generally range from 27px to 36px. The desktop tagline scales from 20px to 28px, becoming 20px on phones.

The Hiring Gauntlet retains these font families: its heading is `clamp(32px, 3.4vw, 48px)`, checkpoint names are 13px/1.3 at weight 750, counts are 30px/1.1 serif, and shares are 10px/1.4. On phones checkpoint names become 12px and counts 27px. The filtered total is 44px serif (32px on phones); stage taglines are 11px/1.5.

## Layout

Above 1250px, a fixed 240px left index anchors the page; the main area offsets by the same width and uses 40px horizontal padding. At 1250px, the index narrows to 190px and main padding to 28px. At 950px and below, the index becomes a normal-flow top header with horizontally scrollable navigation and 24px page padding. At 650px and below, page padding is 18px. Above 1800px, main padding grows to 60px.

The opening sequence is masthead and provenance, compact filters, then the Hiring Gauntlet with inline counts and shares. Submission activity shares a ruled spread with a metrics sidebar. Geography pairs its map with a country table; distributions use three columns, two below 1250px, and one below 650px. Follow-ups, the Explorer ledger, and methodology complete the page.

Above 650px, the eight numbered checkpoints form a four-column, two-row board with 260px rows: the top reads left to right and the bottom returns right to left. The total sits above the board; Rejected occupies a separate strip below the route, followed by Unknown when present or unavailable. At 650px and below, checkpoints form a compact vertical list with artwork, labels and shares, and right-aligned counts. Board padding changes from 24px to 18px 14px with no bottom padding. Activity, geography, follow-ups, and methodology become single-column sections at 650px. Tables preserve their columns with local horizontal scrolling.

## Elevation & Depth

Use paper tones, rules, and illustrated checkpoints to establish hierarchy. Analytical panels remain flat. Definition popovers use `0 5px 16px #172d4d20`, with navy backgrounds and light text. Avoid adding general card shadows.

Hiring Gauntlet entrance motion is bounded: one 420ms board entrance moves upward 5px while fading from 0.8 opacity. Hover lifts artwork 3px and rotates it −2 degrees with a 180ms transition. There are no ring pulses or moving records. The route reveals one segment every 220ms, stopping at the furthest populated numbered stage in the filtered cohort (maximum 1540ms). Rejected and Unknown do not extend it. After the reveal, all highlighted segments pulse together twice over 2400ms, easing opacity between 1 and 0.45. The initial sequence finishes within 3940ms, then a six-second idle cycle softly eases highlighted-path opacity between 1 and 0.72. The idle loop stays in place and never extends beyond the filtered endpoint. Reduced motion disables animation and transitions while retaining the static route highlight.

## Shapes

Controls have 4px corners; segmented interiors have 2px corners. Checkpoint illustrations sit in 104×91px outlined medallions with `50% 50% 45% 45%` corners, shrinking to 78×72px on phones. Number badges are 23px circles. The cream board has square corners. Badges use pill shapes. Section boundaries are thin rules, not raised card frames.

## Components

### Controls and navigation

Buttons use transparent fills, a blue-gray border, and navy text. Hover introduces a pale blue-gray fill and cobalt text. Keyboard focus is a 2px cobalt outline offset by 4px. Disabled buttons reduce opacity and use the unavailable cursor. Desktop navigation uses Georgia with a cobalt left rule on hover or focus; the top navigation uses Manrope at 12px.

### Filters

Date basis, country, role type, current status, and reset stay visible. A native disclosure contains From, To, Source, and Tier, and indicates when these contain active values. All aggregate panels share these filters; activity continues to plot submission dates. On mobile, fields form two columns and reset receives its own row.

### Hiring Gauntlet

Eight numbered read-only checkpoints pair authored inline SVG objects with professional labels, visible taglines, current counts, and cohort shares. Illustrations are decorative; labels and values remain HTML. No raster assets, tooltips, buttons or detail panels are used. Hover retains the artwork lift and rotation. The route highlight is clipped to the furthest populated current stage in the filtered view, with a sequential reveal on desktop and mobile. It restarts only when the endpoint changes. A Discovered-only or empty cohort has no highlighted connecting segments. All values refresh with global filters.

The denominator is all filtered opportunities, including Rejected, Unknown, and submission conflicts. Zero-count checkpoints remain visible; unavailable counts and shares are explicitly labeled. The green route ends at Offer, which does not imply acceptance. Rejected is a separate terminal outcome that can occur after any submitted stage; the source does not identify that stage. Unknown remains outside the route. Connectors illustrate typical order only, never historical movement or conversion.

### Charts and metrics

Plotly backgrounds are transparent, hover labels navy, and the mode bar hidden. Each plot has a tabular alternative; the visual plot is hidden from assistive technology. Activity sits beside a two-column metric grid. Definitions use native disclosures, and quality warnings remain visible without inventing missing data.

### Explorer ledger

A muted paper surface, navy top rule, generous rows, and minimal status dots distinguish the application record table. Search, country, status, sorting, and pagination act on approved fields returned by `/api/explorer`, independently of aggregate filters. Show live or synthetic provenance, plus loading and retry states. The table region is keyboard focusable, has a visible focus outline, and includes a horizontal-scroll hint at narrower widths.

## Do's and Don'ts

- Do preserve explicit live/demo provenance and fixed demo reporting-date labeling.
- Do use rules and spacing to organize evidence, with serif headlines and numbers.
- Do preserve keyboard focus, chart tables, empty/error/loading states, and reduced-motion behavior.
- Do show current counts and correct denominators; never invent stage history.
- Don't connect Rejected as the step after Offer or label cohort shares as conversion rates.
- Publish only the approved Explorer fields; keep Notes, URLs, contacts and other source fields private. Keep Explorer controls independent of live aggregate filters.
- Don't restore the superseded teal interface palette, rounded card grid, or former top-only desktop navigation.
