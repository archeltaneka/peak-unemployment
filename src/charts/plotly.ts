// Only ship the three trace types used by this dashboard.
import Plotly from "plotly.js/lib/core";
import bar from "plotly.js/lib/bar";
import scatter from "plotly.js/lib/scatter";
import scattergeo from "plotly.js/lib/scattergeo";
Plotly.register([bar, scatter, scattergeo]);
export default Plotly;
