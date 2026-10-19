import type { Status } from "../types/dashboard";

/** Small, consistent two-color checkpoint pictograms. Labels live in HTML. */
export function CheckpointArt({ stage }: { stage: Status }) {
  return (
    <svg
      viewBox="0 0 80 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {stage === "Discovered" && (
        <>
          <path d="m17 29 39-16 7 17-39 12z" fill="var(--gauntlet-amber)" />
          <path d="m51 15 7 17M17 29l-6 3 4 10 8-3M40 37v9m0 0L25 59m15-13 15 13M61 9l3-5m5 16 6-1" />
          <circle cx="40" cy="45" r="3" fill="var(--gauntlet-paper)" />
        </>
      )}
      {stage === "Preparing" && (
        <>
          <path d="M20 7h30l10 11v40H20z" fill="var(--gauntlet-paper)" />
          <path d="M50 7v12h10M28 19h12M28 28h22M28 36h18M28 44h12" />
          <path d="m44 49 16-25 7 5-16 25-10 5z" fill="var(--gauntlet-amber)" />
        </>
      )}
      {stage === "Applied" && (
        <>
          <path d="M14 24h50v33H14z" fill="var(--gauntlet-paper)" />
          <path d="m14 24 25 20 25-20M14 57l17-20m33 20L47 37" />
          <path d="m37 7 34 1-15 20-4-12z" fill="var(--gauntlet-amber)" />
          <path d="m52 16 19-8M20 8l6 4M10 16h9" />
        </>
      )}
      {stage === "Recruiter Screen" && (
        <>
          <path d="M18 30h44l7 26H11z" fill="var(--gauntlet-amber)" />
          <path
            d="M19 15q21-14 42 0l3 12H51l-3-9H32l-3 9H16z"
            fill="var(--gauntlet-paper)"
          />
          <circle cx="40" cy="42" r="9" />
          <circle cx="40" cy="42" r="3" />
          <path d="M7 13 3 9m70 4 4-4M7 22H2m71 0h5" />
        </>
      )}
      {stage === "Interview" && (
        <>
          <path d="M9 10h42v26H27l-9 8v-8H9z" fill="var(--gauntlet-paper)" />
          <path d="M38 29h32v23h-8v8l-9-8H38z" fill="var(--gauntlet-amber)" />
          <path d="M18 20h24M18 27h17M46 38h16M46 44h12" />
        </>
      )}
      {stage === "Technical" && (
        <>
          <path
            d="M15 14h20q-6-11 5-11t5 11h20v17q-11-6-11 5t11 5v17H45q6-11-5-11t-5 11H15V41q11 6 11-5t-11-5z"
            fill="var(--gauntlet-amber)"
          />
          <path d="m35 27-6 7 6 7m10-14 6 7-6 7" />
        </>
      )}
      {stage === "Final" && (
        <>
          <path
            d="M17 58V17h46v41M12 17h56L40 5z"
            fill="var(--gauntlet-paper)"
          />
          <path d="M25 58V24h30v34" fill="var(--gauntlet-amber)" />
          <path d="M39 24v34M12 58h56" />
          <circle cx="45" cy="42" r="1.5" />
          <path d="m69 9 3-5m-1 16h6" />
        </>
      )}
      {stage === "Offer" && (
        <>
          <path d="M22 8h36v49H22z" fill="var(--gauntlet-paper)" />
          <path d="M30 18h20M30 25h15" />
          <circle cx="41" cy="40" r="9" fill="var(--gauntlet-amber)" />
          <path d="m35 47-3 14 9-5 9 5-3-14m-11-7 3 3 7-7M12 14l-4-5m58 5 5-5M8 31H3m66-1h6" />
        </>
      )}
      {stage === "Rejected" && (
        <>
          <path d="M14 23h51v33H14z" fill="var(--gauntlet-paper)" />
          <path d="m14 23 26 20 25-20" />
          <path d="m29 8 24 4-3 17-24-4z" fill="var(--gauntlet-red-paper)" />
          <path d="m35 15 10 9m1-8-12 7" />
        </>
      )}
      {stage === "Unknown" && (
        <>
          <path d="M15 20h21l6 6h24v31H15z" fill="var(--gauntlet-paper)" />
          <path d="M33 37q0-10 10-7 8 4-1 10v4m0 6v1" />
        </>
      )}
    </svg>
  );
}
