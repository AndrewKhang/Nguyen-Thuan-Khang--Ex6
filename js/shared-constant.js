// shared-constant.js

// Chart margins and dimensions
const margin = { top: 50, right: 30, bottom: 50, left: 70 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;





// Step 6.2 — Bin generator
// We’ll use screen size for histogram bins
const binGenerator = d3.bin()
  .value(d => d.screenSize)   // field used to make bins
  .domain([0, 300])           // adjust range to your data
  .thresholds(15);            // number of bins

// Step 7.2 — Filters setup
const filters_screen = [
  { id: "all", label: "All", isActive: true },
  { id: "LED", label: "LED", isActive: false },
  { id: "LCD", label: "LCD", isActive: false },
  { id: "OLED", label: "OLED", isActive: false },
];

// === Shared constants for scatterplot ===

// SVG margins and dimensions
const marginS = { top: 30, right: 30, bottom: 60, left: 70 };
const widthS = 800 - marginS.left - marginS.right;
const heightS = 500 - marginS.top - marginS.bottom;

// Scales for scatterplot
let xScaleS, yScaleS;

// Inner chart group for scatterplot
let innerChartS;

// Tooltip dimensions
const tooltipWidth = 120;
const tooltipHeight = 40;

// Colour scale for screen type
const colorScale = d3.scaleOrdinal()
  .domain(["LED", "LCD", "OLED"])
  .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);

