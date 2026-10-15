import type { Group } from "../types/dashboard";
import { number } from "../lib/presentation";
export function DataTable({
  groups,
  total,
  caption = "Chart data",
}: {
  groups: Group[];
  total: number;
  caption?: string;
}) {
  return (
    <details className="chart-data">
      <summary>View data table</summary>
      <div className="table-scroll">
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Count</th>
              <th scope="col">Share</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.label}>
                <th scope="row">{g.label}</th>
                <td>{number(g.count)}</td>
                <td>{total ? ((g.count / total) * 100).toFixed(1) : "0.0"}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
