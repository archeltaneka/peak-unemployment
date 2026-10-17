import type { Group, Status } from "../types/dashboard";
import { number } from "../lib/presentation";
import { cohortShare, journeyStations } from "../lib/journey";

export function Pipeline({
  groups,
  total,
}: {
  groups: Group[];
  total: number;
}) {
  const stations = journeyStations(groups);
  function station(label: Status | "Total", count: number | null) {
    const share = cohortShare(count, total);
    return (
      <div
        className={
          "route-station" +
          (label === "Total"
            ? " route-total"
            : label === "Offer"
              ? " route-offer"
              : "")
        }
      >
        <strong className="station-circle">
          {count === null ? "—" : number(count)}
        </strong>
        <span className="station-label">
          {label === "Total" ? "Total tracked" : label}
        </span>
        <span className="station-share">
          {share === null
            ? "Share unavailable"
            : `${share.toLocaleString("en", { maximumFractionDigits: 1 })}% of cohort`}
        </span>
      </div>
    );
  }
  return (
    <section className="journey" id="journey" aria-labelledby="journey-title">
      <div className="journey-heading">
        <div>
          <h2 id="journey-title">Application journey</h2>
          <p>
            From first possibility to an offer. Where the search stands today.
          </p>
        </div>
        <span className="snapshot-label">
          Current status · not historical transitions
        </span>
      </div>
      <div className="route-map">
        <ol
          className="route-main"
          aria-label="Recruitment status path toward an offer"
        >
          <li>{station("Total", total)}</li>
          {stations.slice(0, 8).map(({ label, count }) => (
            <li key={label}>{station(label, count)}</li>
          ))}
        </ol>
        <div className="route-branches" aria-label="Separate outcomes">
          <div className="route-rejected">
            {station("Rejected", stations[8].count)}
            <p>A separate outcome. Possible at any stage.</p>
          </div>
          {stations[9].count !== 0 && (
            <div className="route-unknown">
              {station("Unknown", stations[9].count)}
              <p>Kept in the total. No stage assumed.</p>
            </div>
          )}
        </div>
      </div>
      <p className="journey-note">
        {total === 0
          ? "No opportunities match these filters. Adjust or reset your filters to explore the search. "
          : ""}
        Counts show where records are now, not how many passed through each
        step. Includes submission conflicts; shares are not conversion rates.
        Offer does not imply acceptance.
      </p>
    </section>
  );
}
