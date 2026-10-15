---
name: "Peak Unemployment"
description: "A neutral, compact analytics workspace with restrained teal accents."
colors:
  accent: "#176458"
  ink: "#253b34"
  muted: "#63706b"
  canvas: "#f5f6f3"
  surface: "#fff"
  border: "#e2e7df"
  header: "#fbfcf9"
  filter-surface: "#eef1eb"
  control-border: "#d8dfd6"
  control-ink: "#31483d"
  hover-surface: "#edf3ed"
  hover-ink: "#124e43"
  focus: "#318b76"
  segmented-surface: "#f0f3ee"
  segmented-ink: "#5b6a60"
  segmented-selected-ink: "#254a3a"
  demo-surface: "#f1ead8"
  demo-ink: "#75602e"
  live-surface: "#e2efe7"
  live-ink: "#215b46"
  tooltip: "#25483a"
  activity: "#398377"
  activity-partial: "#b7cfc7"
  activity-average: "#ae7838"
  distribution-role: "#548f84"
  distribution-source: "#648b9c"
  distribution-tier: "#9b8965"
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
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "38px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "17px"
    fontWeight: 750
    letterSpacing: "-0.025em"
  metric:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "36px"
    fontWeight: 750
    lineHeight: 1.4
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "12px"
    fontWeight: 450
    lineHeight: 1.65
  label:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "11px"
    fontWeight: 650
  chart:
    fontFamily: "Manrope Variable, sans-serif"
    fontSize: "11px"
rounded:
  segment: "4px"
  badge: "5px"
  button: "6px"
  input: "7px"
  tooltip: "8px"
  panel: "14px"
spacing:
  control-gap: "10px"
  field-gap: "12px"
  mobile-panel: "18px"
  panel-gap: "20px"
  panel: "23px"
  section: "24px"
  desktop-gutter: "48px"
components:
  button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "7px 12px"
  button-hover:
    backgroundColor: "{colors.hover-surface}"
    textColor: "{colors.hover-ink}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    padding: "2px 0"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.control-ink}"
    rounded: "{rounded.input}"
    height: "39px"
    padding: "0 10px"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "23px"
  demo-badge:
    backgroundColor: "{colors.demo-surface}"
    textColor: "{colors.demo-ink}"
    rounded: "{rounded.badge}"
    padding: "5px 9px"
  live-badge:
    backgroundColor: "{colors.live-surface}"
    textColor: "{colors.live-ink}"
    rounded: "{rounded.badge}"
    padding: "5px 9px"
  segmented-button:
    backgroundColor: "transparent"
    textColor: "{colors.segmented-ink}"
    rounded: "{rounded.segment}"
    padding: "5px 9px"
  segmented-button-selected:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.segmented-selected-ink}"
---

# Design System: Peak Unemployment

## Overview

**Creative North Star: "Neutral compact analytics workspace"**

Peak Unemployment uses a quiet neutral canvas, white analytical panels, and restrained teal accents. Its professional, slightly playful character comes from concise language and a clear hierarchy, with the evidence carrying the visual weight.

Compact controls, tabular numerals, and aligned counts support scanning. Tonal separation and fine borders organize the interface; motion is limited to short control feedback and scrolling. The system remains independent of the owner’s portfolio identity.

**Key Characteristics:**
- Neutral surfaces with restrained teal emphasis.
- Compact controls and clear numerical hierarchy.
- Flat analytical panels with fine borders.
- Readable chart labels and accessible table alternatives.

## Colors

The palette combines green-tinted neutrals with muted teal; semantic chart colors provide distinctions without competing with the data. The frontmatter records the implementation’s values, including CSS shorthand where used.

### Primary

**Restrained teal** (`accent`) identifies actions, heading emphasis, checkbox selection, and expandable chart data. `activity` is the stronger chart fill; `activity-partial` distinguishes incomplete periods. The amber `activity-average` is reserved for the daily average series.

### Neutral

**Soft neutral canvas** (`canvas`) sits behind **white analytical surfaces** (`surface`). `header` and `filter-surface` provide quiet grouping. `ink` carries primary text, `muted` carries supporting labels, and `border` separates regions. Control and segmented tokens preserve the specific contrast treatments implemented for fields and interval selection.

### Semantic colors

Demo provenance uses `demo-surface` and `demo-ink`; live provenance uses the corresponding live pair. Status tokens retain the exact shared mapping from `src/lib/presentation.ts`: Discovered, Preparing, Applied, Recruiter Screen, Interview, Technical, Final, Offer, Rejected, and Unknown. Role, source, and tier distributions use their distinct muted chart colors. These are data encodings, not additional brand accents.

**The Labeled Color Rule.** Color reinforces explicit labels and counts; it never replaces them.

## Typography

Manrope Variable is self-hosted and used throughout, with sans-serif fallback. There is no separate display or monospace family. Tabular numerals align metrics and tables; heavier weights and slightly tight heading spacing establish hierarchy.

The display token describes the desktop page title. It becomes 29px at the 800px breakpoint and 30px at 540px. Panel titles use the title role, becoming 16px on small screens. Metrics use the metric role, changing to 32px and then 34px at those breakpoints. Supporting copy ranges from 10–13px; the body token describes the recurring 12px copy treatment, not a universal paragraph override. Form labels use the label role. Plotly labels use the chart role and muted color. Compact table headers and footnotes use 9–10px. Preserve zoom and responsive wrapping rather than assuming every label fits a fixed desktop width.

## Layout

The main container is centered with a maximum width of 1440px and 48px horizontal padding. Gutters reduce to 28px at 1200px, 20px at 800px, and 14px at 540px. The header is 78px tall, becoming 65px at 800px; above 1500px its contents align with the main content width.

The desktop filter grid has eight tracks, then four at 1200px and two at 540px, where the first and last fields span both columns. The KPI strip has six columns, then three at 800px and two at 540px. Dividers follow the actual column boundaries.

Analytical panels use 20px grid gaps and 23px padding, reducing padding to 20px at 1200px and 18px at 540px. The primary comparison uses a 1.8:1 ratio on desktop, 1.5:1 at 1200px, and stacks at 800px. Geography also stacks at 800px. Distribution panels move from three columns to two at 1200px and one at 540px. Explorer fields collapse from three columns to two and then one. Its wide table retains an 850px minimum width and scrolls inside its panel. Methodology becomes a single column at 800px.

## Elevation & Depth

Panels are flat: fine borders and tonal backgrounds create grouping without resting card shadows. Only the selected segment and definition popup use small shadows. The selected segment uses `0 1px 3px #19342915`; definition popups use `0 5px 16px #183d3220`. These identify a selected control and an overlaid explanation, respectively.

## Shapes

Rounded rectangles define the system. Panels and filter containers use the panel radius; buttons, inputs, badges, segments, and tooltips use the smaller frontmatter radii. Borders are generally a single pixel. Small circular dots mark provenance and status; horizontal snapshot tracks have gently rounded ends. Avoid turning compact controls into large pill-shaped calls to action.

## Components

### Buttons and navigation

Default buttons are compact white controls with a fine neutral border. Hover uses the hover surface and ink tokens. Text buttons remove the border and use teal for reset and clear actions. Disabled controls have 0.45 opacity and a not-allowed cursor. Interactive elements use a 3px focus outline in the focus color, offset by 3px. Button background transitions take 0.12s. Reduced-motion preferences remove transitions and smooth scrolling.

Header navigation is a simple horizontal text row: 12px and weight 600 on desktop, 10px at 800px. Hover changes the text to teal. The Overview anchor is hidden at 540px while Explorer and Methodology remain. No active-tab styling is implemented.

### Inputs and filters

White inputs and native selects use the input token, a fine control border, and 12px text. Labels sit above fields with a 7px gap. Search and select controls share this language; checkboxes are compact native controls with the accent color. The filter group uses a softly tinted surface and a clear reset action.

### Segmented interval control

The interval group uses a muted surface, 3px internal padding, and a 2px gap. Unselected labels use the explicit segmented ink token. The selected button uses white, stronger green text, weight 700, and the small selection shadow. Selection is exposed with `aria-pressed`. Mobile button padding becomes 5px 12px.

### Badges and provenance

Provenance badges are compact rounded rectangles with 10px bold labels and an optional small dot. Demo and live states use distinct semantic pairs; both always have text. The mobile provenance block moves beneath the page title and aligns left. Neutral count badges use the same compact geometry.

### Panels, metrics, and definitions

White panels use a thin border, restrained corners, a title, and muted supporting text. The KPI strip joins metrics in one shared surface with internal dividers. Metric labels include native disclosure controls for definitions. Definition popups are 210px wide, use a dark green surface and white text, and align toward the inside of their grid: the last desktop item, every third tablet item, and every second small-screen item anchor to the right. Keep popup positioning tied to responsive columns so explanations remain inside the viewport.

### Charts and tables

Charts use transparent backgrounds, muted labels, subtle gridlines, and no Plotly mode bar. Activity bars distinguish partial periods; the cumulative series uses a restrained teal line and translucent fill. Geography uses proportional teal circles on muted land, with a country table as an alternative interaction. Snapshot bars describe current status, with rejected outcomes visually separated by a dashed divider. Table disclosures accompany charts. Tables use fine horizontal separators, compact headers, aligned values, and local overflow where needed.

### Feedback states

Loading uses quiet neutral placeholder blocks with explanatory text. Empty states center a concise message within the analytical area. Errors and quality notices use warm tinted surfaces with text and controls, not color alone. During an aggregate refresh, existing dashboard content is dimmed to 0.55 opacity and its pointer interactions are suppressed while the request status remains visible.

## Do's and Don'ts

### Do:
- Do preserve explicit live and synthetic provenance labels.
- Do pair chart colors with labels, counts, and accessible data tables.
- Do keep status colors consistent across snapshot bars and record labels.
- Do retain visible keyboard focus and reduced-motion behavior.
- Do let mobile layouts stack while wide tables scroll within their containers.

### Don't:
- Don’t use decorative funnels or imply historical recruitment transitions.
- Don’t style rejected outcomes as the next sequential recruitment stage.
- Don’t substitute color alone for meaning or selection state.
- Don’t add decorative motion, gradients, or elevated panel shadows to this restrained system.
- Don’t hide synthetic provenance or mix explorer controls with the aggregate cohort.
