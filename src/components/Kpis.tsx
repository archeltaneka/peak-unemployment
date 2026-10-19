import type { DashboardData } from "../types/dashboard";
import { number } from "../lib/presentation";
const metrics = [
  [
    "opportunities",
    "Total opportunities",
    "All records in the filtered cohort, including pre-submission states and conflicting records.",
    "in selected cohort",
  ],
  [
    "submitted",
    "Submitted applications",
    "Valid, nonfuture Date Applied, with no submission conflict. Unknown status can count as submitted.",
    "valid submission dates",
  ],
  [
    "active",
    "Active applications",
    "Eligible submitted records currently Applied, Recruiter Screen, Interview, Technical, or Final. Offers are separate.",
    "still in the running",
  ],
  [
    "interviews",
    "Interview pipeline",
    "Eligible submitted records currently Recruiter Screen, Interview, Technical, or Final. A current snapshot, not historical interview incidence.",
    "screen through final",
  ],
  [
    "offers",
    "Offers",
    "Eligible submitted records currently at Offer.",
    "a welcome plot twist",
  ],
  [
    "rejections",
    "Rejections",
    "Eligible submitted records currently Rejected. Pending applications are not rejections.",
    "closed, not forgotten",
  ],
  [
    "submittedToday",
    "Submitted today",
    "Eligible submissions in the selected cohort with Date Applied equal to the displayed reporting date. Uses the reporting timezone. Today is still in progress; demo mode uses its fixed reporting date.",
    "reporting day · in progress",
  ],
  [
    "weeklyDailyAverage",
    "Daily average this week",
    "Recorded eligible submissions in the selected cohort from Monday through the reporting date, divided by all elapsed calendar days in that week, including today and zero-submission days. Filters do not shorten this denominator. Today is partial; this is not a completed-week or rolling seven-day average.",
    "applications/day · week to date",
  ],
  [
    "monthlyDailyAverage",
    "Daily average this month",
    "Recorded eligible submissions in the selected cohort from the first of the month through the reporting date, divided by all elapsed calendar days in that month, including today and zero-submission days. Filters do not shorten this denominator. Today is partial; this is not a completed-month average.",
    "applications/day · month to date",
  ],
] as const;
export function Kpis({ values }: { values: DashboardData["kpis"] }) {
  return (
    <section className="kpis" aria-label="Overview metrics">
      {metrics.map(([key, label, definition, note]) => (
        <div className={"kpi kpi-" + key} key={key}>
          <div className="kpi-label">
            {label}
            <details className="definition">
              <summary aria-label={"Definition: " + label}>i</summary>
              <p>{definition}</p>
            </details>
          </div>
          <strong>
            {key === "weeklyDailyAverage" || key === "monthlyDailyAverage"
              ? values[key].toLocaleString("en", { maximumFractionDigits: 2 })
              : number(values[key])}
          </strong>
          <span>{note}</span>
        </div>
      ))}
    </section>
  );
}
