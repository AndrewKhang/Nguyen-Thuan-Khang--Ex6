// scatterplot.js
// Exercise 6.1 - Scatterplot

const drawScatterplot = (data) => {
    // --- Chart dimensions ---
    const marginS = { top: 40, right: 150, bottom: 60, left: 80 };
    const widthS = 900 - marginS.left - marginS.right;
    const heightS = 500 - marginS.top - marginS.bottom;
  
    // --- Create SVG container ---
    const svgS = d3.select("#scatterplot")
      .append("svg")
      .attr("width", widthS + marginS.left + marginS.right)
      .attr("height", heightS + marginS.top + marginS.bottom)
      .append("g")
      .attr("transform", `translate(${marginS.left},${marginS.top})`);
  
    // Gán vào shared constant để tooltip dùng được
    innerChartS = svgS;
  
    // --- Scales ---
    xScaleS = d3.scaleLinear()
      .domain(d3.extent(data, d => d.screenSize))
      .nice()
      .range([0, widthS]);
  
    yScaleS = d3.scaleLinear()
      .domain(d3.extent(data, d => d.energyConsumption))
      .nice()
      .range([heightS, 0]);
  
    const colorScaleS = d3.scaleOrdinal()
      .domain(["LED", "LCD", "OLED"])
      .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);
  
    // --- Axes ---
    svgS.append("g")
      .attr("transform", `translate(0,${heightS})`)
      .call(d3.axisBottom(xScaleS));
  
    svgS.append("g")
      .call(d3.axisLeft(yScaleS));
  
    // --- Axis labels ---
    svgS.append("text")
      .attr("x", widthS / 2)
      .attr("y", heightS + 45)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Screen Size (inches)");
  
    svgS.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -heightS / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Annual Energy (kWh)");
  
    // --- Circles (data points) ---
    svgS.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScaleS(d.screenSize))
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("r", 5)
      .attr("fill", d => colorScaleS(d.screenTech))
      .attr("opacity", 0.6);
  
    // --- Legend ---
    const legend = svgS.selectAll(".legend")
      .data(colorScaleS.domain())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0, ${i * 25})`);
  
    legend.append("rect")
      .attr("x", widthS + 20)
      .attr("y", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", colorScaleS);
  
    legend.append("text")
      .attr("x", widthS + 45)
      .attr("y", 13)
      .text(d => d)
      .style("font-size", "13px");
  
    // --- Tooltip setup ---
    const tooltip = createTooltipScatter();
    handleScatterEvents(tooltip);
  };
  