import type { Group } from "../types/dashboard";
import { Panel, Empty } from "../components/Panel";
import { DataTable } from "../components/DataTable";
import { LazyChart } from "./LazyChart";
export function Distribution({
  title,
  description,
  groups,
  total,
  color = "#548f84",
}: {
  title: string;
  description: string;
  groups: Group[];
  total: number;
  color?: string;
}) {
  return (
    <Panel title={title} description={description} className="distribution">
      {groups.length ? (
        <LazyChart
          data={[
            {
              type: "bar",
              orientation: "h",
              y: groups.map((g) =>
                g.label === "Unknown"
                  ? g.label
                  : title === "Priority mix"
                    ? "Tier " + g.label
                    : g.label,
              ),
              x: groups.map((g) => g.count),
              marker: { color },
              text: groups.map((g) => String(g.count)),
              textposition: "outside",
              cliponaxis: false,
              hovertemplate: "%{y}<br>%{x} submissions<extra></extra>",
            },
          ]}
          layout={{
            height: Math.max(200, groups.length * 34 + 42),
            margin: {
              l: title === "Role distribution" ? 145 : 118,
              r: 28,
              t: 12,
              b: 30,
            },
            bargap: 0.5,
            xaxis: {
              showgrid: true,
              gridcolor: "#edf0eb",
              zeroline: false,
              fixedrange: true,
              rangemode: "tozero",
              tickformat: ".0f",
            },
            yaxis: {
              autorange: "reversed",
              fixedrange: true,
              tickfont: { size: 10 },
            },
            showlegend: false,
          }}
        />
      ) : (
        <Empty />
      )}
      <DataTable
        groups={groups}
        total={total}
        caption={`${title} · share of ${total} eligible submissions`}
      />
    </Panel>
  );
}
