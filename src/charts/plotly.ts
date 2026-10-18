// Only ship the trace types used by this dashboard.
import Plotly from "plotly.js/lib/core";
import bar from "plotly.js/lib/bar";
import scatter from "plotly.js/lib/scatter";
import scattergeo from "plotly.js/lib/scattergeo";
import pie from "plotly.js/lib/pie";
Plotly.register([bar, scatter, scattergeo, pie]);
export default Plotly;
