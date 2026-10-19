import { useState } from "react";
import type { Geography as Country } from "../types/dashboard";
import { Panel, Empty } from "../components/Panel";
import { LazyChart } from "./LazyChart";
export function Geography({
  groups,
  total,
  selected,
  onSelect,
}: {
  groups: Country[];
  total: number;
  selected?: string;
  onSelect: (country: string) => void;
}) {
  const [mapError, setMapError] = useState(false);
  const plotted = groups.filter((g) => g.iso !== null);
  const max = Math.max(1, ...plotted.map((g) => g.count));
  return (
    <Panel
      id="geography"
      title="Unemployment Without Borders"
      description="Taking rejection to an international level. Select a country to explore."
      className="geography"
      actions={
        selected ? (
          <button className="text-button" onClick={() => onSelect("")}>
            Clear {selected}
          </button>
        ) : (
          <span className="subtle-badge">
            {groups.filter((g) => g.iso).length} countries
          </span>
        )
      }
    >
      <div className="geography-body">
        <div className="map">
          {mapError ? (
            <Empty>
              The map couldn’t load. Select a country from the table.
            </Empty>
          ) : plotted.length ? (
            <LazyChart
              onError={() => setMapError(true)}
              data={[
                {
                  type: "scattergeo",
                  mode: "markers",
                  lat: plotted.map((g) => g.lat!),
                  lon: plotted.map((g) => g.lon!),
                  text: plotted.map((g) => g.label),
                  customdata: plotted.map((g) => g.count),
                  marker: {
                    size: plotted.map((g) => g.count),
                    sizemode: "area",
                    sizeref: (2 * max) / 42 ** 2,
                    sizemin: 4,
                    color: "#325ec4",
                    opacity: 0.75,
                    line: { width: 1.5, color: "#fff" },
                  },
                  hovertemplate:
                    "%{text}<br>%{customdata} submissions<extra></extra>",
                },
              ]}
              onClick={(event) => {
                const p = event.points[0];
                if (
                  p &&
                  typeof p.pointIndex === "number" &&
                  plotted[p.pointIndex]
                )
                  onSelect(plotted[p.pointIndex].label);
              }}
              layout={{
                height: 290,
                margin: { l: 0, r: 0, t: 0, b: 0 },
                geo: {
                  projection: { type: "natural earth" },
                  showframe: false,
                  showcoastlines: false,
                  showland: true,
                  landcolor: "#dce0e5",
                  showcountries: true,
                  countrycolor: "#f5f1e8",
                  bgcolor: "transparent",
                  lataxis: { range: [-60, 85] },
                },
              }}
            />
          ) : (
            <Empty>No countries to map in this selection.</Empty>
          )}
          <p className="chart-footnote">
            Bubble area represents submissions. Unknown locations remain in the
            table.
          </p>
        </div>
        <div className="country-list table-scroll">
          <table>
            <caption className="sr-only">
              Submissions by country; select a country to filter the dashboard
            </caption>
            <thead>
              <tr>
                <th>Country</th>
                <th>Count</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.label}>
                  <th scope="row">
                    <button
                      className="country-button"
                      aria-pressed={selected === g.label}
                      onClick={() =>
                        onSelect(selected === g.label ? "" : g.label)
                      }
                    >
                      {g.label}
                    </button>
                  </th>
                  <td>{g.count}</td>
                  <td>
                    {total ? ((100 * g.count) / total).toFixed(1) : "0.0"}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!groups.length && <Empty>No submissions found.</Empty>}
        </div>
      </div>
    </Panel>
  );
}
