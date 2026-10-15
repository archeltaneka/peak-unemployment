import { Component, lazy, Suspense, type ReactNode } from "react";
import type { ChartProps } from "./types";
const Plot = lazy(() => import("./Plot"));
class ChartBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p className="empty">
        The chart couldn’t load. The data table is still available.
      </p>
    ) : (
      this.props.children
    );
  }
}
export function LazyChart(props: ChartProps) {
  return (
    <ChartBoundary>
      <Suspense
        fallback={<div className="chart-loading">Loading visualization…</div>}
      >
        <Plot {...props} />
      </Suspense>
    </ChartBoundary>
  );
}
