import type { DashboardData } from "../types/dashboard";
import { number } from "../lib/presentation";
const metrics = [
  [
    "opportunities",
    "Total opportunities",
    "All records in the filtered cohort, including pre-submission states and conflicting records.",
  ],
  [
    "submitted",
    "Submitted applications",
    "Valid, nonfuture Date Applied, with no submission conflict. Unknown status can count as submitted.",
  ],
  [
    "active",
    "Active applications",
    "Eligible submitted records currently Applied, Recruiter Screen, Interview, Technical, or Final. Offers are separate.",
  ],
  [
    "interviews",
    "Interview pipeline",
    "Eligible submitted records currently Recruiter Screen, Interview, Technical, or Final. A current snapshot, not historical interview incidence.",
  ],
  ["offers", "Offers", "Eligible submitted records currently at Offer."],
  [
    "rejections",
    "Rejections",
    "Eligible submitted records currently Rejected. Pending applications are not rejections.",
  ],
] as const;
export function Kpis({ values }: { values: DashboardData["kpis"] }) {
  return (
    <section className="kpis" aria-label="Overview metrics">
      {metrics.map(([key, label, definition]) => (
        <div className={"kpi kpi-" + key} key={key}>
          <div className="kpi-label">
            {label}
            <details className="definition">
              <summary aria-label={"Definition: " + label}>i</summary>
              <p>{definition}</p>
            </details>
          </div>
          <strong>{number(values[key])}</strong>
          <span>
            {key === "opportunities"
              ? "in selected cohort"
              : key === "submitted"
                ? "date-verified submissions"
                : key === "active"
                  ? "still in the running"
                  : key === "interviews"
                    ? "screen through final"
                    : key === "offers"
                      ? "a welcome plot twist"
                      : "closed, not forgotten"}
          </span>
        </div>
      ))}
    </section>
  );
}
