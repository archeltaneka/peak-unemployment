import type { Group, Status } from "../types/dashboard";
import { number } from "../lib/presentation";
import { cohortShare, journeyStations } from "../lib/journey";
import { CheckpointArt } from "./CheckpointArt";
import "./HiringGauntlet.css";

const checkpointCopy: Record<Status, string> = {
  Discovered: "An opportunity worth a closer look.",
  Preparing: "Research, résumé, and one more proofread.",
  Applied: "Submitted. The waiting begins.",
  "Recruiter Screen": "An initial conversation about the fit.",
  Interview: "Experience meets questions.",
  Technical: "Putting the skills to work.",
  Final: "The last conversations before a decision.",
  Offer: "An offer on the table; acceptance is separate.",
  Rejected: "An outcome, not a step after Offer.",
  Unknown: "No reliable status recorded.",
};
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
          <h2 id="journey-title">The Waiting Game</h2>
          <p>Current status snapshot — each record counted once.</p>
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
        <p className="gauntlet-route-disclaimer">
          Route illustrates typical order, not recorded movement or conversion.
        </p>
        <div className="gauntlet-route">
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
          </svg>
          <ol
            className="gauntlet-stages"
            aria-label="Current application statuses"
          >
            {stations.slice(0, 8).map(({ label, count }, index) => (
              <li key={label}>{checkpoint(label, count, index)}</li>
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
              <h3>A Different Ending.</h3>
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
