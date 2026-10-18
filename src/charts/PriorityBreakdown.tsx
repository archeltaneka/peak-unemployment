import type { Group } from "../types/dashboard";
import { Panel, Empty } from "../components/Panel";
import { DataTable } from "../components/DataTable";
import { LazyChart } from "./LazyChart";

const colors: Record<string, string> = {
  A: "#325ec4",
  B: "#59799a",
  C: "#9a7852",
  Unknown: "#91978d",
};

export function PriorityBreakdown({
  groups,
  total,
}: {
  groups: Group[];
  total: number;
}) {
  const ordered = ["A", "B", "C", "Unknown"].flatMap((label) =>
    groups.filter((group) => group.label === label && group.count > 0),
  );
  return (
    <Panel
      title="Application Priority Breakdown"
      description="Priority tiers · eligible submissions in this filtered view"
      className="distribution"
    >
      {ordered.length ? (
        <LazyChart
          data={[
            {
              type: "pie",
              hole: 0.6,
              labels: ordered.map((g) =>
                g.label === "Unknown" ? g.label : `Tier ${g.label}`,
              ),
              values: ordered.map((g) => g.count),
              marker: {
                colors: ordered.map((g) => colors[g.label]),
                line: { color: "#f5f1e8", width: 2 },
              },
              sort: false,
              direction: "clockwise",
              textinfo: "none",
              hovertemplate:
                "%{label}<br>%{value} submissions · %{percent}<extra></extra>",
            },
          ]}
          layout={{
            height: 280,
            margin: { l: 12, r: 12, t: 12, b: 48 },
            showlegend: true,
            legend: {
              orientation: "h",
              x: 0.5,
              xanchor: "center",
              y: -0.12,
              yanchor: "top",
              itemclick: false,
              itemdoubleclick: false,
            },
            annotations: [
              {
                x: 0.5,
                y: 0.5,
                xref: "paper",
                yref: "paper",
                text: `${total}<br>submissions`,
                showarrow: false,
                font: { size: 16, color: "#172d4d" },
              },
            ],
          }}
        />
      ) : (
        <Empty />
      )}
      <dl className="priority-tier-descriptions">
        <div>
          <dt>Tier A · High priority</dt>
          <dd>Dream companies, strong role fit, desirable location</dd>
        </div>
        <div>
          <dt>Tier B · Medium priority</dt>
          <dd>Good opportunities, reasonable fit</dd>
        </div>
        <div>
          <dt>Tier C · Low priority</dt>
          <dd>Backup applications, weaker fit</dd>
        </div>
      </dl>
      <DataTable
        groups={ordered}
        total={total}
        caption={`Application Priority Breakdown · share of ${total} eligible submissions`}
      />
    </Panel>
  );
}
