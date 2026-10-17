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
  route-neutral: "#e0e2e8"
  route-line: "#aab9cf"
  route-green: "#246348"
  route-green-surface: "#e0ebe1"
  route-green-line: "#83a98d"
  route-red: "#963f38"
  route-red-surface: "#f2dfda"
  route-red-line: "#b96359"
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

An editorial atlas of a personal job search: paper, navy ink, serif headlines, large circular route markers, green offer-path and red rejected-path accents. The approved direction is `.impeccable/mocks/decision/atlas.webp`. The identity applies across the dashboard, from its fixed index to its ruled chart spreads and application ledger.

The voice stays professional and lightly playful. Strong headline and number hierarchy introduces the story; explicit definitions, provenance, and chart alternatives support scrutiny.

Key characteristics:

- Paper canvas with flat, ruled analytical sections.
- DM Serif Display headlines and numbers, Manrope controls and evidence.
- A current-status route with enlarged count circles and inline cohort shares.
- Compact global controls and an independently filtered application ledger.

## Colors

Cobalt is the control accent; navy supplies text and the Total tracked circle. The route toward Offer uses green; Rejected uses red and Unknown stays neutral. Labels accompany every color. Muted blue-gray supports labels, while warm paper and ledger surfaces keep long analytical sections cohesive. The normative values are in the frontmatter and `src/styles.css`.

Route circles are neutral until selected, when they become cobalt with white numbers. This selection color does not encode recruitment status. Status dots in the Explorer retain the reviewed mapping in `src/lib/presentation.ts`. Live and demo badges have distinct labeled treatments; color never replaces their text.

## Typography

DM Serif Display and Manrope Variable are bundled locally through Fontsource. Georgia provides the desktop index and tagline. Headings use regular serif weight; compact labels and controls use Manrope. Chart labels use Manrope at 12px with muted ink, and numbers use tabular figures where supported.

The desktop masthead uses the display token above; at 1250px it becomes `clamp(64px, 7.5vw, 100px)`, at 950px `clamp(56px, 10.7vw, 100px)`, and at 650px `clamp(38px, 10.4vw, 68px)` with 0.94 line height. Section headings generally range from 27px to 36px. The desktop tagline scales from 20px to 28px, becoming 20px on phones.

## Layout

Above 1250px, a fixed 240px left index anchors the page; the main area offsets by the same width and uses 40px horizontal padding. At 1250px, the index narrows to 190px and main padding to 28px. At 950px and below, the index becomes a normal-flow top header with horizontally scrollable navigation and 24px page padding. At 650px and below, page padding is 18px. Above 1800px, main padding grows to 60px.

The opening sequence is masthead and provenance, compact filters, then the enlarged route with inline counts and shares. Submission activity shares a ruled spread with a metrics sidebar. Geography pairs its map with a country table; distributions use three columns, two below 1250px, and one below 650px. Follow-ups, the Explorer ledger, and methodology complete the page.

The nine main route stations run horizontally above 650px and vertically below. Rejected branches separately; Unknown is separate when present or its count is unavailable. There is no station selection or detail panel. Activity, geography, follow-ups, and methodology become single-column sections at 650px. Tables preserve their columns with local horizontal scrolling.

## Elevation & Depth

Use paper tones, rules, and count circles to establish hierarchy. Analytical panels remain flat. Definition popovers alone use `0 5px 16px #172d4d20`, with navy backgrounds and light text. Avoid adding general card shadows.

Motion is bounded: a 750ms connector reveal and two 1800ms ring pulses around stationary nodes, with at most 360ms delay. Everything finishes within four seconds; there is no infinite loop or implied record movement. Reduced-motion preferences keep the route completely still.

## Shapes

Controls have 4px corners; segmented interiors have 2px corners. Main and branch circles are 96px on wide screens, 72px on compact desktops, 76px at top-navigation widths, 64px from 651–800px, and 76px on phones. Badges use pill shapes. Section boundaries are thin rules, not raised card frames.

## Components

### Controls and navigation

Buttons use transparent fills, a blue-gray border, and navy text. Hover introduces a pale blue-gray fill and cobalt text. Keyboard focus is a 2px cobalt outline offset by 4px. Disabled buttons reduce opacity and use the unavailable cursor. Desktop navigation uses Georgia with a cobalt left rule on hover or focus; the top navigation uses Manrope at 12px.

### Filters

Date basis, country, role type, current status, and reset stay visible. A native disclosure contains From, To, Source, and Tier, and indicates when these contain active values. All aggregate panels share these filters; activity continues to plot submission dates. On mobile, fields form two columns and reset receives its own row.

### Current-status route

Stations are static labeled counts with cohort shares directly beneath them. They have no button semantics, selection state, detail panel, or scroll action. The green path ends at Offer, which does not imply acceptance. Rejected branches from Total tracked in red and remains a separate terminal outcome. Unknown is neutral. No connector or animation claims historical movement or conversion.

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
