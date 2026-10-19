import { useState } from "react";
import type { Data } from "plotly.js";
import type { DashboardData } from "../types/dashboard";
import { Panel, Empty } from "../components/Panel";
import { LazyChart } from "./LazyChart";
import { shortDate } from "../lib/presentation";

const GRADUATION_DATE = "2026-10-15";

export function Activity({
  activity,
}: {
  activity: DashboardData["activity"];
}) {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
  const [cumulative, setCumulative] = useState(false);
  const points = activity[period];
  const showGraduation =
    period === "daily" &&
    !cumulative &&
    points.length > 0 &&
    points[0].date <= GRADUATION_DATE &&
    points[points.length - 1].date >= GRADUATION_DATE;
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
      title="Application Activity"
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
            margin: { l: 40, r: 16, t: showGraduation ? 40 : 16, b: 42 },
            shapes: showGraduation
              ? [
                  {
                    type: "line",
                    xref: "x",
                    x0: GRADUATION_DATE,
                    x1: GRADUATION_DATE,
                    yref: "paper",
                    y0: 0,
                    y1: 1,
                    line: { color: "#172d4d", width: 1.5, dash: "dash" },
                  },
                ]
              : [],
            annotations: showGraduation
              ? [
                  {
                    x: GRADUATION_DATE,
                    xref: "x",
                    y: 1,
                    yref: "paper",
                    yanchor: "bottom",
                    xanchor:
                      GRADUATION_DATE >
                      points[Math.floor(points.length / 2)].date
                        ? "right"
                        : "left",
                    yshift: 6,
                    text: "Master’s graduation · Oct 15",
                    showarrow: false,
                    font: { size: 10, color: "#172d4d" },
                  },
                ]
              : [],
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
        {showGraduation
          ? " Dashed line: Master’s graduation on October 15, 2026."
          : ""}
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
