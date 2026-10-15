import type { Group } from "../types/dashboard";
import { Panel } from "../components/Panel";
import { statusColors, number } from "../lib/presentation";
export function Pipeline({
  groups,
  total,
}: {
  groups: Group[];
  total: number;
}) {
  const max = Math.max(1, ...groups.map((g) => g.count));
  return (
    <Panel
      title="Where things stand"
      description="Current status · a snapshot, not a funnel"
      className="pipeline"
    >
      <ul className="stage-list">
        {groups
          .filter(
            (g) =>
              g.label !== "Rejected" && (g.label !== "Unknown" || g.count > 0),
          )
          .map((g) => (
            <li key={g.label}>
              <span className="stage-name">
                <i style={{ background: statusColors[g.label] }} />
                {g.label}
              </span>
              <span className="stage-track">
                <span
                  style={{
                    width: `${(g.count / max) * 100}%`,
                    background: statusColors[g.label],
                  }}
                />
              </span>
              <strong>{number(g.count)}</strong>
            </li>
          ))}
      </ul>
      <div className="terminal">
        <span>
          <i style={{ background: statusColors.Rejected }} />
          Rejected <small>Terminal outcome</small>
        </span>
        <strong>
          {number(groups.find((g) => g.label === "Rejected")?.count ?? 0)}
        </strong>
      </div>
      <p className="chart-footnote">
        All {number(total)} filtered opportunities, including records with
        submission conflicts. Counts are not conversion rates.
      </p>
    </Panel>
  );
}
