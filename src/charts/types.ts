import type { Config, Data, Layout, PlotMouseEvent } from "plotly.js";
export interface ChartProps {
  data: Data[];
  layout?: Partial<Layout>;
  config?: Partial<Config>;
  onClick?: (event: PlotMouseEvent) => void;
  onError?: (error: Error) => void;
}
