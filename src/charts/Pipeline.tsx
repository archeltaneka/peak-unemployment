import type { CSSProperties } from "react";
import type { Group, Status } from "../types/dashboard";
import { number } from "../lib/presentation";
import {
  cohortShare,
  journeyStations,
  furthestJourneyStage,
} from "../lib/journey";
import { CheckpointArt } from "./CheckpointArt";
import "./HiringGauntlet.css";

const checkpointCopy: Record<Status, string> = {
  Discovered: "AI found my dream job. The requirements found my nightmares.",
  Preparing: "Prompt engineering my way into pretending I'm qualified.",
  Applied: "My AI-generated CV is fighting their AI-powered ATS.",
  "Recruiter Screen": "Passed the CAPTCHA. Apparently I'm human enough.",
  Interview: "ChatGPT prepared me for questions nobody asked.",
  Technical: "Training data ended right before this question.",
  Final: "At this point, even my hallucinations have imposter syndrome.",
  Offer: "After 200 prompts, the universe finally returned 200 OK.",
  Rejected: "Their AI and my AI have agreed I'm unemployed.",
  Unknown: "The paperwork has wandered off-map.",
};
// Each segment ends at a checkpoint, so the highlight never overshoots it.
const routeSegments = [
  "M125 60H375",
  "M375 60H625",
  "M625 60H875",
  "M875 60C1010 60 1010 320 875 320",
  "M875 320H625",
  "M625 320H375",
  "M375 320H125",
];
function percentage(count: number | null, total: number) {
  const value = cohortShare(count, total);
  return value === null
    ? null
    : `${value.toLocaleString("en", { maximumFractionDigits: 1 })}%`;
}

export function Pipeline({
  groups,
  total,
}: {
  groups: Group[];
  total: number;
}) {
  const stations = journeyStations(groups);
  const furthest = furthestJourneyStage(groups);
  function checkpoint(label: Status, count: number | null, index?: number) {
    const share = percentage(count, total);
    return (
      <div className={`gauntlet-checkpoint${count === 0 ? " is-empty" : ""}`}>
        <div
          className="gauntlet-stage"
          role="group"
          aria-label={`${label}: ${count === null ? "count unavailable" : `${number(count)} current record${count === 1 ? "" : "s"}`}, ${share === null ? "share unavailable" : `${share} of filtered opportunities`}.`}
        >
          <span
            className={`gauntlet-art${label === "Discovered" || label === "Preparing" ? " is-enabled" : ""}`}
          >
            <CheckpointArt stage={label} />
            {index !== undefined && (
              <span className="gauntlet-step">{index + 1}</span>
            )}
          </span>
          <span className="gauntlet-stage-name">{label}</span>
          {index !== undefined && (
            <span className="gauntlet-tagline">{checkpointCopy[label]}</span>
          )}
          <span className="gauntlet-count">
            {count === null ? "—" : number(count)}
          </span>
          <span className="gauntlet-share">
            {share === null ? "Share unavailable" : `${share} of cohort`}
          </span>
        </div>
      </div>
    );
  }
  return (
    <section
      className="hiring-gauntlet"
      id="journey"
      aria-labelledby="journey-title"
    >
      <header className="gauntlet-heading">
        <div>
          <h2 id="journey-title">The Hiring Gauntlet</h2>
          <p>A journey of hope, paperwork, and “just one more round.”</p>
        </div>
        <p className="gauntlet-total">
          <strong>{number(total)}</strong>
          <span>
            opportunities <br />
            in this view
          </span>
        </p>
      </header>
      <div className="gauntlet-board">
        <div
          className="gauntlet-route"
          key={furthest}
          style={{ "--pulse-delay": `${Math.max(0, furthest) * 220}ms` } as CSSProperties}
        >
          <svg
            className="gauntlet-track"
            viewBox="0 0 1000 520"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M125 60H875C1010 60 1010 320 875 320H125" />
            <path
              d="M125 60H875C1010 60 1010 320 875 320H125"
              className="gauntlet-track-stitches"
            />
            {routeSegments.slice(0, Math.max(0, furthest)).map((d, index) => (
              <path
                key={d}
                d={d}
                pathLength={1}
                className="gauntlet-track-progress"
                style={{ "--path-delay": `${index * 220}ms` } as CSSProperties}
              />
            ))}
            {furthest > 0 && (
              <path
                className="gauntlet-track-sweep"
                d={routeSegments.slice(0, furthest).map((segment, index) =>
                  index === 0 ? segment : segment.replace(/^M\d+ \d+/, ""),
                ).join(" ")}
                pathLength={1}
              />
            )}
          </svg>
          {furthest > 0 && (
            <svg
              className="gauntlet-mobile-sweep"
              viewBox="0 0 10 7"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="gauntlet-track-sweep"
                d={`M5 0V${furthest}`}
                pathLength={1}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
          <ol
            className="gauntlet-stages"
            aria-label="Typical hiring journey checkpoints"
          >
            {stations.slice(0, 8).map(({ label, count }, index) => (
              <li
                key={label}
                className={
                  index < furthest ? "gauntlet-path-active" : undefined
                }
                style={{ "--path-delay": `${index * 220}ms` } as CSSProperties}
              >
                {checkpoint(label, count, index)}
              </li>
            ))}
          </ol>
        </div>
        <div
          className="gauntlet-outcomes"
          role="group"
          aria-label="Separate outcomes"
        >
          <div className="gauntlet-rejected">
            {checkpoint("Rejected", stations[8].count)}
            <div>
              <h3>A different ending.</h3>
              <p>{checkpointCopy.Rejected}</p>
              <p className="gauntlet-outcome-note">
                Separate terminal outcome. Can occur after any submitted stage.
              </p>
            </div>
          </div>
          {stations[9].count !== 0 && (
            <div className="gauntlet-unknown">
              {checkpoint("Unknown", stations[9].count)}
              <p>
                {checkpointCopy.Unknown} Still in the total; no stage assumed.
              </p>
            </div>
          )}
        </div>
      </div>
      <p className="gauntlet-note">
        {total === 0 &&
          "No opportunities match these filters. Adjust or reset your filters to explore the search. "}
        Counts show where records are now, not how many passed through each
        step.
      </p>
    </section>
  );
}
