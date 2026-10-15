import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "./plotly";
import { useEffect, useRef, useState } from "react";
import type { ChartProps } from "./types";
const Plot = createPlotlyComponent(Plotly);
export default function Chart({ layout, ...props }: ChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width)),
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="plot-container" aria-hidden="true">
      <Plot
        {...props}
        layout={{
          autosize: false,
          width,
          height: 280,
          margin: { l: 40, r: 16, t: 16, b: 42 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          font: {
            family: "Manrope Variable, sans-serif",
            size: 11,
            color: "#63706b",
          },
          hoverlabel: { bgcolor: "#183f37", font: { color: "#fff", size: 12 } },
          ...layout,
        }}
        config={{
          displayModeBar: false,
          responsive: true,
          scrollZoom: false,
          topojsonURL: "/",
          ...props.config,
        }}
      />
    </div>
  );
}
