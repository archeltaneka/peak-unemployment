import { useState } from "react";
import type { Data } from "plotly.js";
import type { DashboardData } from "../types/dashboard";
import { Panel, Empty } from "../components/Panel";
import { LazyChart } from "./LazyChart";
import { shortDate } from "../lib/presentation";
export function Activity({
  activity,
}: {
  activity: DashboardData["activity"];
}) {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "weekly",
  );
  const [cumulative, setCumulative] = useState(false);
  const points = activity[period];
  const traces: Data[] = [
    {
      ...(cumulative
        ? {
            type: "scatter" as const,
            mode: "lines" as const,
            fill: "tozeroy" as const,
            line: { color: "#325ec4", width: 2.5 },
            fillcolor: "rgba(50,94,196,0.08)",
          }
        : { type: "bar" as const }),
      x: points.map((p) => p.date),
      y: points.map((p) => (cumulative ? p.cumulative : p.count)),
      name: cumulative ? "Cumulative" : "Applications",
      marker: { color: points.map((p) => (p.partial ? "#b8c6df" : "#325ec4")) },
      customdata: points.map((p) =>
        p.partial ? "Partial period" : "Complete period",
      ),
      hovertemplate:
        "%{x|%b %d, %Y}<br>%{y} applications<br>%{customdata}<extra></extra>",
    },
  ];
  if (period === "daily" && !cumulative)
    traces.push({
      type: "scatter",
      mode: "lines",
      x: points.map((p) => p.date),
      y: points.map((p) => p.average),
      name: "7-day average",
      line: { color: "#ae7838", width: 2 },
      connectgaps: false,
      hovertemplate:
        "%{x|%b %d}<br>%{y:.2f} per day<extra>7-day average</extra>",
    });
  return (
    <Panel
      title="Application activity"
      description="Putting the work into looking for work."
      className="activity"
      actions={
        <div className="segmented" aria-label="Activity interval">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              aria-pressed={period === p}
              onClick={() => setPeriod(p)}
            >
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      }
    >
      <div className="chart-toolbar">
        <span className="legend">
          <i />
          {cumulative ? "Cumulative applications" : "Applications"}
          {period === "daily" && !cumulative && (
            <>
              <i className="average" />
              7-day average
            </>
          )}
        </span>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={cumulative}
            onChange={(e) => setCumulative(e.target.checked)}
          />
          Cumulative
        </label>
      </div>
      {points.length ? (
        <LazyChart
          data={traces}
          layout={{
            height: 285,
            showlegend: false,
            bargap: 0.32,
            xaxis: {
              type: "date",
              showgrid: false,
              zeroline: false,
              tickformat: period === "monthly" ? "%b %Y" : "%b %d",
              nticks: 6,
              fixedrange: true,
            },
            yaxis: {
              rangemode: "tozero",
              gridcolor: "#dedfdc",
              zeroline: false,
              fixedrange: true,
              tickformat: ".0f",
              title: { text: "Applications", font: { size: 10 } },
            },
          }}
        />
      ) : (
        <Empty />
      )}
      <p className="chart-footnote">
        {activity.start && activity.end
          ? `${shortDate(activity.start)} – ${shortDate(activity.end)} · `
          : ""}
        Pale bars mark partial periods.{" "}
        {cumulative
          ? "Total starts at the display window."
          : "Zero-application days are included."}
        {period === "daily" && !cumulative
          ? " Average begins after seven observed calendar days; it includes prior days outside applied-date bounds."
          : ""}
        {activity.truncated ? " Display limited to the latest 3,661 days." : ""}
      </p>
      <details className="chart-data">
        <summary>View activity data</summary>
        <div className="table-scroll activity-table">
          <table>
            <caption>{period} application counts</caption>
            <thead>
              <tr>
                <th>Period start</th>
                <th>Applications</th>
                <th>Cumulative</th>
                {period === "daily" && <th>7-day average</th>}
                <th>Coverage</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.date}>
                  <th scope="row">{p.date}</th>
                  <td>{p.count}</td>
                  <td>{p.cumulative}</td>
                  {period === "daily" && (
                    <td>
                      {p.average === null
                        ? "Not yet available"
                        : p.average.toFixed(2)}
                    </td>
                  )}
                  <td>{p.partial ? "Partial" : "Complete"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </Panel>
  );
}
